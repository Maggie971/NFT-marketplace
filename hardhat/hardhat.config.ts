import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL!,  // 确保这里有正确的 URL
      accounts: [process.env.PRIVATE_KEY!],
    },
    tenderly: {
      url: 'https://virtual.sepolia.rpc.tenderly.co/0c9945dc-8459-43cf-af53-c0bd35b59779', // HTTP RPC URL
      accounts: [process.env.PRIVATE_KEY!] // 使用你的私钥，确保环境变量配置
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // 如果不再使用 goerli 网络，可以删除这个配置
    // goerli: {
    //   url: process.env.GOERLI_RPC_URL!,
    //   accounts: [process.env.PRIVATE_KEY!],
    // },
  },
};

export default config;
