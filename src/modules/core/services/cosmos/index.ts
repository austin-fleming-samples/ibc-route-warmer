import type { Option, } from "@/modules/shared/utils/error-handling";
import type { AssetBalance } from "../../models/asset-balance";
import { getBalances } from "./get-balances";

export interface CosmosService {
	getBalances: (options: { restEndpoint: string, address: string }) => Promise<Option<AssetBalance[]>>;
}

export const cosmosService: CosmosService = {
	getBalances,
}