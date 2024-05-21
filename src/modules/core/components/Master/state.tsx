import { CONFIG } from "@/config/constants";
import type { MsgTransferEncodeObject, StdFee } from "@cosmjs/stargate";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain, useWalletClient } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import type { Asset, Chain, ChannelPair } from "../../models";
import { registryService } from "../../services/registry";
import { skipService } from "../../services/skip";

type State = {
	amount: string;
	sender?: string;
	receiver?: string;
	chainList: Chain[];
	assetList: Asset[];
	channelPairList: ChannelPair[];
	chain: Chain;
	asset?: Asset;
	channelPair?: ChannelPair;
	destinationChain?: Chain;
	derivedAminoMessage?: {
		sourcePort: string;
		sourceChannel: string;
		token: {
			denom: string;
			amount: string;
		};
		sender: string;
		receiver: string;
		memo: string;
	};
};

type Actions = {
	setAmount: (amount: string) => void;
	setChain: (chainId: string) => void;
	setAsset: (assetDenom: string) => void;
	setChannelPair: (channelId: string) => void;
	simulateTransfer: () => Promise<void>;
	signAndBroadcast: () => Promise<void>;
};

const initialState: State = {
	amount: "0",
	sender: "",
	receiver: "",
	chainList: [],
	assetList: [],
	channelPairList: [],
	chain: registryService
		.getChainById(CONFIG.CONNECTION.DEFAULT_CHAIN_ID)
		.match({
			ok: (chain) => chain,
			fail: () => {
				throw new Error("Default chain not found in registry");
			},
		}),
};

const TransferContext = createContext<State & Actions>({
	...initialState,
	setAmount: (_) => {},
	setChain: (_) => {},
	setAsset: (_) => {},
	setChannelPair: (_) => {},
	simulateTransfer: async () => {},
	signAndBroadcast: async () => {},
});
export const useTransferContext = () => useContext(TransferContext);

