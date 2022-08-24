const { expect } = require('chai');

describe("DappToken Test", async () => {

  let owner;
  let address1;
  let contract;

  beforeEach(async () => {
    DappToken = await ethers.getContractFactory('DappToken');
    [owner, address1] = await ethers.getSigners();
    contract = await DappToken.deploy();
  })

  describe("Deployment", async () => {

    it("Should set the Total Supply", async () => {
      expect((await contract.totalSupply()).toNumber()).to.equal(10000 * (10 ^ 18));
    })

  })

  describe("Token Transfer", async () => {

    it("Should transfer the token from owner", async () => {
      await contract.transfer(address1.address, 100);
      expect((await contract.balanceOf(address1.address)).toNumber()).to.equal(100);
    })

  })

  describe("Token faucet", async () => {
    
    it("Should give some tokens", async () => {
      await contract.faucet(address1.address, 1342);
      expect((await contract.balanceOf(address1.address)).toNumber()).to.equal(1342);
    })
    
  })

})