import type { Option } from "@/modules/shared/utils/error-handling";
import type { AssetBalanceDTO } from "./dtos";
import { getBalances } from "./get-balances";

export interface CosmosApi {
	getBalances: (options: { restEndpoint: string; address: string }) => Promise<Option<AssetBalanceDTO[]>>;
}

export const cosmosApi: CosmosApi = {
	getBalances
}