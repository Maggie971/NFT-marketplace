// pages/index.js
import { useContext } from 'react';
import { Web3Context } from '@components/Web3Context';
import NavBar from '@components/navbar/NavBar';
import NFTMintAndAuction from '@components/NFTAuction/NFTMintAndAuction';
import AuctionStatus from '@components/NFTAuction/AuctionStatus';
import dotenv from 'dotenv';
dotenv.config();

export default function Home() {
  const { contract } = useContext(Web3Context);

  return (
    <>
      <NavBar />
      <NFTMintAndAuction />
    </>
  );
}
