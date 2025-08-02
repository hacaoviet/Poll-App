import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import PollContract from './contracts/PollContract.json';
import CreatePoll from './components/CreatePoll';
import PollList from './components/PollList';
import Header from './components/Header';
import TransactionInfo from './components/TransactionInfo';
import { 
  SEPOLIA_RPC_URL, 
  CONTRACT_ADDRESS, 
  SEPOLIA_CHAIN_ID,
  SEPOLIA_NETWORK_CONFIG 
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
  const [readOnlyContract, setReadOnlyContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [activeTab, setActiveTab] = useState('polls');
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pollsLoaded, setPollsLoaded] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [error, setError] = useState('');
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  useEffect(() => {
    // Initialize read-only contract and load polls immediately
    const initializeAndLoadPolls = async () => {
      const readOnlyProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        PollContract.abi,
        readOnlyProvider
      );
      setReadOnlyContract(contractInstance);
      
      // Load polls immediately using the read-only contract
      try {
        const pollCount = await contractInstance.pollCount();
        const pollsData = [];
        
        if (pollCount > 0) {
          for (let i = 1; i <= pollCount; i++) {
            try {
              const pollData = await contractInstance.getPoll(i);
              const sanitizedPollData = {
                id: pollData.id.toString(),
                title: pollData.title,
                options: pollData.options,
                voteCounts: pollData.voteCounts.map(count => count.toString()),
                creator: pollData.creator,
                totalVotes: pollData.totalVotes.toString(),
                createdAt: new Date(Number(pollData.createdAt) * 1000).toLocaleDateString()
              };
              pollsData.push(sanitizedPollData);
            } catch (pollError) {
              console.error('Error loading poll:', pollError);
            }
          }
          
          // Sort polls to show newest first
          const reversedPolls = [...pollsData].reverse();
          setPolls(reversedPolls);
          setPollsLoaded(true);
        }
      } catch (error) {
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
  }, [contract?.target, account, pollsLoaded]); // Only depend on contract address, not the entire contract object

  const initializeEthereum = async () => {
    try {
      // Check if user is already logged out
      if (localStorage.getItem('isLoggedOut') === 'true') {
        return;
      }

      const ethereumProvider = await detectEthereumProvider();
      
      if (ethereumProvider) {
        setProvider(ethereumProvider);
        
        // Check current connection without requesting
        const accounts = await ethereumProvider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          
          const ethersProvider = new ethers.BrowserProvider(ethereumProvider);
          const signerInstance = await ethersProvider.getSigner();
          setSigner(signerInstance);
          
          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESS,
            PollContract.abi,
            signerInstance
          );
          
          setContract(contractInstance);
        }
        
        // Listen for account changes
        ethereumProvider.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            // Handle disconnection
            setProvider(null);
            setAccount(null);
            setSigner(null);
            setContract(null);
            setPolls([]);
            setPollsLoaded(false);
            setLastTransaction(null);
          }
        });
      }
    } catch (error) {
    }
  };

  const connectWallet = async () => {
    try {
      // Clear any previous states when attempting to connect
      localStorage.removeItem('isLoggedOut');
      localStorage.removeItem('connectionCancelled');
      
      // Force MetaMask to show the connection prompt
      if (window.ethereum) {
        // Reset connection state first
        setProvider(null);
        setAccount(null);
        setSigner(null);
        setContract(null);
        
        try {
          // Request wallet permissions and accounts
          await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });
          
          const currentAccounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts'
          });
          
          if (currentAccounts && currentAccounts.length > 0) {
            const ethereumProvider = await detectEthereumProvider();
            if (ethereumProvider) {
              setProvider(ethereumProvider);
              setAccount(currentAccounts[0]);
              
              const ethersProvider = new ethers.BrowserProvider(ethereumProvider);
              const signerInstance = await ethersProvider.getSigner();
              setSigner(signerInstance);
              
              const contractInstance = new ethers.Contract(
                CONTRACT_ADDRESS,
                PollContract.abi,
                signerInstance
              );
              setContract(contractInstance);
              
              // Set up event listeners
              ethereumProvider.on('accountsChanged', (newAccounts) => {
                if (newAccounts.length > 0) {
                  setAccount(newAccounts[0]);
                } else {
                  setAccount(null);
                  setSigner(null);
                  setContract(null);
                  setPolls([]);
                  setPollsLoaded(false);
                  setLastTransaction(null);
                }
              });
            }
          } else {
            // If no accounts returned, mark as cancelled
            localStorage.setItem('connectionCancelled', 'true');
          }
        } catch (error) {
          // Handle user rejection
          localStorage.setItem('connectionCancelled', 'true');
        }
      }
    } catch (error) {
      localStorage.setItem('connectionCancelled', 'true');
    }
  };

  const loadPolls = async () => {
    try {
      // Check if enough time has passed since last refresh (5 seconds minimum)
      const now = Date.now();
      if (now - lastRefreshTime < 5000) {
        console.log('Skipping refresh - too soon');
        return;
      }
      
      setLoading(true);
      setLastRefreshTime(now);

      try {
        if (!readOnlyContract) {
          console.log('Read-only contract not initialized');
          return;
        }
        
        // Get total number of polls
        const pollCount = await readOnlyContract.pollCount();
        const pollsData = [];
        
        // Load all polls using the read-only contract
        if (pollCount > 0) {
          for (let i = 1; i <= pollCount; i++) {
            try {
              const pollData = await readOnlyContract.getPoll(i);
              
              // Convert BigInt values to strings and format data
              const sanitizedPollData = {
                id: pollData.id.toString(),
                title: pollData.title,
                options: pollData.options,
                voteCounts: pollData.voteCounts.map(count => count.toString()),
                creator: pollData.creator,
                totalVotes: pollData.totalVotes.toString(),
                createdAt: new Date(Number(pollData.createdAt) * 1000).toLocaleDateString()
              };
              pollsData.push(sanitizedPollData);
            } catch (pollError) {
              // Continue loading other polls even if one fails
            }
          }
        }
        
        // Sort polls to show newest first
        const reversedPolls = [...pollsData].reverse();
        setPolls(reversedPolls);
        setPollsLoaded(true);
        
      } catch (error) {
        // Don't clear polls on error, keep existing data if any
      }
    } finally {
      setLoading(false);
    }
  };

  const createPoll = async (title, options) => {
    try {
      setLoading(true);
      // Clear any previous errors or messages
      setError('');
      setLastTransaction(null);

      // Show transaction details before sending
      const createPollFunction = contract.interface.getFunction('createPoll');
      const encodedData = contract.interface.encodeFunctionData(createPollFunction, [title, options]);
      const tx = await contract.createPoll(title, options);
      const receipt = await tx.wait();
      
      // Set the success message
      setLastTransaction({
        title: '🎉 Poll Created Successfully!',
        hash: tx.hash,
        data: encodedData,
        method: createPollFunction.format()
      });

      // Switch to polls tab and reload
      setPollsLoaded(false);
      setActiveTab('polls');
      await loadPolls();

      // Keep the success message visible for 5 seconds
      setTimeout(() => {
        setLastTransaction(null);
      }, 10000);
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
      
      // Check if we're on Sepolia network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [SEPOLIA_NETWORK_CONFIG]
              });
            } catch (addError) {
              setError('Failed to add Sepolia network. Please add it manually in MetaMask.');
              return;
            }
          } else {
            setError('Please switch to Sepolia network to vote');
            return;
          }
        }
      }
      
      if (!contract) {
        setError('Please connect your wallet to vote');
        return;
      }
      
      // Show transaction details before sending
      const voteFunction = contract.interface.getFunction('vote');
      const encodedData = contract.interface.encodeFunctionData(voteFunction, [pollId, optionIndex]);
      
      // Call vote function
      const tx = await contract.vote(pollId, optionIndex);
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      setLastTransaction({
        title: 'Vote Cast Successfully! 🎉',
        hash: tx.hash,
        data: encodedData,
        method: voteFunction.format()
      });
      
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
      setSigner(null);
      setContract(null);
      setPolls([]);
      setPollsLoaded(false);
      setLastTransaction(null);

      // Keep provider but remove listeners to prevent stale events
      if (provider) {
        provider.removeAllListeners();
      }

    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Render different content based on wallet connection
  const renderContent = () => {
    if (!account) {
      return (
        <div>
          <Message>
            <h2>Welcome to Decentralized Poll App</h2>
            <p>Connect your wallet to create polls and vote</p>
            <ConnectButton onClick={connectWallet}>
              Connect MetaMask
            </ConnectButton>
          </Message>
        </div>
      );
    }

    return (
      <>
        <Header 
          account={account} 
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
          {lastTransaction && (
            <TransactionInfo 
              title={lastTransaction.title}
              hash={lastTransaction.hash}
              data={lastTransaction.data}
              method={lastTransaction.method}
            />
          )}
          
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