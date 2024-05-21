import { CONFIG } from "@/config/constants";
import type { Chain } from "@/modules/core/models";
import type { AssetBalance } from "@/modules/core/models/asset-balance";
import { cosmosService } from "@/modules/core/services/cosmos";
import { registryService } from "@/modules/core/services/registry";
import { skipService } from "@/modules/core/services/skip";
import { errorOrUnknown } from "@/modules/shared/utils/error-handling";
import type { SigningStargateClient } from "@cosmjs/stargate";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain, useWalletClient } from "@cosmos-kit/react";
import { type ReactNode, createContext, useContext, useState } from "react";
import { useCurrentChainStore } from "../use-current-chain-store";

type ConnectedState = {
	status: "CONNECTED";
	chain: Chain;
	chains: Chain[];
	balances: AssetBalance[];
	address: string;
	restEndpoint: string;
	signingStargateClient: SigningStargateClient;
};

type DisconnectedState = {
	status: "DISCONNECTED" | "CONNECTING";
	chain: Chain;
};

type ErrorState = {
	status: "ERROR";
	error: Error;
	chain: Chain;
};

type WalletState = ConnectedState | DisconnectedState | ErrorState;

type WalletActions = {
	setChain: (chain: Chain) => void;
	connect: () => void;
	disconnect: () => void;
	/* signAndBroadcastTx: (message: any) => Promise<void>
	simulateTx: (message: any) => Promise<void>
	trackTx: (message: any) => Promise<void> */
};

const initialState: WalletState & WalletActions = {
	status: "DISCONNECTED",
	chain: registryService
		.getChainById(CONFIG.CONNECTION.DEFAULT_CHAIN_ID)
		.match({
			ok: (chain) => chain,
			fail: () => {
				throw new Error("Default chain not found in registry");
			},
		}),
	setChain: () => {},
	connect: () => {},
	disconnect: () => {},
	/* signAndBroadcastTx: async () => { },
	simulateTx: async () => { },
	trackTx: async () => { }, */
};

const WalletConnectionContext = createContext<WalletState & WalletActions>(
	initialState,
);
export const useWalletConnection = () => useContext(WalletConnectionContext);

/* 
	NOTE:
	I'm using this context to isolate wallet connection conditions
	to allow downstream consumers to trust the simplified state types
	provided by this context. For example, if the wallet is checked to be connected,
	there shouldn't need to be null checks that there is an address and endpoint available.

	Ideally, I would register event handlers with CosmosKit
	to respond to changes in wallet status, but I struggled to
	find documentation on events for CosmosKit. So I'm trying to
	isolate useEffect madness to this context.
*/
export const WalletConnectionProvider = ({
	children,
}: { children: ReactNode }) => {
	const [state, setState] = useState<WalletState>(initialState);
	const { currentChain, setCurrentChain } = useCurrentChainStore();
	const chainCtx = useChain(currentChain.chainName);
	const { client } = useWalletClient();

	const setChain = (chain: Chain) => {
		setCurrentChain(chain);
		setState({ ...state, chain });
	};

	const setError = async (error: Error) => {
		await client?.disconnect?.();
		setState({ status: "ERROR", error, chain: state.chain });
	};

	const connect = async () => {
		try {
			await chainCtx.connect();

			if (chainCtx.status !== WalletStatus.Connected) {
				throw new Error("Failed to connect wallet");
			}

			const address = chainCtx.address;
			if (!address) {
				throw new Error("No address found in wallet");
			}

			const restEndpoint = state.chain.restEndpoint;
			const [signingStargateClient, balances, chains] = await Promise.all([
				chainCtx.getSigningStargateClient(),
				cosmosService
					.getBalances({ restEndpoint, address })
					.then((result) => result.unwrapOrThrow()),
				skipService
					.getSupportedChains({})
					.then((result) => result.unwrapOrThrow()),
			]);

			setState({
				...state,
				status: "CONNECTED",
				chains,
				balances,
				address,
				restEndpoint,
				signingStargateClient,
			});
		} catch (error) {
			await setError(errorOrUnknown(error));
		}
	};

	const disconnect = async () => {
		await chainCtx.disconnect();
		setState({ ...initialState, chain: state.chain });
	};

	return (
		<WalletConnectionContext.Provider
			value={{
				...state,
				setChain,
				connect,
				disconnect,
			}}
		>
			{children}
		</WalletConnectionContext.Provider>
	);
};
