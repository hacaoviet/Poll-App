import contractAddressFile from './contracts/contract-address.json';

export const SEPOLIA_RPC_URL = "https://sepolia.infura.io/v3/ddec0929723143d3a5b540f48240368a";
export const CONTRACT_ADDRESS = contractAddressFile.PollContract;
export const SEPOLIA_CHAIN_ID = '0xaa36a7';

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
