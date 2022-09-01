// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DappToken is ERC20 {
  constructor() ERC20("DANKUSH", "DANK") {
    _mint(msg.sender, 10000 * (10 ^ 18));
  }

  function faucet(address payable to, uint256 amount) payable external {
    _mint(to, amount);
  }
}
