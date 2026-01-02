import contractAddressFile from './contracts/contract-address.json';

export const SEPOLIA_RPC_URL = "https://sepolia.infura.io/v3/ddec0929723143d3a5b540f48240368a";
export const LOCALHOST_RPC_URL = "http://127.0.0.1:8545";
export const CONTRACT_ADDRESS = contractAddressFile.PollContract || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const SEPOLIA_CHAIN_ID = '0xaa36a7';
export const LOCALHOST_CHAIN_ID = '0x539'; // 1337 in hex

// Network configuration
export const SEPOLIA_NETWORK_CONFIG = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: 'Sepolia Testnet',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: [SEPOLIA_RPC_URL],
  blockExplorerUrls: ['https://sepolia.etherscan.io/']
};

// Helper function to get RPC URL based on chain ID
export const getRpcUrl = (chainId) => {
  if (chainId === LOCALHOST_CHAIN_ID || chainId === '1337' || chainId === 1337) {
    return LOCALHOST_RPC_URL;
  }
  return SEPOLIA_RPC_URL;
};
