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

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd poll-app-blockchain
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure MetaMask for Sepolia Network

1. Open MetaMask and select Sepolia network
   - If Sepolia is not available, add it:
     - **Network Name**: Sepolia
     - **RPC URL**: https://sepolia.infura.io/v3/
     - **Chain ID**: 11155111
     - **Currency Symbol**: SepoliaETH

2. Get Sepolia test ETH:
   - Visit a Sepolia faucet (e.g., sepoliafaucet.com)
   - Enter your MetaMask wallet address
   - Request test ETH

### 4. Environment Setup

1. Create a `.env` file in the root directory:
```env
REACT_APP_SEPOLIA_RPC_URL=your_infura_or_alchemy_url
REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address
```

2. Update the configuration:
- Add your Infura/Alchemy URL
- Add the deployed contract address
- Save and restart the application if it's running

### 6. Start the React App

```bash
npm start
```

The application will open at `http://localhost:3000`

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

## 🏗️ Project Structure

```
poll-app-blockchain/
├── contracts/                 # Solidity smart contracts
│   └── PollContract.sol      # Main poll contract
├── scripts/                   # Deployment scripts
│   └── deploy.js             # Contract deployment
├── src/                       # React application
│   ├── components/           # React components
│   │   ├── CreatePoll.js     # Poll creation form
│   │   ├── PollList.js       # Poll display and voting
│   │   └── Header.js         # App header
│   ├── contracts/            # Contract artifacts (auto-generated)
│   ├── App.js               # Main app component
│   └── index.js             # App entry point
├── public/                   # Static files
├── hardhat.config.js         # Hardhat configuration
└── package.json              # Dependencies and scripts
```

## 🔧 Smart Contract Functions

### PollContract.sol

- `createPoll(string title, string[] options)` - Create a new poll
- `vote(uint256 pollId, uint256 optionIndex)` - Vote on a poll
- `getPoll(uint256 pollId)` - Get poll details and results
- `hasVoted(uint256 pollId, address voter)` - Check if address has voted
- `getAllPolls()` - Get all poll IDs
- `getUserPolls(address user)` - Get polls created by a user

## 🎨 Customization

### Styling

The app uses styled-components for styling. You can customize the appearance by modifying the styled components in each file.

### Smart Contract

To modify the smart contract functionality:

1. Edit `contracts/PollContract.sol`
2. Recompile: `npm run compile`
3. Redeploy: `npm run deploy`

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask not connecting**
   - Make sure MetaMask is installed and unlocked
   - Check that you're on the Sepolia network
   - Verify you have Sepolia ETH in your wallet

2. **Transaction fails**
   - Ensure you have enough Sepolia ETH for gas fees
   - Check that you're on the Sepolia network
   - Check the browser console for error messages

3. **Contract not found**
   - Verify the contract address in your `.env` file
   - Check that your Infura/Alchemy RPC URL is correct
   - Make sure you're connected to Sepolia network

4. **Polls not loading**
   - Check your internet connection
   - Verify your Infura/Alchemy RPC URL is working
   - Check for any rate limiting messages in console
   - Wait a few seconds between refreshes

### Development Commands

```bash
# Install dependencies
npm install

# Start React app
npm start

# Build for production
npm run build
```

## 🔒 Security Features

- **One vote per address**: Each wallet can only vote once per poll
- **Immutable data**: Once created, polls cannot be modified
- **Transparent voting**: All votes are publicly visible on the blockchain
- **No central authority**: The app is completely decentralized

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Hardhat](https://hardhat.org/)
- UI components styled with [styled-components](https://styled-components.com/)
- Web3 integration with [ethers.js](https://docs.ethers.io/)
- MetaMask integration for wallet connectivity 