// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DANKUSH is ERC20 {
  constructor() ERC20("DANKUSH", "DANK") {
    _mint(msg.sender, 10000 * (10 ^ 18));
  }

  function faucet(address payable to, uint256 amount) payable external {
    _mint(to, amount);
  }
}

//12:56:8