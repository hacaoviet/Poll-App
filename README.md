# 🗳️ Poll App

A modern, decentralized polling application built with React.js and Solidity smart contracts. Users can create polls and vote using their MetaMask wallet, with all data stored securely on the blockchain.

## ✨ Features

- **MetaMask Integration**: Connect your wallet to interact with the app
- **Create Polls**: Create polls with custom titles and multiple options
- **Vote on Polls**: Vote on existing polls using your wallet
- **Blockchain Security**: All data is stored on the blockchain for transparency
- **Modern UI**: Beautiful, responsive design with smooth animations

## 🛠️ Technology Stack

- **Frontend**: React.js with styled-components
- **Blockchain**: Solidity smart contracts
- **Development**: Hardhat framework (dev, test, deploy smart contract)
- **Wallet Integration**: MetaMask
- **Web3**: Ethers.js library

## 📋 Prerequisites

Before running this application, make sure you have the following:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MetaMask](https://metamask.io/) browser extension
- [Git](https://git-scm.com/)
- Sepolia testnet ETH (from a faucet)
- Infura or Alchemy account for RPC URL

## ⚡ Quick Start Checklist

**For Localhost (Hardhat):**
- [ ] Clone repository and install dependencies
- [ ] Start Hardhat node (`npx hardhat node`)
- [ ] Deploy contract (`npx hardhat run scripts/deploy.js --network localhost`)
- [ ] Configure MetaMask for localhost (Chain ID: 1337)
- [ ] Import test account to MetaMask
- [ ] Start React app (`npm start`)

**For Sepolia Testnet:**
- [ ] Clone repository and install dependencies
- [ ] Get Sepolia test ETH from faucet (e.g. https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
- [ ] Create `.env` file with RPC URL and private key
- [ ] Deploy contract (`npx hardhat run scripts/deploy.js --network sepolia`)
- [ ] Configure MetaMask for Sepolia (Chain ID: 11155111)
- [ ] Start React app (`npm start`)

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Poll-App
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including React, Hardhat, Ethers.js, and other packages.

---

## 📝 Setup Guide: Choose Your Network

You can run this application in two ways:
1. **Local Development** - Using Hardhat local network (recommended for testing)
2. **Testnet** - Using Sepolia testnet (closer to production environment)

---

## 🏠 Option A: Running with Hardhat (Localhost)

This is the easiest way to get started for local development and testing.

### Step 1: Create Environment File (Optional for localhost)

Create a `.env` file in the root directory (optional for localhost, but recommended):

```env
# Optional for localhost - only needed if you want to customize
SEPOLIA_RPC_URL=your_infura_url_here
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_key_here
```

> **Note**: For localhost development, you don't need these values, but having the file prevents errors.

### Step 2: Start Hardhat Local Network

Open a **new terminal window** and run:

```bash
npx hardhat node
```

This will:
- Start a local Ethereum node on `http://127.0.0.1:8545`
- Display 20 test accounts with private keys and 10000 ETH each
- Keep running until you stop it (Ctrl+C)

**Keep this terminal open!** The node must be running for the app to work.

### Step 3: Deploy Contract to Localhost

In a **new terminal window** (keep the Hardhat node running), run:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Expected Output:**
```
PollContract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract address updated for hardhat: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Updated file: src/contracts/contract-address.json
```

The contract address is automatically saved to `src/contracts/contract-address.json`.

### Step 4: Configure MetaMask for Localhost

1. **Open MetaMask** and click the network dropdown
2. **Add Network** → **Add a network manually**
3. Enter the following details:
   - **Network Name**: `Hardhat Local`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `1337`
   - **Currency Symbol**: `ETH`
   - **Block Explorer URL**: (leave empty)
4. Click **Save**

### Step 5: Import Test Account to MetaMask

1. In the terminal where `npx hardhat node` is running, you'll see test accounts like:
   ```
   Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

2. **Import Account** in MetaMask:
   - Click MetaMask icon → Account menu → Import Account
   - Paste the **Private Key** from one of the test accounts
   - Click **Import**

3. **Switch to Hardhat Local network** in MetaMask

### Step 6: Start the React Application

In a **new terminal window**, run:

```bash
npm start
```

The application will:
- Open automatically at `http://localhost:3000`
- Connect to the local Hardhat node
- Use the deployed contract address automatically

### Step 7: Connect Wallet and Test

1. Open `http://localhost:3000` in your browser
2. Click **"Connect MetaMask"**
3. Approve the connection in MetaMask
4. You should see your wallet address and balance (10000 ETH) in the header
5. Try creating a poll and voting!

---

## 🌐 Option B: Running with Sepolia Testnet

This setup is for testing on a real testnet network.

### Step 1: Get Sepolia Test ETH

1. **Get a Sepolia Faucet**:
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/) or [Alchemy Faucet](https://sepoliafaucet.com/)
   - Connect your MetaMask wallet
   - Request test ETH (you'll need some for gas fees)

2. **Wait for confirmation** - It may take a few minutes to receive test ETH

### Step 2: Get RPC URL

You need an RPC endpoint. Choose one:

**Option A: Infura**
1. Go to [Infura](https://infura.io/)
2. Sign up for a free account
3. Create a new project
4. Select "Ethereum" → "Sepolia"
5. Copy the HTTPS endpoint URL (e.g., `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`)

**Option B: Alchemy**
1. Go to [Alchemy](https://www.alchemy.com/)
2. Sign up for a free account
3. Create a new app
4. Select "Ethereum" → "Sepolia"
5. Copy the HTTPS URL (e.g., `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`)

### Step 3: Get Your Private Key

⚠️ **Security Warning**: Never share your private key or commit it to version control!

1. In MetaMask, click the account icon
2. Click **Account Details**
3. Click **Export Private Key**
4. Enter your password
5. Copy the private key (starts with `0x`)

### Step 4: Create Environment File

Create a `.env` file in the root directory:

```env
# Sepolia Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
# OR
# SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Your wallet private key (for deploying contract)
PRIVATE_KEY=0xYourPrivateKeyHere

# Optional: For contract verification on Etherscan
ETHERSCAN_API_KEY=YourEtherscanAPIKey
```

**Important**: 
- Replace `YOUR_PROJECT_ID` or `YOUR_API_KEY` with your actual RPC URL
- Replace `0xYourPrivateKeyHere` with your actual private key
- Add `.env` to `.gitignore` to prevent committing secrets

### Step 5: Configure MetaMask for Sepolia

1. **Open MetaMask** and click the network dropdown
2. If Sepolia is not visible:
   - Click **Add Network** → **Add a network manually**
   - Enter:
     - **Network Name**: `Sepolia`
     - **RPC URL**: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID` (or your Alchemy URL)
     - **Chain ID**: `11155111`
     - **Currency Symbol**: `SepoliaETH`
     - **Block Explorer URL**: `https://sepolia.etherscan.io`
   - Click **Save**
3. **Switch to Sepolia network** in MetaMask

### Step 6: Deploy Contract to Sepolia

In your terminal, run:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**Expected Output:**
```
PollContract deployed to: 0x8D480358f117c469da0E889b4ee13Ec2401b4C9B
Contract address updated for sepolia: 0x8D480358f117c469da0E889b4ee13Ec2401b4C9B
Updated file: src/contracts/contract-address.json
```

**Note**: 
- This will cost a small amount of Sepolia ETH for gas fees
- The contract address is automatically saved to `src/contracts/contract-address.json`
- You can verify the deployment on [Sepolia Etherscan](https://sepolia.etherscan.io/)

### Step 7: Verify Contract on Etherscan (Optional)

To verify your contract source code on Etherscan:

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

Replace `CONTRACT_ADDRESS` with the address from Step 6.

### Step 8: Start the React Application

```bash
npm start
```

The application will:
- Open at `http://localhost:3000`
- Automatically detect Sepolia network
- Use the deployed contract address from `contract-address.json`

### Step 9: Connect Wallet and Test

1. Open `http://localhost:3000` in your browser
2. Make sure MetaMask is on **Sepolia network**
3. Click **"Connect MetaMask"**
4. Approve the connection
5. You should see your wallet address and Sepolia ETH balance
6. Create polls and vote!

---

## 🔄 Switching Between Networks

The app automatically detects the network you're connected to in MetaMask:

- **Localhost (Chain ID: 1337)**: Uses Hardhat contract address
- **Sepolia (Chain ID: 11155111)**: Uses Sepolia contract address

Just switch networks in MetaMask, and the app will update automatically!

---

## 📋 Quick Command Reference

### Hardhat Commands

```bash
# Start local Hardhat node
npx hardhat node

# Compile contracts
npm run compile
# OR
npx hardhat compile

# Deploy to localhost
npx hardhat run scripts/deploy.js --network localhost
# OR
npm run deploy

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract on Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### React Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## 🐛 Troubleshooting

### Issue: "No contract found at address"

**Solution**: 
- Make sure you've deployed the contract to the correct network
- Check `src/contracts/contract-address.json` has the correct address
- Verify you're connected to the same network in MetaMask

### Issue: "Transaction failed" or "Insufficient funds"

**Solution**:
- For localhost: Make sure Hardhat node is running and you imported a test account
- For Sepolia: Make sure you have Sepolia ETH in your wallet (get from faucet)

### Issue: "Network mismatch"

**Solution**:
- Ensure MetaMask is on the same network you deployed to
- For localhost: Use Chain ID 1337
- For Sepolia: Use Chain ID 11155111

### Issue: "RPC URL error"

**Solution**:
- Check your `.env` file has the correct `SEPOLIA_RPC_URL`
- Verify your Infura/Alchemy API key is valid
- Make sure there are no extra spaces in the `.env` file

### Issue: Hardhat node not connecting

**Solution**:
- Make sure `npx hardhat node` is running in a separate terminal
- Check the node is running on `http://127.0.0.1:8545`
- Restart the Hardhat node if needed

## 📖 How to Use

### Connecting Your Wallet

1. Open the app in your browser
2. Click "Connect MetaMask" if not already connected
3. Approve the connection in MetaMask

### Creating a Poll

1. Click on the "Create Poll" tab
2. Enter a poll title
3. Add at least 2 options (up to 10)
4. Click "Create Poll"
5. Sign the transaction in MetaMask

### Voting on Polls

1. Go to the "View Polls" tab
2. Browse available polls
3. Click "Vote" on your preferred option
4. Sign the transaction in MetaMask
5. See real-time results update

## 🔧 Smart Contract Functions

### PollContract.sol

- `createPoll(string title, string[] options)` - Create a new poll
- `vote(uint256 pollId, uint256 optionIndex)` - Vote on a poll
- `getPoll(uint256 pollId)` - Get poll details and results
- `hasVoted(uint256 pollId, address voter)` - Check if address has voted
- `getAllPolls()` - Get all poll IDs
- `getUserPolls(address user)` - Get polls created by a user

### Smart Contract

To modify the smart contract functionality:

1. Edit `contracts/PollContract.sol`
2. Recompile: `npm run compile`
3. Redeploy: `npm run deploy`