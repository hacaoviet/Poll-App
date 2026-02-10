import contractAddressFile from './contracts/contract-address.json';

export const SEPOLIA_RPC_URL = "https://sepolia.infura.io/v3/ddec0929723143d3a5b540f48240368a";
export const LOCALHOST_RPC_URL = "http://127.0.0.1:8545";
export const SEPOLIA_CHAIN_ID = '0xaa36a7';
export const LOCALHOST_CHAIN_ID = '0x539'; // 1337 in hex

// Get contract address based on network
export const getContractAddress = (chainId) => {
  // Check if chainId matches Sepolia (0xaa36a7 or 11155111)
  if (chainId === SEPOLIA_CHAIN_ID || chainId === '0xaa36a7' || chainId === 11155111) {
    return contractAddressFile.sepolia || contractAddressFile.hardhat;
  }
  
  // Default to hardhat/localhost address
  return contractAddressFile.hardhat;
};

// Default contract address (for backward compatibility - uses hardhat)
export const CONTRACT_ADDRESS = contractAddressFile.hardhat;

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

// Chain ID to Currency Symbol mapping
export const CHAIN_CURRENCY_MAP = {
  // Ethereum networks
  '0x1': 'ETH',           // Ethereum Mainnet
  '0xaa36a7': 'ETH',      // Sepolia Testnet (0xaa36a7 = 11155111)
  '11155111': 'ETH',      // Sepolia Testnet (decimal)
  '0x539': 'ETH',         // Localhost/Hardhat (0x539 = 1337)
  '1337': 'ETH',          // Localhost/Hardhat (decimal)
  
  // Binance Smart Chain
  '0x38': 'BNB',          // BSC Mainnet (56)
  '56': 'BNB',
  '0x61': 'BNB',          // BSC Testnet (97)
  '97': 'BNB',
  
  // Polygon
  '0x89': 'MATIC',        // Polygon Mainnet (137)
  '137': 'MATIC',
  '0x13881': 'MATIC',     // Mumbai Testnet (80001)
  '80001': 'MATIC',
  
  // Avalanche
  '0xa86a': 'AVAX',       // Avalanche Mainnet (43114)
  '43114': 'AVAX',
  '0xa869': 'AVAX',       // Avalanche Fuji Testnet (43113)
  '43113': 'AVAX',
  
  // Arbitrum
  '0xa4b1': 'ETH',        // Arbitrum One (42161)
  '42161': 'ETH',
  
  // Optimism
  '0xa': 'ETH',           // Optimism (10)
  '10': 'ETH',
  
  // Base
  '0x2105': 'ETH',        // Base Mainnet (8453)
  '8453': 'ETH',
};

// Helper function to get currency symbol from chain ID
export const getCurrencySymbol = (chainId) => {
  // Convert chainId to string if it's a number
  const chainIdStr = typeof chainId === 'number' ? chainId.toString() : chainId;
  
  // Try hex format first (with 0x prefix)
  if (CHAIN_CURRENCY_MAP[chainIdStr]) {
    return CHAIN_CURRENCY_MAP[chainIdStr];
  }
  
  // Try without 0x prefix
  const chainIdWithoutPrefix = chainIdStr.startsWith('0x') 
    ? chainIdStr.slice(2) 
    : chainIdStr;
  
  // Convert hex to decimal if needed
  let chainIdDecimal = chainIdWithoutPrefix;
  if (chainIdWithoutPrefix.match(/^[0-9a-fA-F]+$/)) {
    try {
      chainIdDecimal = parseInt(chainIdWithoutPrefix, 16).toString();
    } catch (e) {
      // If conversion fails, use original
    }
  }
  
  // Try decimal format
  if (CHAIN_CURRENCY_MAP[chainIdDecimal]) {
    return CHAIN_CURRENCY_MAP[chainIdDecimal];
  }
  
  // Default to ETH if not found
  return 'ETH';
};
