import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    tenderly: {
      url: 'https://virtual.sepolia.rpc.tenderly.co/ce3a6288-3a0b-4250-9f93-d37826c47405', // HTTP RPC URL
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
