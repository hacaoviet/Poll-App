const hre = require("hardhat");
const { updateContractAddresses } = require('./update-addresses');

async function main() {
  const PollContract = await hre.ethers.getContractFactory("PollContract");
  const pollContract = await PollContract.deploy();

  await pollContract.waitForDeployment();

  const contractAddress = await pollContract.getAddress();
  console.log("PollContract deployed to:", contractAddress);
  
  // Update contract addresses in all necessary files
  await updateContractAddresses(contractAddress);
  
  const PollContractArtifact = artifacts.readArtifactSync("PollContract");
  fs.writeFileSync(
    contractsDir + "/PollContract.json",
    JSON.stringify(PollContractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 