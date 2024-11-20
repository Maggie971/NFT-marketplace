import { useState, useContext, useEffect } from 'react';
import { Web3Context } from '../Web3Context';
import axios from 'axios';
import AuctionStatus from './AuctionStatus';
import Web3 from 'web3';  // 引入 web3.js
import { ethers } from 'ethers';  // 引入 ethers.js

const NFTMintAndAuction = () => {
  const { nftContract, auctionContract, account } = useContext(Web3Context);
  const [nftUri, setNftUri] = useState('');
  const [auctionAmount, setAuctionAmount] = useState('');
  const [auctionAddress, setAuctionAddress] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isMinted, setIsMinted] = useState(false);
  const [mintError, setMintError] = useState('');
  const [progress, setProgress] = useState(0);  // 用来存储进度
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [auctionEndTime, setAuctionEndTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);  // 用来存储剩余时间
  const [web3, setWeb3] = useState(null);
  const [highestBid, setHighestBid] = useState(null);
  const [highestBidder, setHighestBidder] = useState('');
  const [seller, setSeller] = useState('');  // 添加卖家状态

  // 上传图片到 IPFS
  const uploadToIPFS = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: '421306db53f35a675193',  // 用你自己的 Pinata API Key
          pinata_secret_api_key: '55ff115a1caa602076823df3e703856287449dff99037d4b31d0366d63563ff1',  // 用你自己的 Pinata API Secret
        },
        onUploadProgress: (progressEvent) => {
          // 更新进度
          const percentage = (progressEvent.loaded / progressEvent.total) * 100;
          setProgress(percentage);
        },
      });

      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;  // 返回生成的 URI
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
    if (!nftContract || !imageFile || !account) {
      console.log('Missing contract or account');
      return;
    }

    const ipfsUri = await uploadToIPFS(imageFile);
    if (ipfsUri) {
      setNftUri(ipfsUri);

      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        nftContract.methods.safeMint(account, ipfsUri)
          .send({ from: account })
          .on('receipt', (receipt) => {
            console.log('NFT Minted!');
            setIsMinted(true);
            setProgress(100);  // 完成铸造时将进度设置为 100
          })
          .on('error', (err) => {
            console.error('Minting failed', err);
            setMintError('Minting NFT failed.');
          });
      } catch (err) {
        console.error('Minting failed', err);
        setMintError('Minting NFT failed.');
      }
    }
  };

  const startAuction = async () => {
    if (!auctionContract || !nftContract || !auctionAmount) {
      console.log('Missing contract or account');
      return;
    }

    const startingBid = ethers.parseEther(auctionAmount); // 使用 ethers.js 转换为 wei
    const duration = 3600;  // 设置拍卖持续时间为 1 小时

    try {
      await auctionContract.methods.startAuction(startingBid, duration).send({ from: account.toLowerCase() });  // 将account转换为小写
      console.log('Auction Started!');
      setAuctionAddress(auctionContract.address);
      setAuctionStarted(true);
      setAuctionEndTime(Math.floor(Date.now() / 1000) + duration);  // 用秒而非毫秒
    } catch (err) {
      console.error('Auction start failed', err);
    }
  };
  // 出价
  const placeBid = async () => {
    if (!auctionContract) return;

    const bidAmount = ethers.parseEther(auctionAmount); // 使用 ethers.js 转换为 wei

    try {
      await auctionContract.methods.placeBid().send({ from: account, value: bidAmount });
    } catch (err) {
      console.error('Bid failed', err);
    }
  };

  // 更新时间进度条和倒计时
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      if (auctionContract && account) {
        try {
          // 获取拍卖状态
          const auctionStatus = await auctionContract.methods.auctionStarted().call();
          setAuctionStarted(auctionStatus);
  
          // 获取卖家地址
          const sellerAddress = await auctionContract.methods.seller().call();
          setSeller(sellerAddress); // 使用setSeller更新卖家地址
  
          // 获取拍卖结束时间
          if (auctionStarted) {
            const endTime = await auctionContract.methods.auctionEndTime().call();
            setAuctionEndTime(Number(endTime)); // Ensure it's a number
  
            // 计算当前时间与拍卖结束时间的剩余时间
            const remainingTime = endTime - Math.floor(Date.now() / 1000); // 秒数
            setTimeRemaining(formatTime(remainingTime));
  
            const highestBidAmount = await auctionContract.methods.highestBid().call();
            setHighestBid(ethers.utils.formatEther(highestBidAmount)); // 将值格式化为 ETH
            const highestBidderAddress = await auctionContract.methods.highestBidder().call();
            setHighestBidder(highestBidderAddress);
          }
        } catch (error) {
          console.error('Error fetching auction details:', error);
        }
      }
    };
  
    fetchAuctionDetails();
  }, [auctionContract, account, auctionStarted]);

  // 更新时间进度条和倒计时
