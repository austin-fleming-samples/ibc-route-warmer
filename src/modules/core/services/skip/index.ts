import type { Option, } from "@/modules/shared/utils/error-handling";
import type { Asset, Chain, } from "../../models";
import type { AssetBalance } from "../../models/asset-balance";
import { getSupportedAssetBalances } from "./get-supported-asset-balances";
import { getSupportedAssets } from "./get-supported-assets";
import { getSupportedChains } from "./get-supported-chains";

export interface SkipService {
	getSupportedChains: (options: { includeEVM?: boolean, includeTestnet?: boolean }) => Promise<Option<Chain[]>>;
	getSupportedAssets: (options: { chainId: string }) => Promise<Option<Asset[]>>;
	getSupportedAssetBalances: (options: { restEndpoints: string, chainId: string, address: string }) => Promise<Option<AssetBalance[]>>;
}

export const skipService: SkipService = {
	getSupportedChains,
	getSupportedAssets,
	getSupportedAssetBalances
}