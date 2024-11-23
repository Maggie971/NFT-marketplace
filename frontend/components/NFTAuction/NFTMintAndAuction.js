import { useState, useContext, useEffect } from 'react';
import { Web3Context } from '../Web3Context';
import axios from 'axios';
import { ethers } from 'ethers';
import AuctionStatus from './AuctionStatus';
const ERC721_ABI = [
  "function safeTransferFrom(address from, address to, uint256 tokenId) public",
  "function ownerOf(uint256 tokenId) public view returns (address)"
];

const NFTMintAndAuction = () => {
  const { ethersProvider, ethersNftContract, ethersAuctionContract, account } = useContext(Web3Context);
  const [nftUri, setNftUri] = useState('');
  const [auctionAmount, setAuctionAmount] = useState('');
  const [auctionDuration, setAuctionDuration] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isMinted, setIsMinted] = useState(false);
  const [mintError, setMintError] = useState('');
  const [progress, setProgress] = useState(0);
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [auctionEndTime, setAuctionEndTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [highestBid, setHighestBid] = useState(null);
  const [highestBidder, setHighestBidder] = useState('');
  const [tokenId, setTokenId] = useState(null);
  const [hasTransferred, setHasTransferred] = useState(false);
  const [transferParams, setTransferParams] = useState(null);

  // 上传图片到 IPFS
  const uploadToIPFS = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: '4c46d5dd44e3b5b24c26',
          pinata_secret_api_key: 'be0530d9355bcda6325769722dff74a42d33ddcfccee5ed6ee2cd4468792cbb3',
        },
        onUploadProgress: (progressEvent) => {
          const percentage = (progressEvent.loaded / progressEvent.total) * 100;
          setProgress(percentage);
        },
      });

      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (err) {
      console.error('Error uploading to IPFS:', err);
      setMintError('Error uploading image to IPFS.');
      return null;
    }
  };

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
    setIsMinted(false);
    setMintError('');
  };

  const mintNFT = async () => {
    if (!ethersNftContract || !account) {
      console.log('Missing contract or account');
      return;
    }
  
    const ipfsUri = await uploadToIPFS(imageFile);
    if (!ipfsUri) return;
  
    try {
      const tx = await ethersNftContract.safeMint(account, ipfsUri);
      const receipt = await tx.wait();
      console.log(receipt);
  
      // 查找 Transfer 事件
      const transferEvent = receipt.logs.find(
        (log) => log.topics[0] === ethers.id('Transfer(address,address,uint256)')
      );
  
      if (!transferEvent) {
        console.error('No Transfer event found in logs:', receipt.logs);
        return;
      }
  
      // 获取 tokenId（从 Transfer 事件中）
      const tokenId = transferEvent.topics[3];
      console.log(tokenId);
  
      // 保存 tokenId 到前端状态
       // 将 `tokenId` 保存在前端状态中
      setTokenId(tokenId);
      setIsMinted(true);
      setNftUri(ipfsUri);
    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  const startAuction = async () => {
    if (!ethersAuctionContract || !auctionAmount || !tokenId || !auctionDuration) {
      console.log('Missing contract, auction amount, tokenId, or auction duration');
      return;
    }
    
    try {
      const durationInSeconds = parseInt(auctionDuration, 10) * 60;
      const tx = await ethersAuctionContract.startAuction(
        ethers.parseEther(auctionAmount), 
        durationInSeconds,
        tokenId // 传递 tokenId 到合约中
      );
      await tx.wait();
      console.log('Auction started');
  
      // 更新拍卖状态
      setAuctionStarted(true);
      setAuctionEndTime(Math.floor(Date.now() / 1000) + durationInSeconds);
    } catch (error) {
      console.error('Failed to start auction:', error);
    }
  };

  const placeBid = async () => {
    if (!ethersAuctionContract || !auctionAmount) return;

    const bidAmount = ethers.parseEther(auctionAmount);

    try {
      const transaction = await ethersAuctionContract.placeBid({ value: bidAmount });
      await transaction.wait();
      console.log('Bid placed successfully');
    } catch (err) {
      console.error('Bid failed:', err);
    }
  };

  const fetchAuctionDetails = async () => {
    if (!ethersAuctionContract) return;
  
    try {
      const auctionStatus = await ethersAuctionContract.auctionStarted();
      setAuctionStarted(auctionStatus);
  
      if (auctionStatus) {
        const endTime = await ethersAuctionContract.auctionEndTime();
        const currentTime = Math.floor(Date.now() / 1000);
  
        // 将 endTime 转换为普通数字类型
        const endTimeNumber = Number(endTime.toString());
  
        // 计算剩余时间
        const remainingTime = endTimeNumber - currentTime;
  
        // 更新剩余时间
        setTimeRemaining(formatTime(remainingTime));
        setAuctionEndTime(endTimeNumber);
  
        const highestBidAmount = await ethersAuctionContract.highestBid();
        setHighestBid(ethers.formatEther(highestBidAmount));
  
        const highestBidderAddress = await ethersAuctionContract.highestBidder();
        setHighestBidder(highestBidderAddress);
        console.log("Updated highestBid:", highestBid);
        console.log("Updated highestBidder:", highestBidder);
        console.log(tokenId);
  
        // 拍卖结束，执行 ETH 和 NFT 转账
        if (currentTime > endTimeNumber && !hasTransferred && transferParams) {
          console.log("Updated highestBid:", highestBid);
          console.log("Updated highestBidder:", highestBidder);
          
          // 执行 ETH 转账
          await handleETHTransfer(transferParams); 
          setHasTransferred(true); // 防止重复执行转账操作
        }
      } else {
        setAuctionEndTime(null); // 如果拍卖未开始或已结束，清空结束时间
      }
    } catch (error) {
      console.error('Error fetching auction details:', error);
    }
  };
  
  // 执行 ETH 转账的函数
  const handleETHTransfer = async (params) => {
    const { fromAddress, toAddress, ethAmount } = params;

    try {
      const tx = await ethersAuctionContract.transferHighestBid();
      await tx.wait();
      console.log("ETH Transfer confirmed:", tx.hash);

      // ETH 转账完成后，执行 NFT 转账
      await handleNFTTransfer(fromAddress, toAddress, params.tokenId);
    } catch (err) {
      console.error("Error sending ETH:", err);
    }
  };

  // 执行 NFT 转账的函数
  const handleNFTTransfer = async (fromAddress, toAddress, tokenId) => {
    try {
      const nftTx = await ethersNftContract.safeTransferFrom(fromAddress, toAddress, tokenId);
      const nftReceipt = await nftTx.wait();
      console.log("NFT Transfer confirmed:", nftReceipt);
      await ethersAuctionContract.resetAuction();
      console.log("Auction has been reset after NFT transfer.");
    } catch (err) {
      console.error("Error transferring NFT:", err);
    }
  };

  useEffect(() => {
    if (highestBid !== null && highestBidder !== '' && tokenId !== null) {
      console.log(tokenId);
      const params = {
        fromAddress: account,
        toAddress: highestBidder,
        ethAmount: highestBid,
        tokenId: tokenId, // 使用最新的 tokenId
      };
      setTransferParams(params);
    }
  }, [highestBid, highestBidder, tokenId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchAuctionDetails();
      //ethersAuctionContract.resetAuction();
    }, 10000); // 每10秒轮询一次
  
    return () => clearInterval(intervalId); // 清理定时器
  }, [ethersAuctionContract]);

  const formatTime = (seconds) => {
    const sec = Math.floor(seconds % 60);
    const min = Math.floor((seconds / 60) % 60);
    const hour = Math.floor((seconds / 3600) % 24);
    return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        {!isMinted && !mintError && (
          <>
            <input type="file" accept="image/*" onChange={handleFileChange} className="input-field w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" />
            <button onClick={mintNFT} className="btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out">
              Mint NFT
            </button>
          </>
        )}

        {isMinted && (
          <div className="text-center mb-4">
            <p className="text-green-600">NFT Minted Successfully!</p>
            <p className="text-gray-600 text-sm">Metadata URI: {nftUri}</p>
            <p className="text-gray-600 text-sm">Token ID: {tokenId}</p>
          </div>
        )}
      </div>

      {!auctionStarted ? (
        <div>
          <input
            type="text"
            placeholder="Starting Auction Bid (ETH)"
            value={auctionAmount}
            onChange={(e) => setAuctionAmount(e.target.value)}
            className="input-field w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="number"
            placeholder="Auction Duration (minutes)"
            value={auctionDuration}
            onChange={(e) => setAuctionDuration(e.target.value)}
            className="input-field w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={startAuction}
            className="btn bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out"
          >
            Start Auction
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600">Auction is ongoing. Place your bid below:</p>
          <input
            type="text"
            placeholder="Bid Amount (ETH)"
            value={auctionAmount}
            onChange={(e) => setAuctionAmount(e.target.value)}
            className="input-field w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={placeBid}
            className="btn bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out"
          >
            Place Bid
          </button>
        </div>
      )}

      <div className="mt-4">
        {auctionStarted && (
          <div>
            <p className="text-gray-600">Highest Bid: {highestBid} ETH</p>
            <p className="text-gray-600">Highest Bidder: {highestBidder}</p>
            <p className="text-gray-600">Time Remaining: {timeRemaining}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTMintAndAuction;
