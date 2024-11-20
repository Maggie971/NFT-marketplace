import { useContext, useState, useEffect } from 'react';
import { Web3Context } from '../Web3Context';  // 引入 Web3Context
import Web3 from 'web3';  // 导入 Web3.js

const AuctionStatus = () => {
  const { auctionContract } = useContext(Web3Context);
  const [highestBid, setHighestBid] = useState(null);
  const [highestBidder, setHighestBidder] = useState('');

  useEffect(() => {
    if (auctionContract) {
      const fetchAuctionDetails = async () => {
        try {
          // 使用 web3.js 代替 ethers.js
          const bid = await auctionContract.methods.highestBid().call();
          const bidder = await auctionContract.methods.highestBidder().call();
          setHighestBid(Web3.utils.fromWei(bid, 'ether'));  // 使用 web3.js 的 fromWei 方法
          setHighestBidder(bidder);
        } catch (err) {
          console.error('Error fetching auction details', err);
        }
      };

      fetchAuctionDetails();
    }
  }, [auctionContract]);  // 依赖 auctionContract

  return (
    <div>
      <h3>Auction Status</h3>
      <p>Highest Bid: {highestBid !== null ? highestBid : 'Loading...'} ETH</p>
      <p>Highest Bidder: {highestBidder || 'No bids yet'}</p>
    </div>
  );
};

export default AuctionStatus;
