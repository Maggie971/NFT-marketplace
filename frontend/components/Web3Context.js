import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import nftABI from './NFTCollection.json';
import auctionABI from './Auction.json';

export const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [ethersProvider, setEthersProvider] = useState(null);
  const [ethersNftContract, setEthersNftContract] = useState(null);
  const [ethersAuctionContract, setEthersAuctionContract] = useState(null);

  const NFT_CONTRACT_ADDRESS = '0x70c63D2eda3B9CB23B333e6530aa00F25b172D85';
  const AUCTION_CONTRACT_ADDRESS = '0xd16A8C11B4cf2F973cF3b6b9aD95914EC42Ed200';

  useEffect(() => {
    const initializeEthers = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.BrowserProvider(window.ethereum);
          setEthersProvider(ethProvider);

          const signer = await ethProvider.getSigner();
          const userAddress = await signer.getAddress();
          setAccount(userAddress);

          // 创建 NFT 和 Auction 合约实例
          const nftContractInstance = new ethers.Contract(NFT_CONTRACT_ADDRESS, nftABI.abi, signer);
          const auctionContractInstance = new ethers.Contract(AUCTION_CONTRACT_ADDRESS, auctionABI.abi, signer);

          setEthersNftContract(nftContractInstance);
          setEthersAuctionContract(auctionContractInstance);
        } catch (error) {
          console.error('Failed to initialize ethers provider:', error);
        }
      } else {
        console.error('MetaMask not detected. Please install MetaMask.');
      }
    };

    initializeEthers();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        ethersProvider,
        ethersNftContract,
        ethersAuctionContract,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
