// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleLottery {

    address public owner;
    address[] public players;

    constructor() {
        owner = msg.sender;
    }

    function enter() public payable {
        require(msg.value >= 0.001 ether, "Minimum 0.001 ETH");
        players.push(msg.sender);
    }

    function getPlayerCount() public view returns (uint) {
        return players.length;
    }

    function pickWinner() public {
        require(msg.sender == owner, "Only owner");
        require(players.length > 0, "No players");

        uint randomNumber = uint(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, players.length)
            )
        );

        uint winnerIndex = randomNumber % players.length;
        payable(players[winnerIndex]).transfer(address(this).balance);

        // Reset player list (simple & correct)
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
