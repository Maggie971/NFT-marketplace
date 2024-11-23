import { ethers } from "hardhat";

async function main() {
  try {
    // 部署 NFT 合约
    const NFT = await ethers.getContractFactory("NFTCollection");
    const nftContract = await NFT.deploy();
    console.log("NFT contract deployed to:", nftContract.target);

    // 部署 Auction 合约，将 NFT 合约地址传递给 Auction 合约
    const Auction = await ethers.getContractFactory("Auction");
    const auctionContract = await Auction.deploy(nftContract.target);
    console.log("Auction contract deployed to:", auctionContract.target);

  } catch (error) {
    console.error("Error during deployment:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unexpected error during deployment:", error);
  process.exit(1);
});
