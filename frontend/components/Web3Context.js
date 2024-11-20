import { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';  // Web3.js
import nftABI from './NFTCollection.json';  // 确保这是 ABI 格式
import auctionABI from './Auction.json';  // 确保这是 ABI 格式
import 'dotenv/config';  // 确保你已经安装并正确配置 dotenv

export const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [contract, setContract] = useState(null);  // 主合约实例
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [nftContract, setNftContract] = useState(null);  // NFT 合约实例
  const [auctionContract, setAuctionContract] = useState(null);  // 拍卖合约实例

  // 设置硬编码的环境变量
  const TENDERLY_RPC_URL = 'https://virtual.sepolia.rpc.tenderly.co/9bdf6e09-0afd-4352-819d-ee9624b3eca9'; // 手动配置 Tenderly RPC URL
  const NFT_CONTRACT_ADDRESS = '0x70c63D2eda3B9CB23B333e6530aa00F25b172D85'; // 手动配置 NFT 合约地址
  const AUCTION_CONTRACT_ADDRESS = '0xd16A8C11B4cf2F973cF3b6b9aD95914EC42Ed200'; // 手动配置 Auction 合约地址

  // 初始化 Web3.js 提供者
  useEffect(() => {
    if (!provider) {
      const tenderlyProvider = new Web3(TENDERLY_RPC_URL);  // 使用硬编码的 Tenderly RPC URL
      setProvider(tenderlyProvider);
    }
  }, []);  // 只在组件挂载时运行一次

  useEffect(() => {
    if (provider && account) {
      console.log('Account in Context:', account);
      // 创建合约实例
      const nftContractInstance = new provider.eth.Contract(nftABI.abi, NFT_CONTRACT_ADDRESS);
      const auctionContractInstance = new provider.eth.Contract(auctionABI.abi, AUCTION_CONTRACT_ADDRESS);

      setNftContract(nftContractInstance);
      setAuctionContract(auctionContractInstance);
    }
  }, [provider, account]);  // 仅当 provider 初始化或 account 变化时运行

  return (
    <Web3Context.Provider
      value={{
        provider,
        setProvider,
        contract,
        setContract,
        account,
        setAccount,
        nftContract,  // NFT 合约实例
        auctionContract,  // 拍卖合约实例
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
