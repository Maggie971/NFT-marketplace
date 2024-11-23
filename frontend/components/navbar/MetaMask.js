import { useContext, useState, useEffect } from 'react';
import { Web3Context } from '../Web3Context';

const MetaMask = () => {
  const { ethersProvider, account } = useContext(Web3Context);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (account) {
      setIsConnected(true);
    }
  }, [account]);

  const enableEth = async () => {
    try {
      if (window.ethereum) {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await ethProvider.send('eth_requestAccounts', []);

        if (accounts.length > 0) {
          setIsConnected(true);
        } else {
          alert('No accounts found. Please connect your wallet.');
        }
      } else {
        alert('Please install MetaMask');
      }
    } catch (e) {
      console.error('Error connecting to MetaMask', e);
    }
  };

  return (
    <div>
      {isConnected ? (
        <button className="btn">Logged in</button>
      ) : (
        <button className="btn" onClick={enableEth}>
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default MetaMask;
