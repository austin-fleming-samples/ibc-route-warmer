import { CosmosKitProvider } from "@/modules/core/providers/CosmosKitProvider";
import "@/modules/shared/styles/globals.css";
import { WalletConnectionProvider } from "@/modules/wallet/state/use-wallet-connection";
import "@interchain-ui/react/styles";
import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => (
	<CosmosKitProvider>
		<WalletConnectionProvider>
			<Component {...pageProps} />
		</WalletConnectionProvider>
	</CosmosKitProvider>
);

export default App;
