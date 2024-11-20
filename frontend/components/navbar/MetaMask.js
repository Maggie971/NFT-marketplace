import { useContext, useState, useEffect } from 'react';
import { Web3Context } from '../Web3Context';  // 引入 Web3Context
import { ethers } from 'ethers';

const MetaMask = () => {
  const { setAccount, setProvider, setContract } = useContext(Web3Context);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccountState] = useState('');

  const checkMetaMaskConnection = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts.length > 0) {
        setAccountState(accounts[0]);
        setIsConnected(true); // 已连接
        setAccount(accounts[0]);  // 更新 Web3Context 中的 account
      }
    } catch (e) {
      console.error('Error checking MetaMask connection:', e);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      checkMetaMaskConnection();
    }
  }, []);

  const enableEth = async () => {
    try {
      if (window.ethereum) {
        const [account] = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        const provider = new ethers.Web3Provider(window.ethereum);

        setAccount(account);  // 更新 Web3Context 中的 account
        setProvider(provider);

        setContract(chainId === '0x7a69' ? "NFT_CONTRACT_ADDRESS" : "AUCTION_CONTRACT_ADDRESS");
        setAccountState(account);
        setIsConnected(true);
      } else {
        alert('Please install MetaMask');
      }
    } catch (e) {
      console.error('Error connecting to MetaMask', e);
    }
  };

  const switchAccount = async () => {
    try {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(account);
      setAccountState(account);
    } catch (e) {
      console.error('Error switching account', e);
    }
  };

  return (
    <div>
      {isConnected ? (
        <div>
          <button className="btn" onClick={switchAccount}>Logged in</button>
        </div>
      ) : (
        <button className="btn" onClick={enableEth}>Connect Wallet</button>
      )}
    </div>
  );
};

export default MetaMask;
