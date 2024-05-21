
import type { Option, } from "@/modules/shared/utils/error-handling";
import type { Asset, Chain, ChannelPair, } from "../../models";
import { getAssetByDenom } from "./get-asset-by-denom";
import { getAssetsByChainName } from "./get-assets-by-chain-name";
import { getChainById } from "./get-chain-by-id";
import { getChainByName } from "./get-chain-by-name";
import { getChannelPairsByChain } from "./get-channel-pairs";



export interface RegistryService {
	getChainById: (chainId: string) => Option<Chain>;
	getChainByName: (chainName: string) => Option<Chain>;
	getAssetsByChainName: (chainName: string) => Option<Asset[]>;
	getAssetByDenom: (denom: string) => Option<Asset>;
	getChannelPairsByChain: (sourceChain: Chain) => Option<ChannelPair[]>;
}

export const registryService: RegistryService = {
	getChainById: getChainById,
	getChainByName: getChainByName,
	getAssetsByChainName: getAssetsByChainName,
	getAssetByDenom: getAssetByDenom,
	getChannelPairsByChain: getChannelPairsByChain,
}