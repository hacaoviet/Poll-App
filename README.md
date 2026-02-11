# 🗳️ Poll App

A modern, decentralized polling application built with React.js and Solidity smart contracts. Users can create polls and vote using their MetaMask wallet, with all data stored securely on the blockchain.

## ✨ Features

- **MetaMask Integration**: Connect your wallet to interact with the app
- **Create Polls**: Create polls with custom titles and multiple options
- **Vote on Polls**: Vote on existing polls using your wallet
- **View Results**: View poll results with vote counts and percentages

---

## 🛠️ Technology Stack

- **Frontend**: React.js with styled-components
- **Blockchain**: Solidity smart contracts
- **Testing Environment**: Hardhat local network and Sepolia testnet
- **Wallet Integration**: MetaMask
- **Web3**: Ethers.js library

---

## 🚀 Installation & Setup

```bash
git clone <repository-url>
cd Poll-App
npm install
```

---

## 🏠 Option A: Running with Hardhat (Localhost)

### Step 1: Start Hardhat Local Network

Open a **new terminal window** and run:

```bash
npx hardhat node
```

This will:
- Start a local Ethereum node on `http://127.0.0.1:8545`
- Display 20 test accounts with private keys and 10000 ETH each

**Keep this terminal open!** The node must be running for the app to work.

### Step 2: Deploy Contract to Localhost

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

### Step 3: Configure MetaMask for Localhost

1. **Open MetaMask** and click the network dropdown
2. **Add Network** → **Add a network manually**
3. Enter the following details:
   - **Network Name**: `Hardhat Local`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `1337`
   - **Currency Symbol**: `ETH`
   - **Block Explorer URL**: (leave empty)
4. Click **Save**

### Step 4: Import Test Account to MetaMask

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

### Step 5: Start the React Application

In a **new terminal window**, run:

```bash
npm start
```

The application will:
- Open automatically at `http://localhost:3000`
- Connect to the local Hardhat node
- Use the deployed contract address automatically

### Step 6: Connect Wallet and Test

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
   - Visit https://cloud.google.com/application/web3/faucet/ethereum/sepolia
   - Request test ETH 

### Step 2: Get RPC URL

You need an RPC endpoint:
1. Go to [Infura](https://infura.io/)
2. Sign up for a free account
3. Create a new project
4. Select "Ethereum" → "Sepolia"
5. Copy the HTTPS endpoint URL (e.g., `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`)

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

# Your wallet private key (for deploying contract)
PRIVATE_KEY=0xYourPrivateKeyHere

```

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
