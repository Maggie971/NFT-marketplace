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
  const [isSeller, setIsSeller] = useState(false);
  const [userNFTs, setUserNFTs] = useState([]);
  const [selectedTokenId, setSelectedTokenId] = useState(null); // 存储选中的 Token ID


  useEffect(() => {
    const checkIfSeller = async () => {
      if (tokenId !== null && ethersNftContract && account) {
        try {
          const owner = await ethersNftContract.ownerOf(tokenId);
          setIsSeller(owner.toLowerCase() === account.toLowerCase());
        } catch (error) {
          console.error('Failed to fetch owner:', error);
        }
      }
    };
    checkIfSeller();
  }, [tokenId, ethersNftContract, account]);

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
    console.log(`Uploaded IPFS URI: ${ipfsUri}`);
    const normalizedUri = normalizeIpfsUrl(ipfsUri);
    console.log(`Normalized IPFS URI: ${normalizedUri}`);
    if (!ipfsUri) return;
    setNftUri(normalizeIpfsUrl(ipfsUri));
  
    try {
      const tx = await ethersNftContract.safeMint(account, ipfsUri);
      const receipt = await tx.wait();
  
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
  
      // 保存 tokenId 到前端状态
       // 将 `tokenId` 保存在前端状态中
      setTokenId(tokenId);
      setIsMinted(true);
      setNftUri(ipfsUri);
    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  const handleSelectForAuction = (tokenId) => {
    setSelectedTokenId(tokenId);
    console.log(`Selected Token ID for Auction: ${tokenId}`);
  };
  

  // 辅助函数：将 ipfs:// URL 转换为 https://ipfs.io/ipfs/ URL
  const normalizeIpfsUrl = (url) => {
    if (url.startsWith("ipfs://")) {
      // 将 ipfs:// 转换为 https://gateway.pinata.cloud/ipfs/
      return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
    }
    // 如果已经是完整的 URL，不做处理
    if (url.startsWith("https://ipfs.io/ipfs/https://gateway.pinata.cloud/ipfs/")) {
      return url.replace("https://ipfs.io/ipfs/", ""); // 去掉多余前缀
    }
    return url;
  };
  

  const fetchUserNFTs = async () => {
    if (!ethersNftContract || !account) return;
  
    try {
      const nfts = [];
      for (let tokenId = 0; tokenId < 1000; tokenId++) { // 假设最多有 1000 个 Token
        try {
          const owner = await ethersNftContract.ownerOf(tokenId);
          if (owner.toLowerCase() === account.toLowerCase()) {
            const tokenUri = await ethersNftContract.tokenURI(tokenId);
            const normalizedUri = normalizeIpfsUrl(tokenUri);
            console.log(`Token ID: ${tokenId}, Token URI: ${tokenUri}, Normalized URI: ${normalizedUri}`);
            nfts.push({ tokenId, tokenUri: normalizedUri });
          }
        } catch (error) {
          console.log(`Token ID ${tokenId} does not exist.`);
          break; // 停止查询不存在的 Token
        }
      }
  
      setUserNFTs(nfts);
    } catch (error) {
      console.error('Failed to fetch user NFTs:', error);
    }
  };
  
  

  useEffect(() => {
    fetchUserNFTs();
  }, [ethersNftContract, account]);
  

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
        selectedTokenId // 传递 tokenId 到合约中
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
        const remainingTime = Math.max(endTimeNumber - currentTime, 0);
  
        // 更新剩余时间
        setTimeRemaining(formatTime(remainingTime));
        setAuctionEndTime(endTimeNumber);
  
        const highestBidAmount = await ethersAuctionContract.highestBid();
        setHighestBid(ethers.formatEther(highestBidAmount));
  
        const highestBidderAddress = await ethersAuctionContract.highestBidder();
        setHighestBidder(highestBidderAddress);

      } else {
        setAuctionEndTime(null); // 如果拍卖未开始或已结束，清空结束时间
      }
    } catch (error) {
      console.error('Error fetching auction details:', error);
    }
  };
  
  const handleETHTransfer = async (params) => {
    const { fromAddress, toAddress, ethAmount } = params;
  
    try {
      // 执行 ETH 转账
      const tx = await ethersAuctionContract.transferHighestBid();
      const receipt = await tx.wait();
      console.log("ETH Transfer confirmed:", receipt);
  
      // ETH 转账完成后，执行 NFT 转账
      const nftReceipt = await handleNFTTransfer(fromAddress, toAddress, params.tokenId);
  
      // 显示交易成功通知
      if (Notification.permission === "granted") {
        new Notification("Transaction Successful!", {
          body: `ETH Transfer Hash: ${receipt.transactionHash}\nNFT Transfer Hash: ${nftReceipt.transactionHash}`,
        });
      } else if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Transaction Successful!", {
              body: `ETH Transfer Hash: ${receipt.transactionHash}\nNFT Transfer Hash: ${nftReceipt.transactionHash}`,
            });
          }
        });
      }
  
      setHasTransferred(true);
    } catch (err) {
      console.error("Error in ETH transfer:", err);
      alert("Transaction Failed! Please try again.");
    }
  };
  
  const handleNFTTransfer = async (fromAddress, toAddress, tokenId) => {
    try {
      const nftTx = await ethersNftContract.safeTransferFrom(fromAddress, toAddress, tokenId);
      const nftReceipt = await nftTx.wait();
      console.log("NFT Transfer confirmed:", nftReceipt);
      return nftReceipt; // 返回 NFT 转账的回执
    } catch (err) {
      console.error("Error transferring NFT:", err);
      throw err; // 抛出错误供上层捕获
    }
  };
  
  

  useEffect(() => {
    if (highestBid !== null && highestBidder !== '') {
      const params = {
        fromAddress: account,
        toAddress: highestBidder,
        ethAmount: highestBid,
        tokenId: selectedTokenId, // 使用最新的 tokenId
      };
      setTransferParams(params);
    }
  }, [highestBid, highestBidder]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      if (tokenId !== null) { }
    }, 1000);

  
    return () => clearInterval(intervalId); 
  }, [ethersAuctionContract]);

  useEffect(() => {

    const intervalId1 = setInterval(() => {
      if (nftUri !== null) { }
    }, 1000);
  
    return () => clearInterval(intervalId1); 
  }, [ethersAuctionContract]);

  /* useEffect(() => {
    if (timeRemaining === '00:00:00' && transferParams && !hasTransferred) {
      console.log('Time reached 0 and parameters ready, ending auction...');
      endAuction(); // 调用结束逻辑
    }
  }, [timeRemaining, transferParams, hasTransferred]); */
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchAuctionDetails();
      //ethersAuctionContract.resetAuction();
    }, 1000); // 每10秒轮询一次
  
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
    {/* NFT 集合展示 */}
    <div className="mb-8">
  <h2 className="text-2xl font-bold mb-4">Your NFT Collection</h2>
  {userNFTs.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userNFTs.map((nft) => (
  <div key={nft.tokenId} className="nft-card border border-gray-300 p-3 rounded-md">
    <img
      src={normalizeIpfsUrl(nft.tokenUri)}
      alt={`NFT ${nft.tokenId}`}
      className="w-full h-48 object-cover mb-2 rounded"
      loading="lazy"
    />
    <p className="text-center text-sm font-medium">Token ID: {nft.tokenId}</p>
    //按钮
    <button
      onClick={() => handleSelectForAuction(nft.tokenId)}
      className="btn bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-full mt-2"
    >
      Select for Auction
    </button>
  </div>
))}
    </div>
  ) : (
    <p className="text-gray-600">No NFTs found. Mint one to get started!</p>
  )}
