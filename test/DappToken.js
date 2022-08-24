const { expect } = require('chai');

describe("Deployment", async () => {

  let owner;
  let address1;
  let address2;
  let address;
  let contract;

  beforeEach(async () => {
    DappToken = await ethers.getContractFactory('DappToken');
    // Staking = await ethers.getContractFactory('Staking');
    [owner, address1, address2, ...address] = await ethers.getSigners();
    contract = await DappToken.deploy();
  })

  describe("Deployment", async () => {

    it("Should set the Total Supply", async () => {
      expect((await contract.totalSupply()).toNumber()).to.equal(10000 * (10 ^ 18))
    })

  })

  describe("Token Transfer", async () => {

    it("Should transfer the token from owner", async () => {
      
    })
  })
})