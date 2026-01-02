const fs = require('fs');
const path = require('path');

// Update both contract-address.json and config.js after deployment
async function updateContractAddresses(contractAddress) {
  // Update contract-address.json
  const contractsDir = path.join(__dirname, "..", "src", "contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ PollContract: contractAddress }, undefined, 2)
  );

  // Read current config.js
  const configPath = path.join(__dirname, "..", "src", "config.js");
  const configContent = fs.readFileSync(configPath, 'utf8');

  // Update CONTRACT_ADDRESS in config.js
  const updatedConfig = configContent.replace(
    /export const CONTRACT_ADDRESS = .*?;/,
    `export const CONTRACT_ADDRESS = "${contractAddress}";`
  );

  // Write updated config
  fs.writeFileSync(configPath, updatedConfig);

}

module.exports = {
  updateContractAddresses
};
