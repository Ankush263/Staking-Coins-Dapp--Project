const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("Staking", () => {
  beforeEach(async () => {
    [signer1, signer2] = await ethers.getSigners();

    Staking  = await ethers.getContractFactory('Staking', signer1);

    staking = await Staking.deploy({
      value: ethers.utils.parseEther('10')
    })
  })

  describe('deploy', () => {
    it("Should set owner", async () => {
      expect(await staking.owner()).to.equal(signer1.address)
    })
    it("sets up tiers and lock period", async () => {
      expect(await staking.lockPeriods(0)).to.equal(30)
      expect(await staking.lockPeriods(1)).to.equal(90)
      expect(await staking.lockPeriods(2)).to.equal(180)

      expect(await staking.tiers(30)).to.equal(700)
      expect(await staking.tiers(90)).to.equal(1000)
      expect(await staking.tiers(180)).to.equal(1200)
    })
  })

  describe('stakeTokens', () => {
    it("transfers token", async () => {
      const provider = waffle.provider;
      let contractBalance;
      let signerBalance;
      const transferAmount = ethers.utils.parseEther('2.0')

      contractBalance = await provider.getBalance(staking.address)
      signerBalance = await signer1.getBalance()

      const data = { value: transferAmount }
      const transaction = await staking.connect(signer1).stakeTokens(30, data)
      const receipt = await transaction.wait()
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice)


      // test the change in signer1's ether balance
      expect(
        await signer1.getBalance()
      ).to.equal(
        signerBalance.sub(transferAmount).sub(gasUsed)
      )

      // test the change in contract's ether balance
      expect(
        await provider.getBalance(staking.address)
      ).to.equal(
        contractBalance.add(transferAmount)
      )
    })

    it("adds position to positions", async () => {
      const provider = waffle.provider
      let positionconst 
      const transferAmount = ethers.utils.parseEther('1.0')

      position = await staking.positions(0)

      expect(position.positionId).to.equal(0)
      expect(position.walletAddress).to.equal('0x0000000000000000000000000000000000000000')
      expect(position.createTime).to.equal(0)
      expect(position.unlockTime).to.equal(0)
      expect(position.percentInterest).to.equal(0)
      expect(position.tokenStaked).to.equal(0)
      expect(position.tokenInterest).to.equal(0)
      expect(position.open).to.equal(false)

      expect(await staking.currentPositionId()).to.equal(0)

      data = { value: transferAmount }
      const transaction = await staking.connect(signer1).stakeTokens(90, data)
      const receipt = await transaction.wait()
      const block = await provider.getBlock(receipt.blockNumber)

      position = await staking.positions(0)

      expect(position.positionId).to.equal(0)
      expect(position.walletAddress).to.equal(signer1.address)
      expect(position.createTime).to.equal(block.timestamp)
      expect(position.unlockTime).to.equal(block.timestamp + (86400 * 90))
      expect(position.percentInterest).to.equal(1000)
      expect(position.tokenStaked).to.equal(transferAmount)
      expect(position.tokenInterest).to.equal( ethers.BigNumber.from(transferAmount).mul(1000).div(10000))
      expect(position.open).to.equal(true)

      expect(await staking.currentPositionId()).to.equal(1)
    })


    it("adds address and positionId to positionIdByAddress", async () => {
      const transferAmount = ethers.utils.parseEther('0.5')

      const data = { value: transferAmount }
      await staking.connect(signer1).stakeTokens(30, data)
      await staking.connect(signer1).stakeTokens(30, data)
      await staking.connect(signer2).stakeTokens(90, data)

      expect(await staking.positionIdByAddress(signer1.address, 0)).to.equal(0)
      expect(await staking.positionIdByAddress(signer1.address, 1)).to.equal(1)
      expect(await staking.positionIdByAddress(signer2.address, 0)).to.equal(2)
    })

  })

  describe("Modify Lock Periods", () => {
    describe("owner", () => {
      it("should create a new lockperiod", async () => {
        await staking.connect(signer1).modifyLockPeriods(100, 999)

        expect(await staking.tiers(100)).to.equal(999)
        expect(await staking.lockPeriods(3)).to.equal(100)
      })

      it("should modify an existing lockperiod", async () => {
        await staking.connect(signer1).modifyLockPeriods(30, 150)
        
        expect(await staking.tiers(30)).to.equal(150)
      })
    })
    describe("non-owner", () => {
      it("reverts", async () => {
        expect(
          staking.connect(signer2).modifyLockPeriods(100, 999)
        ).to.be.revertedWith(
          "Only owner have an access to modify staking period"
        )
      })
    })
  })

  describe("getLockPeriods", () => {
    it("returns all lockperiod", async () => {
      const lockPeriods = await staking.getLockPeriods()

      expect(
        lockPeriods.map(v => Number(v._hex))
      ).to.eql(
        [30, 90, 180]
      )
    })
  })

  describe("getInterestRate", () => {
    it("returns the interest rate for a specific lockperiod", async () => {
      const interestRate = await staking.getInterestRate(30)
      expect(interestRate).to.equal(700)
    })
  })

  describe("getPositionById", () => {
    it("returns data about a specific position, given a position id", async () => {
      const provider = waffle.provider

      const transferAmount = ethers.utils.parseEther('5')
      const data = { value: transferAmount }
      const transaction = await staking.connect(signer1).stakeTokens(90, data)
      const receipt = transaction.wait()
      const block = await provider.getBlock(receipt.blockNumber)

      const position = await staking.connect(signer1.address).getPositionById(0)

      expect(position.positionId).to.equal(0)
      expect(position.walletAddress).to.equal(signer1.address)
      expect(position.createTime).to.equal(block.timestamp)
      expect(position.unlockTime).to.equal(block.timestamp + (86400 * 90))
      expect(position.percentInterest).to.equal(1000)
      expect(position.tokenStaked).to.equal(transferAmount)
      expect(position.tokenInterest).to.equal( ethers.BigNumber.from(transferAmount).mul(1000).div(10000))
      expect(position.open).to.equal(true)

    })
  })

  describe("getPositionIdForAddress", () => {
    it("returns a list of positionIds by a specific address", async () => {
      let data
      let transaction

      data = { value: ethers.utils.parseEther('5') }
      transaction = await staking.connect(signer1).stakeTokens(90, data)

      data = { value: ethers.utils.parseEther('10') }
      transaction = await staking.connect(signer1).stakeTokens(90, data)

      const positionIds = await staking.getPositionIdsForAddress(signer1.address)

      expect(
        positionIds.map(p => Number(p))
      ).to.eql(
        [0, 1]
      )
    })
  })

  describe("changeUnlockTime", () => {
    describe("owner", () => {
      it("changes the unlock date", async () => {
        const data = { value: ethers.utils.parseEther('8') }
        const transaction = await staking.connect(signer2).stakeTokens(90, data)
        const positionOld = await staking.getPositionById(0)

        const newUnlockTime = positionOld.unlockTime - (86400 * 500)
        await staking.connect(signer1).changeUnlockTime(0, newUnlockTime)
        const positionNew = await staking.getPositionById(0)

        expect(
          positionNew.unlockTime
        ).to.be.equal(
          positionOld.unlockTime - (86400 * 500)
        )

      })
    })
    describe("non-owner", () => {
      it("reverts", async () => {
        const data = { value: ethers.utils.parseEther('8') }
        const transaction = await staking.connect(signer2).stakeTokens(90, data)
        const positionOld = await staking.getPositionById(0)

        const newUnlockTime = positionOld.unlockTime - (86400 * 500)

        expect(
          staking.connect(signer2).changeUnlockTime(0, newUnlockTime)
        ).to.be.revertedWith(
          "Only owner can modify the unlock time"
        )
      })
    })
  })

  describe("closePosition", () => {
    describe("after unlock date", () => {
      it("transfer principal and interest", async () => {
        let transaction
        let receipt
        let block
        const provider = waffle.provider

        const data = { value: ethers.utils.parseEther('8') }
        transaction = await staking.connect(signer2).stakeTokens(90, data)
        receipt = transaction.wait()
        block = await provider.getBlock(receipt.blockNumber)

        const newUnlockTime = block.timestamp - (86400 * 100)
        await staking.connect(signer1).changeUnlockTime(0, newUnlockTime)

        const position = await staking.getPositionById(0)

        const signerBalanceBefore = await signer2.getBalance()

        transaction = await staking.connect(signer2).closePosition(0)
        receipt = await transaction.wait()

        const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice)
        const signerBalanceAfter = await signer2.getBalance()


        expect(
          signerBalanceAfter
        ).to.equal(
          signerBalanceBefore
          .sub(gasUsed)
          .add(position.tokenStaked)
          .add(position.tokenInterest)
        )

      })
    })

    describe("before unlock date", () => {
      it("transfer principal and interest", async () => {
        let transaction
        let receipt
        let block
        const provider = waffle.provider

        const data = { value: ethers.utils.parseEther('8') }
        transaction = await staking.connect(signer2).stakeTokens(90, data)
        receipt = transaction.wait()
        block = await provider.getBlock(receipt.blockNumber)

        const position = await staking.getPositionById(0)

        const signerBalanceBefore = await signer2.getBalance()

        transaction = await staking.connect(signer2).closePosition(0)
        receipt = await transaction.wait()

        const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice)
        const signerBalanceAfter = await signer2.getBalance()


        expect(
          signerBalanceAfter
        ).to.equal(
          signerBalanceBefore
          .sub(gasUsed)
          .add(position.tokenStaked)
        )
      })
    })
  })

})

