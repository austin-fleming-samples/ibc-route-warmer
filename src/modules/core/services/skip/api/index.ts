import type { Option } from "@/modules/shared/utils/error-handling";
import type { AssetDTO, ChainDTO } from "./dtos";
import { getAssetsByChainId } from "./get-assets-by-chain-id";
import { getChains } from "./get-chains";

export interface SkipApi {
	getChains: (options: { includeEVM: boolean; includeTestnet: boolean }) => Promise<Option<ChainDTO[]>>
	getAssetsByChainId: (chainId: string) => Promise<Option<AssetDTO[]>>
}

export const skipApi: SkipApi = {
	getChains: getChains,
	getAssetsByChainId: getAssetsByChainId
}