</div>
  <div className="mb-4">
    {/* 拍卖未开始 */}
    {!auctionStarted && (
      <>
        {!isMinted && !mintError && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input-field w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={mintNFT}
              className="btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out"
            >
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

        <div>
        {selectedTokenId !== null && (
          <p className="text-gray-600">Selected Token ID for Auction: {selectedTokenId}</p>
        )}
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
      </>
    )}

    {/* 拍卖已开始 */}
    {auctionStarted && (
      <>
        <div className="text-center mb-4">
          {nftUri && (
            <img
              src={nftUri}
              alt="NFT Image"
              className="w-full max-h-60 object-cover mb-4 rounded-lg"
            />
          )}
          <p className="text-gray-600">Time Remaining: {timeRemaining}</p>
          <p className="text-gray-600">Highest Bid: {highestBid} ETH</p>
          <p className="text-gray-600">Highest Bidder: {highestBidder}</p>
        </div>

        {!isSeller && (
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

          {isSeller && timeRemaining === '00:00:00' && !hasTransferred && (
            <button
              onClick={() => handleETHTransfer(transferParams)} // 直接调用并传递参数
              className="btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out"
            >
              Confirm the transaction
            </button>
          )}

          {isSeller && hasTransferred && (
            <button
            onClick={async () => {
              try {
                const tx = await ethersAuctionContract.resetAuction();
                await tx.wait(); // 等待交易确认
                console.log("Auction has been reset successfully");
              } catch (error) {
                console.error("Failed to reset auction:", error);
              }
            }}
            className="btn bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full"
          >
            Reset Auction
          </button>          
          )}
          
        </>
      )}
  </div>
</div>

  );
};

export default NFTMintAndAuction;
