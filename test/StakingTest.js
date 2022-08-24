const { expect } = require("chai");

describe("Staking Token Test", async () => {
  let contract;
  let owner;
  let address1;
  let address2;
  let address;

  beforeEach(async () => {
    Staking = await ethers.getContractFactory("Staking");
    [owner, address1, address2, ...address] = await ethers.getSigners();
    contract = await Staking.deploy();
  })

  describe("Deployment", async () => {

    it("Should set the owner", async () => {
      expect(await contract.owner()).to.equal(owner.address);
    })

    it("Setes up tiers and lock periods", async () => {
      expect(await contract.lockPeriods(0)).to.equal(1)
      expect(await contract.lockPeriods(1)).to.equal(6)
      expect(await contract.lockPeriods(2)).to.equal(12)

      expect(await contract.tiers(1)).to.equal(700)
      expect(await contract.tiers(6)).to.equal(1000)
      expect(await contract.tiers(12)).to.equal(1200)
    })
  })
})