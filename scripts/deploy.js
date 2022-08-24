// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");



async function main() {

  const DappToken = await hre.ethers.getContractFactory("DappToken");
  const Staking = await hre.ethers.getContractFactory("Staking");

  const dapptoken = await DappToken.deploy();
  const staking = await Staking.deploy();

  await dapptoken.deployed();
  await staking.deployed();

  console.log("dapptoken deployed to:", dapptoken.address);
  console.log("staking deployed to:", staking.address);
  // console.log("hre.ethers: ", hre.ethers)
  // console.log("staking: ", staking);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});