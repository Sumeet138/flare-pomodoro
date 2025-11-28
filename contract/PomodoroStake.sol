// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PomodoroStake {
    struct Session {
        uint256 startTime;
        uint256 duration;
        bool completed;
        uint256 stakeAmount;
        bool withdrawn;
    }

    mapping(address => Session) public sessions;
    address public owner;

    uint256 public constant POMODORO_DURATION = 25 minutes;
    uint256 public constant MIN_STAKE = 0.001 ether;

    event PomodoroStarted(address indexed user, uint256 stakeAmount, uint256 startTime);
    event PomodoroCompleted(address indexed user, uint256 reward);
    event PomodoroForfeited(address indexed user, uint256 lostAmount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function startPomodoro() external payable {
        require(msg.value >= MIN_STAKE, "Minimum stake is 0.001 ETH");
        require(!isActive(msg.sender), "Session already active");
        
        sessions[msg.sender] = Session({
            startTime: block.timestamp,
            duration: POMODORO_DURATION,
            completed: false,
            stakeAmount: msg.value,
            withdrawn: false
        });

        emit PomodoroStarted(msg.sender, msg.value, block.timestamp);
    }

    function completePomodoro() external {
        Session storage session = sessions[msg.sender];
        require(session.startTime > 0, "No active session");
        require(!session.completed, "Already completed");
        require(block.timestamp >= session.startTime + session.duration, "Session not finished yet");

        session.completed = true;
        
        // User gets their stake back + 10% bonus from contract balance (if available)
        uint256 bonus = (session.stakeAmount * 10) / 100;
        uint256 totalReward = session.stakeAmount + bonus;
        
        if (address(this).balance < totalReward) {
            totalReward = session.stakeAmount; // Just return stake if no bonus available
        }

        emit PomodoroCompleted(msg.sender, totalReward);
    }

    function forfeitPomodoro() external {
        Session storage session = sessions[msg.sender];
        require(session.startTime > 0, "No active session");
        require(!session.completed, "Already completed");

        uint256 lostAmount = session.stakeAmount;
        
        // Reset session
        delete sessions[msg.sender];

        emit PomodoroForfeited(msg.sender, lostAmount);
    }

    function withdraw() external {
        Session storage session = sessions[msg.sender];
        require(session.completed, "Session not completed");
        require(!session.withdrawn, "Already withdrawn");

        session.withdrawn = true;
        
        uint256 bonus = (session.stakeAmount * 10) / 100;
        uint256 totalReward = session.stakeAmount + bonus;
        
        if (address(this).balance < totalReward) {
            totalReward = session.stakeAmount;
        }

        payable(msg.sender).transfer(totalReward);

        emit Withdrawn(msg.sender, totalReward);
    }

    function isActive(address user) public view returns (bool) {
        Session memory session = sessions[user];
        if (session.startTime == 0) return false;
        if (session.completed) return false;
        return true;
    }

    function getSessionInfo(address user) external view returns (
        uint256 startTime,
        uint256 duration,
        bool completed,
        uint256 stakeAmount,
        bool withdrawn,
        uint256 timeRemaining,
        bool _isActive
    ) {
        Session memory session = sessions[user];
        startTime = session.startTime;
        duration = session.duration;
        completed = session.completed;
        stakeAmount = session.stakeAmount;
        withdrawn = session.withdrawn;
        
        if (session.startTime > 0 && !session.completed) {
            uint256 endTime = session.startTime + session.duration;
            if (block.timestamp < endTime) {
                timeRemaining = endTime - block.timestamp;
            } else {
                timeRemaining = 0;
            }
        } else {
            timeRemaining = 0;
        }
        
        _isActive = isActive(user);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Allow contract to receive ETH for bonus pool
    receive() external payable {}
}
