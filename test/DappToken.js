const { expect } = require('chai');
const { ethers } = require('ethers');

describe("Deployment", async () => {
  let owner;
  let address1;
  let address2;
  let address;
  beforeEach(async () => {
    DappToken = await ethers.getContractFactory('DappToken');
    Staking = await ethers.getContractFactory('Staking');
    [owner, address1, address2, ...address] = await ethers.getSigners();
    contract = await DappToken.deploy();
  })
})