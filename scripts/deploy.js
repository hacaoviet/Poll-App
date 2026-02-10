const hre = require("hardhat");
const { updateContractAddresses } = require('./update-addresses');

async function main() {
  const PollContract = await hre.ethers.getContractFactory("PollContract");
  const pollContract = await PollContract.deploy();

  await pollContract.waitForDeployment();
  const contractAddress = await pollContract.getAddress();
  console.log("PollContract deployed to:", contractAddress);
  
  // Get network name from hardhat config
  const networkName = hre.network.name;
  // Map network names to our config keys
  const networkKey = networkName === 'sepolia' ? 'sepolia' : 'hardhat';
  
  await updateContractAddresses(contractAddress, networkKey);
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 