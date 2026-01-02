const hre = require("hardhat");
const { updateContractAddresses } = require('./update-addresses');

async function main() {
  const PollContract = await hre.ethers.getContractFactory("PollContract");
  const pollContract = await PollContract.deploy();

  await pollContract.waitForDeployment();
  const contractAddress = await pollContract.getAddress();
  await updateContractAddresses(contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 