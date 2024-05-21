import { type Option, option } from "@/modules/shared/utils/error-handling";
import type { CosmosApi } from ".";
import type { AssetBalanceDTO } from "./dtos";

type GetBalancesResponse = {
	balances: Array<{
		denom: string;
		amount: string
	}>;
}

export const getBalances: CosmosApi['getBalances'] = async (options: { restEndpoint: string, address: string }): Promise<Option<AssetBalanceDTO[]>> => {
	try {
		const url = new URL(`${options.restEndpoint}/cosmos/bank/v1beta1/balances/${options.address}`);
		const response = await fetch(`/api/cors-proxy?url=${url.toString()}`, {
			method: "GET",
			headers: {
				accept: "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch balances, endpoint returned ${response.status}`);
		}

		const { balances } = (await response.json()) as GetBalancesResponse;

		return option.ok(balances);
	} catch (error) {
		return option.failFromUnknown(error);
	}
}