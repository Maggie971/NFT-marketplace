// SPDX-License-Identifier: ISC
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Auction {
    address public nftContract;
    uint256 public nftTokenId;
    address public seller;
    uint256 public highestBid;
    address public highestBidder;
    uint256 public auctionEndTime;
    bool public auctionEnded;
    
    bool public auctionStarted; // 新增拍卖开始状态

    event NewBid(address bidder, uint256 amount);
    event AuctionStarted(address seller, uint256 startingBid, uint256 auctionEndTime);
    event AuctionEnded(address winner, uint256 amount);

    constructor(address _nftContract, uint256 _nftTokenId, uint256 _startingBid, uint256 _duration) {
        nftContract = _nftContract;
        nftTokenId = _nftTokenId;
        seller = msg.sender;
        highestBid = _startingBid;
        auctionEndTime = block.timestamp + _duration;
        auctionEnded = false;
        auctionStarted = false; // 初始化为未开始
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this");
        _;
    }

    modifier auctionOpen() {
        require(block.timestamp < auctionEndTime, "Auction has ended");
        _;
    }

    modifier auctionClosed() {
        require(block.timestamp >= auctionEndTime, "Auction is still ongoing");
        require(!auctionEnded, "Auction already ended");
        _;
    }

    modifier auctionNotStarted() {
        require(!auctionStarted, "Auction already started");
        _;
    }

    // 启动拍卖并设置起始出价和持续时间
    function startAuction(uint256 startingBid, uint256 duration) external onlySeller auctionNotStarted {
        auctionStarted = true;
        auctionEndTime = block.timestamp + duration;  // 动态设置拍卖结束时间
        highestBid = startingBid;
        emit AuctionStarted(seller, startingBid, auctionEndTime);
    }

    function placeBid() external payable auctionOpen {
        require(msg.value > highestBid, "Bid must be higher than the current highest bid");

        // Refund the previous highest bidder
        if (highestBid != 0) {
            payable(highestBidder).transfer(highestBid);
        }

        highestBid = msg.value;
        highestBidder = msg.sender;

        emit NewBid(msg.sender, msg.value);
    }

    function endAuction() external onlySeller auctionClosed {
        auctionEnded = true;

        // Transfer the NFT to the highest bidder
        IERC721(nftContract).safeTransferFrom(seller, highestBidder, nftTokenId);

        // Transfer the highest bid to the seller
        payable(seller).transfer(highestBid);

        emit AuctionEnded(highestBidder, highestBid);
    }
}
