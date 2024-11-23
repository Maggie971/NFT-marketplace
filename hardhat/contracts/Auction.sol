// SPDX-License-Identifier: ISC
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Auction {
    address public nftContract;
    uint256 public nftTokenId; // 动态更新
    uint256 public highestBid;
    address public highestBidder;
    uint256 public auctionEndTime;
    uint256 public startingBid;
    bool public auctionEnded;
    bool public auctionStarted;

    event NewBid(address bidder, uint256 amount);
    event AuctionStarted(address seller, uint256 startingBid, uint256 auctionEndTime);
    event AuctionEnded(address winner, uint256 amount);
    event Debug(string message);

    constructor(address _nftContract) {
        nftContract = _nftContract;
        auctionEnded = false;
        auctionStarted = false;
        highestBid = 0;
        highestBidder = address(0);
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
    function startAuction(uint256 _startingBid, uint256 duration, uint256 _nftTokenId) external auctionNotStarted {
        address owner = IERC721(nftContract).ownerOf(_nftTokenId);
        require(msg.sender == owner, "You must own the NFT to start the auction");

        nftTokenId = _nftTokenId; // 动态设置 NFT 的 tokenId
        auctionStarted = true;
        auctionEndTime = block.timestamp + duration;
        startingBid = _startingBid;
        highestBid = 0;
        highestBidder = address(0);

        emit AuctionStarted(msg.sender, _startingBid, auctionEndTime);
        emit Debug("Auction started successfully");
    }

    function resetAuction() public {
        auctionStarted = false;
        auctionEnded = false;
        startingBid = 0;
        highestBid = 0;
        highestBidder = address(0);
        auctionEndTime = 0;
        emit Debug("Auction reset");
    }

    // 进行出价
    function placeBid() external payable auctionOpen {
        require(msg.value >= startingBid, "Bid must be at least the starting bid");
        require(msg.value > highestBid, "Bid must be higher than the current highest bid");

        if (highestBidder != address(0)) {
            bool refunded = payable(highestBidder).send(highestBid);
            require(refunded, "Refund failed");
        }

        highestBid = msg.value;
        highestBidder = msg.sender;

        emit NewBid(msg.sender, msg.value);
        emit Debug("Bid placed successfully");
    }

    // 结束拍卖
    function endAuction() external auctionClosed {
        auctionEnded = true;
        auctionStarted = false;

        emit Debug("Starting NFT transfer...");
        this.safeTransferNFT(highestBidder, nftTokenId); // Transfer NFT
        emit Debug("NFT transferred successfully");

        emit Debug("Starting payment transfer...");
        this.transferHighestBid(); // Transfer payment
        emit Debug("Payment transfer successful");

        emit AuctionEnded(highestBidder, highestBid);
        resetAuction();
    }

    // 转移资金给卖家
    function transferHighestBid() public {
        address seller = IERC721(nftContract).ownerOf(nftTokenId);
        require(highestBid > 0, "No funds to transfer");
        require(highestBidder != address(0), "No valid highest bidder");

        emit Debug("Attempting to transfer funds to seller...");
        (bool success, ) = payable(seller).call{value: highestBid}("");
        require(success, "Payment transfer failed");

        emit Debug("Payment transfer successful");
    }

    // 安全转移 NFT
    function safeTransferNFT(address _to, uint256 _tokenId) public {
        emit Debug("Verifying the seller and recipient addresses...");

        address seller = IERC721(nftContract).ownerOf(_tokenId);
        require(_to != address(0), "Invalid recipient address");
        require(seller != address(0), "Seller address is invalid");

        IERC721(nftContract).safeTransferFrom(seller, _to, _tokenId);
        emit Debug("NFT transferred successfully");
    }
}
