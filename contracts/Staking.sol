//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Staking {
  
  address public owner;

  struct Position {
    uint positionId;
    address walletAddress;
    uint createDate;
    uint unlockDate;
    uint percentInterest;
    uint weiStaked;
    uint weiInterest;
    bool open;
  }

  Position position;

  uint public currentPositionId;    // This will increment after a new position is created
  mapping(uint => Position) public positions;   // Every newly created positions added in this mapping
  mapping(address => uint[]) public positionIdByAddress;    // This gives user abilities to querry all the position Id by their addresses
  mapping(uint => uint) public tiers;   // This takes the number of days and returns the interest rate
  uint[] public lockPeriods;    // This gives the information how many days the token will lock(30 Day's etc...)

  constructor() payable {
    owner = msg.sender;
    
  }
}