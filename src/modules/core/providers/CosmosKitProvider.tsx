import { CONFIG } from "@/config/constants";
import { wallets } from "@cosmos-kit/keplr";
import { ChainProvider } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import type { ReactNode } from "react";

export const CosmosKitProvider = ({ children }: { children: ReactNode }) => {
	return (
		<ChainProvider
			chains={chains}
			assetLists={assets}
			wallets={wallets}
			walletConnectOptions={{
				signClient: {
					name: CONFIG.APP.TITLE,
					projectId: CONFIG.WALLET_CONNECT.PROJECT_ID,
					metadata: {
						name: CONFIG.APP.TITLE,
						description: CONFIG.APP.DESCRIPTION,
						url: CONFIG.APP.URL,
						icons: [CONFIG.APP.ICON],
					},
				},
			}}
		>
			{children}
		</ChainProvider>
	);
};
