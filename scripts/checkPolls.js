const hre = require("hardhat");
const contractAddress = require("../src/contracts/contract-address.json");

async function main() {
  const PollContract = await hre.ethers.getContractAt("PollContract", contractAddress.PollContract);
  
  const pollCount = await PollContract.pollCount();
  console.log("Total number of polls:", pollCount.toString());
  
  if (pollCount > 0) {
    console.log("\nFetching poll details...");
    for (let i = 1; i <= pollCount; i++) {
      try {
        const poll = await PollContract.getPoll(i);
        console.log(`\nPoll ${i}:`);
      } catch (error) {
        console.error(`Error fetching poll ${i}:`, error.message);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
