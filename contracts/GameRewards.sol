// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SudoToken.sol";

/**
 * @title GameRewards
 * @dev Manages reward distribution for CyberHack gaming platform
 */
contract GameRewards is Ownable, Pausable, ReentrancyGuard {
    
    SudoToken public immutable sudoToken;
    
    // Reward configuration
    struct RewardConfig {
        uint256 minReward;      // Minimum reward per game
        uint256 maxReward;      // Maximum reward per game  
        uint256 multiplier;     // Base multiplier (scaled by 1000)
        bool isActive;          // Whether game rewards are active
    }
    
    // Player statistics
    struct PlayerStats {
        uint256 totalEarned;    // Total tokens earned
        uint256 gamesPlayed;    // Total games completed
        uint256 lastRewardTime; // Last reward timestamp
        uint256 streak;         // Current daily streak
        uint256 level;          // Player level
    }
    
    // Game types and their reward configurations
    mapping(string => RewardConfig) public gameRewards;
    mapping(address => PlayerStats) public playerStats;
    mapping(address => uint256) public pendingRewards;
    
    // Platform settings
    uint256 public dailyRewardCap = 10000 * 10**18; // 10K SUDO per day per player
    uint256 public streakMultiplier = 1200; // 1.2x multiplier for streaks (scaled by 1000)
    uint256 public levelMultiplier = 50; // 5% bonus per level (scaled by 1000)
    
    // Anti-abuse settings
    mapping(address => uint256) public dailyRewardsClaimed;
    mapping(address => uint256) public lastRewardDate;
    uint256 public constant MIN_REWARD_INTERVAL = 30 seconds; // Minimum time between rewards
    
    // Events
    event RewardDistributed(address indexed player, uint256 amount, string gameType);
    event RewardsClaimed(address indexed player, uint256 amount);
    event GameRewardConfigured(string indexed gameType, uint256 minReward, uint256 maxReward);
    event PlayerLevelUp(address indexed player, uint256 newLevel);
    event StreakUpdated(address indexed player, uint256 streak);
    
    constructor(address _sudoToken) Ownable(_msgSender()) {
        sudoToken = SudoToken(_sudoToken);
        
        // Initialize default game reward configurations
        _setGameReward("password-crack", 50 * 10**18, 200 * 10**18, 1000);
        _setGameReward("network-scan", 25 * 10**18, 150 * 10**18, 1000);
        _setGameReward("sql-inject", 100 * 10**18, 500 * 10**18, 1000);
        _setGameReward("social-eng", 75 * 10**18, 300 * 10**18, 1000);
        _setGameReward("crypto-break", 200 * 10**18, 1000 * 10**18, 1000);
        _setGameReward("zero-day", 500 * 10**18, 5000 * 10**18, 1000);
    }
    
    /**
     * @dev Distribute rewards to player after game completion
     */
    function distributeReward(
        address player,
        uint256 baseScore,
        string calldata gameType,
        uint256 timeSpent,
        bool perfectScore
    ) external onlyOwner whenNotPaused nonReentrant {
        require(player != address(0), "Invalid player address");
        require(gameRewards[gameType].isActive, "Game type not active");
        require(
            block.timestamp >= playerStats[player].lastRewardTime+(MIN_REWARD_INTERVAL),
            "Too frequent reward claims"
        );
        
        // Check daily cap
        uint256 currentDate = block.timestamp / 1 days;
        if (lastRewardDate[player] != currentDate) {
            dailyRewardsClaimed[player] = 0;
            lastRewardDate[player] = currentDate;
            _updateStreak(player);
        }
        
        require(
            dailyRewardsClaimed[player] < dailyRewardCap,
            "Daily reward cap exceeded"
        );
        
        // Calculate base reward
        uint256 reward = _calculateBaseReward(baseScore, gameType, timeSpent, perfectScore);
        
        // Apply multipliers
        reward = _applyMultipliers(player, reward);
        
        // Ensure within daily cap
        if (dailyRewardsClaimed[player]+(reward) > dailyRewardCap) {
            reward = dailyRewardCap-(dailyRewardsClaimed[player]);
        }
        
        // Update player stats
        _updatePlayerStats(player, reward);
        
        // Add to pending rewards
        pendingRewards[player] = pendingRewards[player]+(reward);
        dailyRewardsClaimed[player] = dailyRewardsClaimed[player]+(reward);
        
        emit RewardDistributed(player, reward, gameType);
    }
    
    /**
     * @dev Claim pending rewards
     */
    function claimRewards() external nonReentrant whenNotPaused {
        uint256 amount = pendingRewards[_msgSender()];
        require(amount > 0, "No rewards to claim");
        
        pendingRewards[_msgSender()] = 0;
        
        // Mint tokens to player
        sudoToken.mintForAllocation(_msgSender(), amount, "gaming_rewards");
        
        emit RewardsClaimed(_msgSender(), amount);
    }
    
    /**
     * @dev Calculate base reward amount
     */
    function _calculateBaseReward(
        uint256 baseScore,
        string memory gameType,
        uint256 timeSpent,
        bool perfectScore
    ) internal view returns (uint256) {
        RewardConfig memory config = gameRewards[gameType];
        
        // Score-based calculation (normalize score to 0-1 range)
        uint256 scoreRatio = baseScore > 10000 ? 1000 : (baseScore * 1000) / 10000;
        
        // Time bonus (faster completion = higher reward)
        uint256 timeBonus = timeSpent < 60 ? 200 : timeSpent < 180 ? 150 : 100; // 2x, 1.5x, 1x
        
        // Perfect score bonus
        uint256 perfectBonus = perfectScore ? 150 : 100; // 1.5x for perfect
        
        // Calculate reward within min-max range
        uint256 rewardRange = config.maxReward-(config.minReward);
        uint256 baseReward = config.minReward + ((rewardRange * scoreRatio) / 1000);
        
        // Apply bonuses
        baseReward = (baseReward * timeBonus) / 100;
        baseReward = (baseReward * perfectBonus) / 100;
        
        return baseReward;
    }
    
    /**
     * @dev Apply player-specific multipliers
     */
    function _applyMultipliers(address player, uint256 baseReward) internal view returns (uint256) {
        PlayerStats memory stats = playerStats[player];
        uint256 reward = baseReward;
        
        // Streak multiplier
        if (stats.streak > 0) {
            uint256 streakBonus = streakMultiplier + (stats.streak * 50); // +5% per day
            reward = (reward * streakBonus) / 1000;
        }
        
        // Level multiplier
        if (stats.level > 1) {
            uint256 levelBonus = 1000 + (stats.level * levelMultiplier); // +5% per level
            reward = (reward * levelBonus) / 1000;
        }
        
        return reward;
    }
    
    /**
     * @dev Update player statistics
     */
    function _updatePlayerStats(address player, uint256 reward) internal {
        PlayerStats storage stats = playerStats[player];
        
        stats.totalEarned = stats.totalEarned+(reward);
        stats.gamesPlayed = stats.gamesPlayed+(1);
        stats.lastRewardTime = block.timestamp;
        
        // Level up calculation (every 10 games or 10K tokens earned)
        uint256 expectedLevel = (stats.gamesPlayed / 10) + (stats.totalEarned / (10000 * 10**18));
        if (expectedLevel > stats.level) {
            stats.level = expectedLevel;
            emit PlayerLevelUp(player, expectedLevel);
        }
    }
    
    /**
     * @dev Update player streak
     */
    function _updateStreak(address player) internal {
        PlayerStats storage stats = playerStats[player];
        uint256 currentDate = block.timestamp / 1 days;
        uint256 lastDate = lastRewardDate[player];
        
        if (lastDate == 0) {
            // First time playing
            stats.streak = 1;
        } else if (currentDate == lastDate + 1) {
            // Consecutive day
            stats.streak = stats.streak+(1);
        } else if (currentDate > lastDate + 1) {
            // Streak broken
            stats.streak = 1;
        }
        // Same day: no change to streak
        
        emit StreakUpdated(player, stats.streak);
    }
    
    /**
     * @dev Set game reward configuration (admin only)
     */
    function setGameReward(
        string calldata gameType,
        uint256 minReward,
        uint256 maxReward,
        uint256 multiplier
    ) external onlyOwner {
        _setGameReward(gameType, minReward, maxReward, multiplier);
    }
    
    function _setGameReward(
        string memory gameType,
        uint256 minReward,
        uint256 maxReward,
        uint256 multiplier
    ) internal {
        require(maxReward >= minReward, "Invalid reward range");
        require(multiplier >= 500 && multiplier <= 2000, "Invalid multiplier"); // 0.5x to 2x
        
        gameRewards[gameType] = RewardConfig({
            minReward: minReward,
            maxReward: maxReward,
            multiplier: multiplier,
            isActive: true
        });
        
        emit GameRewardConfigured(gameType, minReward, maxReward);
    }
    
    /**
     * @dev Toggle game reward status
     */
    function toggleGameReward(string calldata gameType) external onlyOwner {
        gameRewards[gameType].isActive = !gameRewards[gameType].isActive;
    }
    
    /**
     * @dev Update platform settings
     */
    function updatePlatformSettings(
        uint256 _dailyRewardCap,
        uint256 _streakMultiplier,
        uint256 _levelMultiplier
    ) external onlyOwner {
        dailyRewardCap = _dailyRewardCap;
        streakMultiplier = _streakMultiplier;
        levelMultiplier = _levelMultiplier;
    }
    
    /**
     * @dev Get player information
     */
    function getPlayerInfo(address player) external view returns (
        uint256 totalEarned,
        uint256 gamesPlayed,
        uint256 currentLevel,
        uint256 currentStreak,
        uint256 pendingReward,
        uint256 dailyClaimed
    ) {
        PlayerStats memory stats = playerStats[player];
        return (
            stats.totalEarned,
            stats.gamesPlayed,
            stats.level,
            stats.streak,
            pendingRewards[player],
            dailyRewardsClaimed[player]
        );
    }
    
    /**
     * @dev Emergency functions
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency reward distribution (for corrections)
     */
    function emergencyReward(address player, uint256 amount) external onlyOwner {
        require(amount <= 1000 * 10**18, "Emergency reward too large"); // Max 1K per call
        pendingRewards[player] = pendingRewards[player]+(amount);
    }
}
