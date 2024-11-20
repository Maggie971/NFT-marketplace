// SPDX-License-Identifier: ISC
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTCollection is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("NFTCollection", "NFTC") {}

    // safeMint函数公开，接受to（接收者）和uri（metadata URI）
    function safeMint(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();  // 获取当前tokenId
        _tokenIdCounter.increment();  // 增加tokenId计数器
        _safeMint(to, tokenId);  // mint新的NFT
        _setTokenURI(tokenId, uri);  // 设置token的URI
        return tokenId;  // 返回新mint的tokenId
    }

    // 自定义基础URI
    function _baseURI() internal view virtual override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }
}
