import { useContext } from 'react';
import { Web3Context } from '@components/Web3Context';
import MetaMask from './MetaMask';

const NavBar = () => {
  const { account } = useContext(Web3Context);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <nav>
        {/* 只显示 MetaMask 组件 */}
        {!account ? (
          <MetaMask />
        ) : (
		<MetaMask />
        )}
      </nav>
    </header>
  );
};

export default NavBar;
