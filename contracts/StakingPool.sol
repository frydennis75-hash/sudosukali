// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SudoToken.sol";

/**
 * @title StakingPool
 * @dev Staking contract for SUDO tokens with dynamic APY and lock periods
 */
contract StakingPool is Ownable, Pausable, ReentrancyGuard {
    
    SudoToken public immutable sudoToken;
    
    // Staking position structure
    struct StakingPosition {
        uint256 amount;           // Staked amount
        uint256 startTime;        // Stake start timestamp
        uint256 lastRewardTime;   // Last reward calculation time
        uint256 lockPeriod;       // Lock period in seconds
        uint256 apy;              // APY at time of staking (scaled by 10000)
        bool isActive;            // Whether position is active
    }
    
    // User staking data
    mapping(address => StakingPosition[]) public userPositions;
    mapping(address => uint256) public pendingRewards;
    
    // Pool statistics
    uint256 public totalStaked;
    uint256 public totalRewardsPaid;
    uint256 public totalStakers;
    mapping(address => bool) public hasStaked; // Track unique stakers
    
    // Pool configuration
    uint256 public currentAPY = 1570; // 15.7% APY (scaled by 100)
    uint256 public minStakeAmount = 10 * 10**18; // Minimum 10 SUDO
    uint256 public maxStakeAmount = 1000000 * 10**18; // Maximum 1M SUDO per position
    uint256 public minLockPeriod = 7 days; // Minimum lock period
    uint256 public maxLockPeriod = 365 days; // Maximum lock period
    
    // Tier-based APY bonuses
    struct StakingTier {
        uint256 threshold;  // Minimum stake amount for tier
        uint256 bonus;      // Bonus APY in basis points (scaled by 100)
    }
    
    StakingTier[] public stakingTiers;
    
    // Emergency settings
    bool public emergencyUnstakeEnabled = false;
    uint256 public emergencyUnstakeFee = 1000; // 10% fee (scaled by 100)
    
    // Events
    event Staked(address indexed user, uint256 amount, uint256 lockPeriod, uint256 apy);
    event Unstaked(address indexed user, uint256 positionId, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event APYUpdated(uint256 oldAPY, uint256 newAPY);
    event TierAdded(uint256 threshold, uint256 bonus);
    event EmergencyUnstake(address indexed user, uint256 amount, uint256 fee);
    
    constructor(address _sudoToken) Ownable(_msgSender()) {
        sudoToken = SudoToken(_sudoToken);
        
        // Initialize staking tiers
        stakingTiers.push(StakingTier(100 * 10**18, 100));    // 100+ SUDO: +1% APY
        stakingTiers.push(StakingTier(1000 * 10**18, 200));   // 1K+ SUDO: +2% APY
        stakingTiers.push(StakingTier(10000 * 10**18, 300));  // 10K+ SUDO: +3% APY
        stakingTiers.push(StakingTier(100000 * 10**18, 500)); // 100K+ SUDO: +5% APY
    }
    
    /**
     * @dev Stake SUDO tokens
     */
    function stake(uint256 amount, uint256 lockPeriod) external nonReentrant whenNotPaused {
        require(amount >= minStakeAmount, "Amount below minimum");
        require(amount <= maxStakeAmount, "Amount above maximum");
        require(lockPeriod >= minLockPeriod && lockPeriod <= maxLockPeriod, "Invalid lock period");
        
        // Transfer tokens to contract
        sudoToken.transferFrom(_msgSender(), address(this), amount);
        
        // Calculate effective APY with bonuses
        uint256 effectiveAPY = _calculateEffectiveAPY(amount, lockPeriod);
        
        // Create staking position
        userPositions[_msgSender()].push(StakingPosition({
            amount: amount,
            startTime: block.timestamp,
            lastRewardTime: block.timestamp,
            lockPeriod: lockPeriod,
            apy: effectiveAPY,
            isActive: true
        }));
        
        // Update pool statistics
        totalStaked = totalStaked+(amount);
        if (!hasStaked[_msgSender()]) {
            hasStaked[_msgSender()] = true;
            totalStakers = totalStakers+(1);
        }
        
        emit Staked(_msgSender(), amount, lockPeriod, effectiveAPY);
    }
    
    /**
     * @dev Unstake tokens (only after lock period)
     */
    function unstake(uint256 positionId) external nonReentrant {
        require(positionId < userPositions[_msgSender()].length, "Invalid position ID");
        
        StakingPosition storage position = userPositions[_msgSender()][positionId];
        require(position.isActive, "Position not active");
        require(
            block.timestamp >= position.startTime+(position.lockPeriod),
            "Lock period not expired"
        );
        
        uint256 amount = position.amount;
        
        // Calculate and add pending rewards
        uint256 rewards = _calculateRewards(_msgSender(), positionId);
        if (rewards > 0) {
            pendingRewards[_msgSender()] = pendingRewards[_msgSender()]+(rewards);
        }
        
        // Deactivate position
        position.isActive = false;
        totalStaked = totalStaked - amount;
        
        // Transfer tokens back to user
        sudoToken.transfer(_msgSender(), amount);
        
        emit Unstaked(_msgSender(), positionId, amount);
    }
    
    /**
     * @dev Emergency unstake with penalty (if enabled)
     */
    function emergencyUnstake(uint256 positionId) external nonReentrant {
        require(emergencyUnstakeEnabled, "Emergency unstake not enabled");
        require(positionId < userPositions[_msgSender()].length, "Invalid position ID");
        
        StakingPosition storage position = userPositions[_msgSender()][positionId];
        require(position.isActive, "Position not active");
        
        uint256 amount = position.amount;
        uint256 fee = (amount * emergencyUnstakeFee) / 10000;
        uint256 userAmount = amount - fee;
        
        // Deactivate position
        position.isActive = false;
        totalStaked = totalStaked - amount;
        
        // Transfer tokens (minus fee) back to user
        sudoToken.transfer(_msgSender(), userAmount);
        
        // Fee goes to treasury (keep in contract for now)
        emit EmergencyUnstake(_msgSender(), userAmount, fee);
    }
    
    /**
     * @dev Claim pending rewards
     */
    function claimRewards() external nonReentrant {
        _updateAllRewards(_msgSender());
        
        uint256 rewards = pendingRewards[_msgSender()];
        require(rewards > 0, "No rewards to claim");
        
        pendingRewards[_msgSender()] = 0;
        totalRewardsPaid = totalRewardsPaid+(rewards);
        
        // Mint reward tokens
        sudoToken.mintForAllocation(_msgSender(), rewards, "staking_rewards");
        
        emit RewardsClaimed(_msgSender(), rewards);
    }
    
    /**
     * @dev Calculate effective APY with bonuses
     */
    function _calculateEffectiveAPY(uint256 amount, uint256 lockPeriod) internal view returns (uint256) {
        uint256 effectiveAPY = currentAPY;
        
        // Tier-based bonus
        for (uint256 i = stakingTiers.length; i > 0; i--) {
            if (amount >= stakingTiers[i-1].threshold) {
                effectiveAPY = effectiveAPY+(stakingTiers[i-1].bonus);
                break;
            }
        }
        
        // Lock period bonus (longer lock = higher APY)
        if (lockPeriod >= 365 days) {
            effectiveAPY = effectiveAPY+(500); // +5% for 1 year lock
        } else if (lockPeriod >= 180 days) {
            effectiveAPY = effectiveAPY+(300); // +3% for 6 month lock
        } else if (lockPeriod >= 90 days) {
            effectiveAPY = effectiveAPY+(150); // +1.5% for 3 month lock
        }
        
        return effectiveAPY;
    }
    
    /**
     * @dev Calculate rewards for a specific position
     */
    function _calculateRewards(address user, uint256 positionId) internal view returns (uint256) {
        StakingPosition memory position = userPositions[user][positionId];
        if (!position.isActive) return 0;
        
        uint256 timeStaked = block.timestamp - position.lastRewardTime;
        uint256 yearlyReward = (position.amount * position.apy) / 10000;
        uint256 reward = (yearlyReward * timeStaked) / 365 days;
        
        return reward;
    }
    
    /**
     * @dev Update rewards for all user positions
     */
    function _updateAllRewards(address user) internal {
        StakingPosition[] storage positions = userPositions[user];
        
        for (uint256 i = 0; i < positions.length; i++) {
            if (positions[i].isActive) {
                uint256 rewards = _calculateRewards(user, i);
                if (rewards > 0) {
                    pendingRewards[user] = pendingRewards[user]+(rewards);
                    positions[i].lastRewardTime = block.timestamp;
                }
            }
        }
    }
    
    /**
     * @dev Get user's total staked amount and pending rewards
     */
    function getUserInfo(address user) external view returns (
        uint256 totalStakedAmount,
        uint256 totalPendingRewards,
        uint256 activePositions
    ) {
        StakingPosition[] memory positions = userPositions[user];
        uint256 pending = pendingRewards[user];
        
        for (uint256 i = 0; i < positions.length; i++) {
            if (positions[i].isActive) {
                totalStakedAmount = totalStakedAmount+(positions[i].amount);
                pending = pending+(_calculateRewards(user, i));
                activePositions++;
            }
        }
        
        return (totalStakedAmount, pending, activePositions);
    }
    
    /**
     * @dev Get user's staking positions
     */
    function getUserPositions(address user) external view returns (
        uint256[] memory amounts,
        uint256[] memory startTimes,
        uint256[] memory lockPeriods,
        uint256[] memory apys,
        bool[] memory isActive
    ) {
        StakingPosition[] memory positions = userPositions[user];
        uint256 length = positions.length;
        
        amounts = new uint256[](length);
        startTimes = new uint256[](length);
        lockPeriods = new uint256[](length);
        apys = new uint256[](length);
        isActive = new bool[](length);
        
        for (uint256 i = 0; i < length; i++) {
            amounts[i] = positions[i].amount;
            startTimes[i] = positions[i].startTime;
            lockPeriods[i] = positions[i].lockPeriod;
            apys[i] = positions[i].apy;
            isActive[i] = positions[i].isActive;
        }
    }
    
    /**
     * @dev Admin functions
     */
    function updateAPY(uint256 newAPY) external onlyOwner {
        require(newAPY >= 100 && newAPY <= 5000, "APY out of range"); // 1% to 50%
        
        uint256 oldAPY = currentAPY;
        currentAPY = newAPY;
        
        emit APYUpdated(oldAPY, newAPY);
    }
    
    function updateStakeAmounts(uint256 _minStakeAmount, uint256 _maxStakeAmount) external onlyOwner {
        require(_minStakeAmount > 0 && _maxStakeAmount > _minStakeAmount, "Invalid amounts");
        minStakeAmount = _minStakeAmount;
        maxStakeAmount = _maxStakeAmount;
    }
    
    function updateLockPeriods(uint256 _minLockPeriod, uint256 _maxLockPeriod) external onlyOwner {
        require(_minLockPeriod > 0 && _maxLockPeriod > _minLockPeriod, "Invalid periods");
        minLockPeriod = _minLockPeriod;
        maxLockPeriod = _maxLockPeriod;
    }
    
    function addStakingTier(uint256 threshold, uint256 bonus) external onlyOwner {
        require(threshold > 0 && bonus > 0 && bonus <= 1000, "Invalid tier parameters");
        stakingTiers.push(StakingTier(threshold, bonus));
        emit TierAdded(threshold, bonus);
    }
    
    function toggleEmergencyUnstake() external onlyOwner {
        emergencyUnstakeEnabled = !emergencyUnstakeEnabled;
    }
    
    function updateEmergencyUnstakeFee(uint256 fee) external onlyOwner {
        require(fee <= 2000, "Fee too high"); // Max 20%
        emergencyUnstakeFee = fee;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get pool statistics
     */
    function getPoolStats() external view returns (
        uint256 _totalStaked,
        uint256 _totalRewardsPaid,
        uint256 _totalStakers,
        uint256 _currentAPY
    ) {
        return (totalStaked, totalRewardsPaid, totalStakers, currentAPY);
    }
}
