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
    
    bool public auctionStarted; // 拍卖开始状态

    event NewBid(address bidder, uint256 amount);
    event AuctionStarted(address seller, uint256 startingBid, uint256 auctionEndTime);
    event AuctionEnded(address winner, uint256 amount);
    event AuctionError(string message);
    event Debug(string message);

    constructor(address _nftContract, uint256 _nftTokenId, uint256 _startingBid, uint256 _duration) {
        nftContract = _nftContract;
        nftTokenId = _nftTokenId;
        seller = msg.sender;
        highestBid = _startingBid;
        auctionEndTime = block.timestamp + _duration;
        auctionEnded = false;
        auctionStarted = false; // 初始状态未开始
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
        auctionEndTime = block.timestamp + duration; // 拍卖结束时间
        highestBid = startingBid;

        emit AuctionStarted(seller, startingBid, auctionEndTime);
        emit Debug("Auction started successfully");
    }

    // 清除拍卖相关状态
    function resetAuction() public {
        auctionStarted = false;
        auctionEnded = false;
        highestBid = 0;
        highestBidder = address(0);
        auctionEndTime = 0;
        emit Debug("Auction reset");
    }

    // 进行出价
    function placeBid() external payable auctionOpen {
        require(msg.value > highestBid, "Bid must be higher than the current highest bid");

        // 退款给之前的出价者
        if (highestBid != 0) {
            payable(highestBidder).transfer(highestBid);
        }

        highestBid = msg.value;
        highestBidder = msg.sender;

        emit NewBid(msg.sender, msg.value);
        emit Debug("Bid placed successfully");
    }

    // 结束拍卖
    function endAuction() external {
        auctionEnded = true;
        auctionStarted = false;

        if (highestBidder != address(0)) {
            // 转移 NFT 到最高出价者
            try IERC721(nftContract).safeTransferFrom(seller, highestBidder, nftTokenId) {
                emit Debug("NFT transfer successful");
            } catch {
                emit AuctionError("Failed to transfer the NFT to the highest bidder");
                revert("Failed to transfer the NFT");
            }

            // 将最高出价转移给卖家
            bool paymentSuccessful = payable(seller).send(highestBid);
            if (!paymentSuccessful) {
                emit AuctionError("Failed to transfer the highest bid to the seller");
                revert("Failed to transfer the highest bid");
            }
            emit Debug("Payment transfer successful");
        } else {
            emit Debug("No bids placed, auction ended without transferring NFT or payment");
        }

        emit AuctionEnded(highestBidder, highestBid);

        // Reset auction state for future use
        resetAuction(); // 重置拍卖状态，准备好下一次拍卖
    }
}
