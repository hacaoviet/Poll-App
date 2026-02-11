import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PollContract from './artifacts/contracts/PollContract.sol/PollContract.json';
import CreatePoll from './components/CreatePoll';
import PollList from './components/PollList';
import Header from './components/Header';
import { 
  LOCALHOST_RPC_URL,
  CONTRACT_ADDRESS, 
  LOCALHOST_CHAIN_ID,
  getRpcUrl,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_RPC_URL,
  getContractAddress,
  getCurrencySymbol
} from './config';
import {
  AppContainer,
  MainContent,
  TabContainer,
  Tab,
  TabContent,
  ConnectButton,
  Message,
  ErrorMessage
} from './styles/AppStyles';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('ETH'); // Default to ETH
  const [activeTab, setActiveTab] = useState('polls');
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pollsLoaded, setPollsLoaded] = useState(false);
  const [error, setError] = useState('');

  // Helper: Get network info (chainId, RPC URL, contract address, and currency symbol)
  const getNetworkInfo = async () => {
    let chainId = LOCALHOST_CHAIN_ID;
        let rpcUrl = LOCALHOST_RPC_URL;
        
        if (window.ethereum) {
          try {
            chainId = await window.ethereum.request({ method: 'eth_chainId' });
            rpcUrl = getRpcUrl(chainId);
          } catch (error) {
            console.log('Could not detect chain ID, using localhost');
          }
    }
    
    // Get contract address for the current network
    const contractAddress = getContractAddress(chainId);
    
    // Get currency symbol based on chain ID
    const currency = getCurrencySymbol(chainId);
    
    return { chainId, rpcUrl, contractAddress, currencySymbol: currency };
  };

  // Helper: Sanitize poll data
  const sanitizePollData = (pollData) => ({
                  id: pollData.id.toString(),
                  title: pollData.title,
                  options: pollData.options,
                  voteCounts: pollData.voteCounts.map(count => count.toString()),
                  creator: pollData.creator,
                  totalVotes: pollData.totalVotes.toString(),
                  createdAt: new Date(Number(pollData.createdAt) * 1000).toLocaleDateString()
  });

  // Helper: Refresh balance
  const refreshBalance = async (ethereumProvider, accountAddress) => {
    if (!ethereumProvider || !accountAddress) return;
    try {
      const ethersProvider = new ethers.BrowserProvider(ethereumProvider);
      const accountBalance = await ethersProvider.getBalance(accountAddress);
      setBalance(ethers.formatEther(accountBalance));
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  // Helper: Setup account, signer, contract, and balance
  const setupAccountAndContract = async (ethereumProvider, accountAddress) => {
    if (!ethereumProvider || !accountAddress) return null;

    const ethersProvider = new ethers.BrowserProvider(ethereumProvider);
    const signerInstance = await ethersProvider.getSigner();
    
    // Get current network and contract address
    let chainId = LOCALHOST_CHAIN_ID;
    try {
      chainId = await ethereumProvider.request({ method: 'eth_chainId' });
    } catch (error) {
      console.log('Could not detect chain ID');
    }
    const contractAddress = getContractAddress(chainId);
    
    // Get currency symbol for current network
    const currency = getCurrencySymbol(chainId);
    
    // Update state
    setAccount(accountAddress);
    setSigner(signerInstance);
    setCurrencySymbol(currency);
    
    // Fetch and update balance
    await refreshBalance(ethereumProvider, accountAddress);
    
    // Create contract instance with network-specific address
    const contractInstance = new ethers.Contract(
      contractAddress,
      PollContract.abi,
      signerInstance
    );
    setContract(contractInstance);
    
    return contractInstance;
  };

  // Helper: Handle account changes
  const handleAccountChange = async (ethereumProvider, accounts) => {
    if (accounts.length > 0) {
      await setupAccountAndContract(ethereumProvider, accounts[0]);
    } else {
      // Handle disconnection
      setProvider(null);
      setAccount(null);
      setBalance(null);
      setSigner(null);
      setContract(null);
      setPolls([]);
      setPollsLoaded(false);
    }
  };

  // Helper: Handle chain changes
  const handleChainChange = () => {
    setPollsLoaded(false);
    window.location.reload();
  };

  // Helper: Load polls from contract instance
  const loadPollsFromContract = async (contractInstance) => {
    try {
      const pollCount = await contractInstance.pollCount();
      const pollsData = [];
      
      if (pollCount > 0) {
        for (let i = 1; i <= pollCount; i++) {
          try {
            const pollData = await contractInstance.getPoll(i);
            pollsData.push(sanitizePollData(pollData));
            console.log(`Loaded poll ${i}:`, pollData.title);
              } catch (pollError) {
                console.error(`Error loading poll ${i}:`, pollError);
              }
            }
            
            // Sort polls to show newest first
            const reversedPolls = [...pollsData].reverse();
            setPolls(reversedPolls);
          } else {
            console.log('No polls found (pollCount is 0)');
          }
          setPollsLoaded(true);
        } catch (error) {
          console.error('Error loading polls:', error);
          setError('Failed to load polls: ' + (error.message || error.reason || 'Unknown error'));
      setPollsLoaded(true);
    }
  };

  useEffect(() => {
    // Initialize read-only contract and load polls immediately
    const initializeAndLoadPolls = async () => {
      try {
        const { rpcUrl, contractAddress, currencySymbol } = await getNetworkInfo();
        
        // Set currency symbol
        setCurrencySymbol(currencySymbol);
        
        console.log('Connecting to contract at:', contractAddress);
        const readOnlyProvider = new ethers.JsonRpcProvider(rpcUrl);
        
        // Check if contract has code at this address
        const code = await readOnlyProvider.getCode(contractAddress);
        if (code === '0x') {
          console.error('No contract code found at address:', contractAddress);
          setError(`No contract found at ${contractAddress}. Please deploy the contract first.`);
          setPollsLoaded(true);
          return;
        }
        
        const contractInstance = new ethers.Contract(
          contractAddress,
          PollContract.abi,
          readOnlyProvider
        );
        
        // Load polls immediately using the read-only contract
        await loadPollsFromContract(contractInstance);
      } catch (error) {
        console.error('Error initializing read-only contract:', error);
        setError('Failed to connect to contract: ' + (error.message || error.reason || 'Unknown error'));
        setPollsLoaded(true);
      }
    };

    initializeAndLoadPolls();

    // Initialize wallet connection if not logged out
    if (localStorage.getItem('isLoggedOut') !== 'true' && 
        localStorage.getItem('connectionCancelled') !== 'true') {
      initializeEthereum();
    }
  }, []);

  useEffect(() => {
    if (contract && account && !pollsLoaded) {
      loadPolls();
    }
  }, [contract?.target, account, pollsLoaded]);

  const initializeEthereum = async () => {
    try {
      if (localStorage.getItem('isLoggedOut') === 'true') {
        return;
      }

      // Check specifically for MetaMask
      if (!isMetaMaskInstalled()) {
        return;
      }

      const ethereumProvider = window.ethereum;
      
      if (ethereumProvider) {
        setProvider(ethereumProvider);
        
        // Check current connection without requesting
        const accounts = await ethereumProvider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await setupAccountAndContract(ethereumProvider, accounts[0]);
        }
        
        // Set up event listeners
        ethereumProvider.on('accountsChanged', (accounts) => handleAccountChange(ethereumProvider, accounts));
        ethereumProvider.on('chainChanged', handleChainChange);
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const connectWallet = async () => {
    try {
      localStorage.removeItem('isLoggedOut');
      localStorage.removeItem('connectionCancelled');
      
      // Check specifically for MetaMask
      if (!isMetaMaskInstalled()) {
        setError('MetaMask is not installed. Please install MetaMask extension to continue.');
        setTimeout(() => {
          setError('');
        }, 5000);
        return;
      }

      // Use MetaMask specifically
      const ethereumProvider = window.ethereum;
      
      if (ethereumProvider) {
        // Reset connection state first
        setProvider(null);
        setAccount(null);
        setSigner(null);
        setContract(null);
        
        try {
          await ethereumProvider.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });
          
          const currentAccounts = await ethereumProvider.request({ 
            method: 'eth_requestAccounts'
          });
          
          if (currentAccounts && currentAccounts.length > 0) {
            setProvider(ethereumProvider);
            await setupAccountAndContract(ethereumProvider, currentAccounts[0]);
            
            // Set up event listeners
            ethereumProvider.on('accountsChanged', (accounts) => handleAccountChange(ethereumProvider, accounts));
            ethereumProvider.on('chainChanged', handleChainChange);
          } else {
            localStorage.setItem('connectionCancelled', 'true');
          }
        } catch (error) {
          if (error.code === 4001) {
            // User rejected the request
            setError('Connection request was rejected. Please try again.');
            localStorage.setItem('connectionCancelled', 'true');
          } else {
            setError('Failed to connect wallet: ' + (error.message || 'Unknown error'));
            localStorage.setItem('connectionCancelled', 'true');
          }
          setTimeout(() => {
            setError('');
          }, 5000);
        }
      }
    } catch (error) {
      setError('Failed to connect wallet: ' + (error.message || 'Unknown error'));
      localStorage.setItem('connectionCancelled', 'true');
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  const loadPolls = async () => {
    try {
      setLoading(true);
      setError('');

      try {
        const { rpcUrl, contractAddress, currencySymbol } = await getNetworkInfo();
        
        // Update currency symbol
        setCurrencySymbol(currencySymbol);
        
        const readOnlyProvider = new ethers.JsonRpcProvider(rpcUrl);
        
        // Verify contract exists
        const code = await readOnlyProvider.getCode(contractAddress);
        if (code === '0x') {
          setError(`No contract found at ${contractAddress}. Please deploy the contract first.`);
          setLoading(false);
          return;
        }
        
        const contractInstance = new ethers.Contract(
          contractAddress,
          PollContract.abi,
          readOnlyProvider
        );
        
        await loadPollsFromContract(contractInstance);
      } catch (error) {
        setError('Failed to load polls: ' + (error.message || error.reason || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper: Refresh signer and contract to use currently selected account
  const refreshSignerAndContract = async () => {
    if (!provider) return null;
    
    try {
      const accounts = await provider.request({ method: 'eth_accounts' });
      if (accounts.length === 0) return null;
      
      return await setupAccountAndContract(provider, accounts[0]);
    } catch (error) {
      console.error('Error refreshing signer:', error);
      return contract; // Return existing contract as fallback
    }
  };

  const createPoll = async (title, options) => {
    try {
      setLoading(true);
      // Clear any previous errors or messages
      setError('');

      // Ensure we're using the currently selected account
      const currentContract = await refreshSignerAndContract() || contract;
      if (!currentContract) {
        setError('Please connect your wallet');
        return;
      }

      // Create poll transaction
      const tx = await currentContract.createPoll(title, options);
      // Wait for transaction confirmation
      await tx.wait();
      
      // Refresh balance after transaction
      await refreshBalance(provider, account);

      // Switch to polls tab and reload
      setPollsLoaded(false);
      setActiveTab('polls');
      await loadPolls();

    } catch (error) {
      if (error.code === 'ACTION_REJECTED') {
        setError('Transaction was cancelled. Please try again to create your poll.');
      } else {
        setError('Failed to create poll: ' + (error.reason || 'Please check your wallet and try again.'));
      }
      // Clear error after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const voteOnPoll = async (pollId, optionIndex) => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      
      if (!window.ethereum) {
        setError('Please install MetaMask to vote');
        return;
      }
      
      if (!account) {
        // Try to connect wallet first
        try {
          await connectWallet();
        } catch (error) {
          setError('Please connect your wallet to vote');
          return;
        }
      }
      
      // Ensure we're using the currently selected account
      const currentContract = await refreshSignerAndContract() || contract;
      if (!currentContract) {
        setError('Please connect your wallet to vote');
        return;
      }
      
      // Call vote function
      const tx = await currentContract.vote(pollId, optionIndex);
      // Wait for transaction confirmation
      await tx.wait();
      
      // Refresh balance after transaction
      await refreshBalance(provider, account);
      
      // Reload polls to show updated vote counts
      setPollsLoaded(false);
      await loadPolls();  
      
    } catch (error) {
      if (error.code === 'ACTION_REJECTED') {
        setError('Transaction was cancelled. Please try again if you want to vote.');
      } else if (error.message.includes('already voted')) {
        setError('You have already voted on this poll!');
      } else {
        setError('Failed to vote: ' + (error.reason || 'Please check your wallet and try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshContract = async () => {
    try {
      setLoading(true);
      setPollsLoaded(false); // Reset polls loaded state
      await initializeEthereum();
      if (contract && account) {
        await loadPolls();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);

      // Set logged out state in localStorage
      localStorage.setItem('isLoggedOut', 'true');

      // Clear application state but keep the provider
      setAccount(null);
      setBalance(null);
      setSigner(null);
      setContract(null);
      setPolls([]);
      setPollsLoaded(false);

      // Keep provider but remove listeners to prevent stale events
      if (provider) {
        provider.removeAllListeners();
      }

    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Helper: Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return window.ethereum && window.ethereum.isMetaMask === true;
  };

  // Helper: Redirect to MetaMask installation page
  const redirectToMetaMask = () => {
    // Detect browser and redirect to appropriate MetaMask installation page
    const userAgent = navigator.userAgent.toLowerCase();
    let installUrl = 'https://metamask.io/download/';
    
    if (userAgent.includes('chrome') || userAgent.includes('chromium')) {
      installUrl = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
    } else if (userAgent.includes('firefox')) {
      installUrl = 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/';
    } else if (userAgent.includes('edge')) {
      installUrl = 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm';
    } else if (userAgent.includes('opera') || userAgent.includes('opr')) {
      installUrl = 'https://addons.opera.com/en/extensions/details/metamask/';
    } else if (userAgent.includes('brave')) {
      installUrl = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
    }
    
    // Open in new tab
    window.open(installUrl, '_blank', 'noopener,noreferrer');
  };

  // Render different content based on wallet connection
  const renderContent = () => {
    if (!account) {
      const metaMaskInstalled = isMetaMaskInstalled();
      
      return (
          <Message>
            <h2>Welcome to Poll App</h2>
            <p>Connect your MetaMask wallet to create polls and vote</p>
            {!metaMaskInstalled && (
              <p style={{ color: '#ff6b6b', fontSize: '14px', marginTop: '10px', marginBottom: '10px' }}>
                MetaMask extension is not detected. Please install MetaMask to continue.
              </p>
            )}
            {metaMaskInstalled ? (
              <ConnectButton onClick={connectWallet}>
                Connect MetaMask
              </ConnectButton>
            ) : (
              <ConnectButton onClick={redirectToMetaMask} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                Install MetaMask
              </ConnectButton>
            )}
          </Message>
      );
    }

    return (
      <>
        <Header 
          account={account} 
          balance={balance}
          currencySymbol={currencySymbol}
          onRefresh={refreshContract} 
          onLogout={handleLogout}
          loading={loading} 
        />
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <TabContainer>
          <Tab 
            active={activeTab === 'polls'} 
            onClick={() => {
              setActiveTab('polls');
              setPollsLoaded(false);
              loadPolls();
            }}
          >
            View Polls
          </Tab>
          <Tab 
            active={activeTab === 'create'} 
            onClick={() => setActiveTab('create')}
          >
            Create Poll
          </Tab>
        </TabContainer>
        
        <TabContent>
          {activeTab === 'polls' && (
            <PollList 
              polls={polls} 
              onVote={voteOnPoll} 
              loading={loading}
              account={account}
              contract={contract}
              onRefresh={loadPolls}
            />
          )}
          {activeTab === 'create' && (
            <CreatePoll 
              onCreatePoll={createPoll} 
              loading={loading}
            />
          )}
        </TabContent>
      </>
    );
  };

  return (
    <AppContainer>
      <MainContent>
        {renderContent()}
      </MainContent>
    </AppContainer>
  );
}

export default App; 