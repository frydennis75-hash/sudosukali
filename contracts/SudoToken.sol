// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SudoToken
 * @dev POL-based ERC20 token for CyberHack gaming platform
 * Features: Minting, burning, pausing, and gaming integration
 */
contract SudoToken is ERC20, ERC20Burnable, Pausable, Ownable, ReentrancyGuard {
    // Maximum supply cap (100 million tokens)
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    
    // Gaming contract addresses that can mint tokens
    mapping(address => bool) public authorizedMinters;
    
    // Token allocation tracking
    mapping(string => uint256) public allocationUsed; // allocation name => amount used
    mapping(string => uint256) public allocationCap;  // allocation name => maximum cap
    
    // Events
    event MinterAuthorized(address indexed minter, bool authorized);
    event AllocationSet(string indexed allocation, uint256 cap);
    event TokensMinted(address indexed to, uint256 amount, string allocation);
    
    constructor() ERC20("CyberHack Sudo Token", "SUDO") Ownable(_msgSender()) {
        // Set initial allocations
        allocationCap["gaming_rewards"] = 40_000_000 * 10**18;     // 40% for gaming rewards
        allocationCap["staking_rewards"] = 20_000_000 * 10**18;    // 20% for staking rewards  
        allocationCap["team"] = 15_000_000 * 10**18;               // 15% for team
        allocationCap["treasury"] = 15_000_000 * 10**18;           // 15% for treasury
        allocationCap["liquidity"] = 10_000_000 * 10**18;          // 10% for liquidity
        
        // Mint initial treasury allocation to contract owner
        _mint(owner(), 5_000_000 * 10**18); // 5M initial mint for operations
        allocationUsed["treasury"] = 5_000_000 * 10**18;
    }
    
    /**
     * @dev Authorize or revoke minting permissions for gaming contracts
     */
    function setAuthorizedMinter(address minter, bool authorized) external onlyOwner {
        authorizedMinters[minter] = authorized;
        emit MinterAuthorized(minter, authorized);
    }
    
    /**
     * @dev Set allocation cap for a specific purpose
     */
    function setAllocationCap(string memory allocation, uint256 cap) external onlyOwner {
        require(cap <= MAX_SUPPLY, "Cap exceeds maximum supply");
        allocationCap[allocation] = cap;
        emit AllocationSet(allocation, cap);
    }
    
    /**
     * @dev Mint tokens for specific allocation (only authorized minters)
     */
    function mintForAllocation(
        address to, 
        uint256 amount, 
        string memory allocation
    ) external nonReentrant {
        require(authorizedMinters[_msgSender()], "Not authorized to mint");
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than zero");
        
        // Check allocation limits
        require(
            allocationUsed[allocation] + amount <= allocationCap[allocation],
            "Allocation cap exceeded"
        );
        
        // Check total supply limit
        require(
            totalSupply() + amount <= MAX_SUPPLY,
            "Maximum supply exceeded"
        );
        
        allocationUsed[allocation] += amount;
        _mint(to, amount);
        
        emit TokensMinted(to, amount, allocation);
    }
    
    /**
     * @dev Emergency mint function for owner (with strict limits)
     */
    function emergencyMint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Maximum supply exceeded");
        require(amount <= 1_000_000 * 10**18, "Emergency mint too large"); // Max 1M per call
        
        _mint(to, amount);
    }
    
    /**
     * @dev Pause token transfers (emergency function)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get remaining allocation for a specific purpose
     */
    function getRemainingAllocation(string memory allocation) external view returns (uint256) {
        return allocationCap[allocation] - allocationUsed[allocation];
    }
    
    /**
     * @dev Bulk transfer function for airdrops (gas optimization)
     */
    function bulkTransfer(
        address[] calldata recipients, 
        uint256[] calldata amounts
    ) external nonReentrant {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length <= 200, "Too many recipients"); // Gas limit protection
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            require(amounts[i] > 0, "Invalid amount");
            _transfer(_msgSender(), recipients[i], amounts[i]);
        }
    }
    
    /**
     * @dev Override _update to add pause functionality
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override whenNotPaused {
        super._update(from, to, value);
    }
    
    /**
     * @dev Recover accidentally sent ERC20 tokens (not SUDO)
     */
    function recoverERC20(address tokenAddress, uint256 amount) external onlyOwner {
        require(tokenAddress != address(this), "Cannot recover SUDO tokens");
        IERC20(tokenAddress).transfer(owner(), amount);
    }
    
    /**
     * @dev Get token information for frontend
     */
    function getTokenInfo() external view returns (
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 totalSupply_,
        uint256 maxSupply_,
        bool paused_
    ) {
        return (
            name(),
            symbol(),
            decimals(),
            totalSupply(),
            MAX_SUPPLY,
            paused()
        );
    }
}
