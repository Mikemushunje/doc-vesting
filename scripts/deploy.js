const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying DOCVesting to RSK Testnet...");

  // DOC token address on RSK Testnet
  const DOC_TOKEN_ADDRESS = "0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0";

  // Get the deployer wallet
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from wallet:", deployer.address);

  // Check deployer balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Wallet balance:", ethers.formatEther(balance), "RBTC");

  // Deploy the contract
  const DOCVesting = await ethers.getContractFactory("DOCVesting");
  const vesting = await DOCVesting.deploy(DOC_TOKEN_ADDRESS);

  await vesting.waitForDeployment();

  const address = await vesting.getAddress();
  console.log("✅ DOCVesting deployed to:", address);
  console.log("🔍 View on explorer: https://explorer.testnet.rootstock.io/address/" + address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });