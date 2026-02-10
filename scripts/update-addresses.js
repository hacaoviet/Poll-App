const fs = require('fs');
const path = require('path');

// Update contract-address.json after deployment
// network: 'hardhat' or 'sepolia'
async function updateContractAddresses(contractAddress, network = 'hardhat') {
  const contractsDir = path.join(__dirname, "..", "src", "contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  const contractAddressPath = path.join(contractsDir, "contract-address.json");
  
  // Read existing addresses or create new object
  let addresses = {};
  if (fs.existsSync(contractAddressPath)) {
    try {
      addresses = JSON.parse(fs.readFileSync(contractAddressPath, 'utf8'));
    } catch (error) {
      console.log('Creating new contract-address.json file');
    }
  }

  // Update the specific network address
  addresses[network] = contractAddress;
  
  // Keep backward compatibility with PollContract field
  if (network === 'hardhat') {
    addresses.PollContract = contractAddress;
  }

  // Write updated addresses
  fs.writeFileSync(
    contractAddressPath,
    JSON.stringify(addresses, undefined, 2)
  );

  console.log(`Contract address updated for ${network}: ${contractAddress}`);
  console.log("Updated file: src/contracts/contract-address.json");
}

module.exports = {
  updateContractAddresses
};