useEffect(() => {
  if (auctionStarted && auctionEndTime) {
    const interval = setInterval(async () => {
      const remainingTime = auctionEndTime - Math.floor(Date.now() / 1000); // 剩余时间

      // 自动结束拍卖的条件：剩余时间为0时触发
      if (remainingTime <= 0) {
        clearInterval(interval);
        setProgress(100);  // 拍卖结束时设置进度条为100%
        setTimeRemaining('Auction Ended');  // 拍卖结束时显示 "Auction Ended"
        
        // 调用合约的 endAuction 方法结束拍卖
        await endAuction();
      } else {
        setTimeRemaining(formatTime(remainingTime));
        setProgress((remainingTime / (auctionEndTime - Math.floor(Date.now() / 1000))) * 100);  // 根据剩余时间更新进度条
      }
    }, 1000);  // 每秒更新一次

    return () => clearInterval(interval);  // 清除定时器
  }
}, [auctionStarted, auctionEndTime]);

const endAuction = async () => {
  if (!auctionContract || !account) return;

  try {
    const sellerAddress = await auctionContract.methods.seller().call();
    // Convert both addresses to lowercase to ensure case-insensitive comparison
    if (account.toLowerCase() !== sellerAddress.toLowerCase()) {
      console.error('Only the seller can end the auction');
      return;
    }

    await auctionContract.methods.endAuction().send({ from: account.toLowerCase() });  // 使用小写account地址
    console.log('Auction Ended!');
    
    setAuctionStarted(false);
    setAuctionEndTime(null);
    setAuctionAmount('');
    setTimeRemaining('Auction Ended');
    setProgress(100);
  } catch (err) {
    console.error('Auction end failed', err);
  }
};


  // 格式化剩余时间为 HH:MM:SS 格式
  const formatTime = (seconds) => {
    const sec = Math.floor(seconds % 60);
    const min = Math.floor((seconds / 60) % 60);
    const hour = Math.floor((seconds / 3600) % 24);
    return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };
  

  // 监听拍卖开始和结束事件
  useEffect(() => {
    if (auctionContract) {
      auctionContract.on('AuctionStarted', (seller, startingBid, auctionEndTime) => {
        console.log('Auction Started:', seller, startingBid, auctionEndTime);
      });

      auctionContract.on('AuctionEnded', (winner, amount) => {
        console.log('Auction Ended:', winner, amount);
      });

      // 清理监听器，防止内存泄漏
      return () => {
        if (auctionContract) {
          auctionContract.removeListener('AuctionStarted');
          auctionContract.removeListener('AuctionEnded');
        }
      };
    }
  }, [auctionContract]);

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
            <p className="text-gray-600 text-sm">
              Metadata URI: <span className="text-blue-500">{nftUri.slice(0, 25)}...</span>
            </p>
            <button onClick={() => setIsMinted(false)} className="btn bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-full mt-4">
              Modify Image
            </button>
          </div>
        )}

        {mintError && (
          <div className="text-center mb-4">
            <p className="text-red-600">{mintError}</p>
            <button onClick={() => setMintError('')} className="btn bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-full mt-4">
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* 倒计时显示 */}
      <div className="mb-4">
        {auctionStarted && auctionEndTime && (
          <div className="text-center text-lg font-bold text-green-500">
            {timeRemaining === 'Auction Ended' ? 'Auction Ended' : `Time Remaining: ${timeRemaining}`}
          </div>
        )}
      </div>

      <div className="mb-4">
        {!auctionStarted ? (
          <div>
            <input
              type="text"
              placeholder="Starting Auction Bid (ETH)"
              value={auctionAmount}
              onChange={(e) => setAuctionAmount(e.target.value)}
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
            <input
              type="text"
              placeholder="Place Your Bid (ETH)"
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
      </div>


      {/* 拍卖状态显示 */}
      <div className="auction-status mt-6">
        <AuctionStatus />
      </div>
    </div>
  );
};

export default NFTMintAndAuction;
