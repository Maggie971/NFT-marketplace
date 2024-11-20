import { ethers, run } from "hardhat";

async function main() {
  try {
    // 部署 NFT 合约
    const NFT = await ethers.getContractFactory("NFTCollection");

    const gasLimit = 5000000;  // 设置 gas limit
    const gasPrice = ethers.parseUnits('10', 'gwei');  // 设置 gas price 为 10 gwei

    const nftContract = await NFT.deploy({
      gasLimit,
      gasPrice
    });
    
    if (!nftContract.target) {
      console.log("NFT contract address is invalid.");
      return;
    }

    console.log("NFT contract deployed to:", nftContract.target);

    // 假设你已经有 NFT 的 tokenId 和拍卖起始价格
    const nftTokenId = 1;  // NFT tokenId，确保根据你的合约指定
    const startingBid = ethers.parseUnits("0.1", "ether"); // 起始出价，转换为 wei
    const duration = 60 * 60 * 24;  // 拍卖时长 24小时

    // 部署 Auction 合约
    const Auction = await ethers.getContractFactory("Auction");
    const auctionContract = await Auction.deploy(
      nftContract.target,  // 使用 NFT 合约的 address 地址
      nftTokenId,           // 使用 NFT tokenId
      startingBid,          // 使用起始出价
      duration              // 使用拍卖持续时间
    );

    // 打印 auctionContract 的所有信息，看看它的属性
    console.log("Auction contract deployed to:", auctionContract.target);
  } catch (error) {
    console.error("Error during deployment:", error);
  }
}

main()
  .catch((error) => {
    console.error("Unexpected error during deployment:", error);
    process.exit(1);
  });