export const TransferProvider = ({ children }: { children: ReactNode }) => {
	const [state, setState] = useState<State>(initialState);
	const { connect, status, address, getSigningStargateClient, estimateFee } =
		useChain(state.chain.chainName);
	const { client } = useWalletClient();

	useEffect(() => {
		if (status !== WalletStatus.Connected) {
			setState((prevState) => ({ ...prevState, sender: undefined }));
			return;
		}

		setState((prevState) => ({ ...prevState, sender: address }));
	}, [address]);

	useEffect(() => {
		if (!state.sender) {
			setState((prevState) => ({ ...prevState, receiver: undefined }));
			return;
		}

		connect();
	}, [state.sender]);

	useEffect(() => {
		if (state.chainList.length > 0) {
			return;
		}

		skipService.getSupportedChains({}).then((result) =>
			result.match({
				ok: (chains) => {
					setState((prevState) => ({ ...prevState, chainList: chains }));
				},
				fail: (error) => {
					console.error(error);
				},
			}),
		);
	}, []);

	useEffect(() => {
		if (!state.chain.chainId) {
			return;
		}

		skipService
			.getSupportedAssets({ chainId: state.chain.chainId })
			.then((result) =>
				result.match({
					ok: (assets) => {
						setState((prevState) => ({ ...prevState, assetList: assets }));
					},
					fail: (error) => {
						console.error(error);
					},
				}),
			);
	}, [state.chain]);

	useEffect(() => {
		if (!state.chain.chainId) {
			return;
		}

		registryService.getChannelPairsByChain(state.chain).match({
			ok: (channelPairs) => {
				setState((prevState) => ({
					...prevState,
					channelPairList: channelPairs,
				}));
			},
			fail: (error) => {
				console.error(error);
			},
		});
	}, [state.chain]);

	useEffect(() => {
		if (!(state.channelPair && client)) {
			setState((prevState) => ({
				...prevState,
				destinationChain: undefined,
				receiver: undefined,
			}));
			return;
		}

		registryService.getChainById(state.channelPair.counterparty.chainId).match({
			ok: (chain) => {
				client.getAccount?.(chain.chainName).then((account) => {
					setState((prevState) => ({
						...prevState,
						destinationChain: chain,
						receiver: account.address,
					}));
				});
			},
			fail: (error) => {
				throw error;
			},
		});
	}, [state.channelPair, client]);

	const simulateTransfer = useCallback(async () => {
		try {
			if (!state.derivedAminoMessage) {
				console.warn("Cannot simulate transfer without derived amino message");
				return;
			}

			const stargateClient = await getSigningStargateClient();
			if (!stargateClient) {
				console.warn(
					"Cannot simulate transfer. Failed to load stargate signer",
				);
				return;
			}

			const current_time = Math.floor(Date.now() / 1000);
			const timeout_time = current_time + 300;
			const timeoutTimestampNanoseconds = BigNumber(timeout_time).multipliedBy(
				BigNumber(1_000_000_000),
			);

			const message: MsgTransferEncodeObject = {
				typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
				value: {
					...state.derivedAminoMessage,
					timeoutTimestamp: BigInt(timeoutTimestampNanoseconds.toString()),
				},
			};

			const result = await stargateClient.simulate(
				state.derivedAminoMessage.sender,
				[message],
				undefined,
			);

			const feeResult = await estimateFee(
				[message],
				"stargate",
				undefined,
				1.3,
			);
		} catch (error) {
			console.error("Failed to simulate transfer", error);
		}
	}, [state.derivedAminoMessage, getSigningStargateClient]);

	const signAndBroadcast = useCallback(async () => {
		try {
			if (!state.derivedAminoMessage) {
				console.warn("Cannot signAndBroadcast without derived amino message");
				return;
			}

			const stargateClient = await getSigningStargateClient();
			if (!stargateClient) {
				console.warn(
					"Cannot signAndBroadcast transfer. Failed to load stargate signer",
				);
				return;
			}

			const current_time = Math.floor(Date.now() / 1000);
			const timeout_time = current_time + 300;
			const timeoutTimestampNanoseconds = new BigNumber(
				timeout_time,
			).multipliedBy(BigNumber(1_000_000_000));

			const message: MsgTransferEncodeObject = {
				typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
				value: {
					...state.derivedAminoMessage,
					timeoutTimestamp: BigInt(timeoutTimestampNanoseconds.toString()),
				},
			};

			const fee: StdFee = {
				amount: [
					{
						denom: state.derivedAminoMessage.token.denom,
						amount: "1000",
					},
				],
				gas: "300000",
			};

			const result = await stargateClient.signAndBroadcast(
				state.derivedAminoMessage.sender,
				[message],
				fee,
			);
		} catch (error) {
			console.error("Failed to SignAndBroadcast transfer", error);
		}
	}, [state.derivedAminoMessage, getSigningStargateClient]);

	useEffect(() => {
		try {
			const { amount, asset, chain, channelPair, sender, receiver } = state;
			// biome-ignore lint/complexity/useSimplifiedLogicExpression: <explanation>
			if (!amount || !asset || !chain || !channelPair || !sender || !receiver) {
				setState((prevState) => ({
					...prevState,
					derivedAminoMessage: undefined,
				}));
				return;
			}

			const message: State["derivedAminoMessage"] = {
				sender,
				receiver,
				sourceChannel: channelPair.source.channelId,
				sourcePort: channelPair.source.portId,
				token: {
					amount,
					denom: asset.denom,
				},
				memo: "",
			};

			setState((prevState) => ({
				...prevState,
				derivedAminoMessage: message,
			}));
		} catch (error) {
			console.error("Failed to derive transfer props", error);
		}
	}, [
		state.amount,
		state.asset,
		state.chain,
		state.channelPair,
		state.sender,
		state.receiver,
	]);

	const setAmount = (amount: string) => {
		setState((prevState) => ({ ...prevState, amount }));
	};

	const setChain = (chainId: string) => {
		const chain = state.chainList.find((chain) => chain.chainId === chainId);
		if (!chain) {
			throw new Error(`Chain with id ${chainId} not found in chain list`);
		}

		setState((prevState) => ({ ...prevState, chain }));
	};

	const setAsset = (assetDenom: string) => {
		const asset = state.assetList.find((asset) => asset.denom === assetDenom);
		if (!asset) {
			throw new Error(`Asset with denom ${assetDenom} not found in asset list`);
		}

		setState((prevState) => ({ ...prevState, asset }));
	};

	const setChannelPair = (channelId: string) => {
		const channelPair = state.channelPairList.find(
			({ source }) => source.channelId === channelId,
		);
		if (!channelPair) {
			throw new Error(
				`Channel with id ${channelId} not found in channel pair list`,
			);
		}

		setState((prevState) => ({ ...prevState, channelPair }));
	};

	return (
		<TransferContext.Provider
			value={{
				...state,
				setAmount,
				setChain,
				setAsset,
				setChannelPair,
				simulateTransfer,
				signAndBroadcast,
			}}
		>
			{children}
		</TransferContext.Provider>
	);
};
