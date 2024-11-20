import '@styles/globals.css';
import Web3Provider from '@components/Web3Context';
import dotenv from 'dotenv';
dotenv.config();

function MyApp({ Component, pageProps }) {
	return (
		<Web3Provider>
			<Component {...pageProps} />
		</Web3Provider>
	);
}

export default MyApp;
