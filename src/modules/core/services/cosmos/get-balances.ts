
import { option } from "@/modules/shared/utils/error-handling";
import { BigNumber } from "bignumber.js";
import type { CosmosService } from ".";
import type { AssetBalance } from "../../models/asset-balance";
import { registryService } from "../registry";
import { cosmosApi } from "./api";

export const getBalances: CosmosService['getBalances'] = async (options: { restEndpoint: string, address: string }) => {
	try {
		const rawBalances = (await cosmosApi.getBalances(options)).unwrapOrThrow()

		const balances: AssetBalance[] = []
		for (const balance of rawBalances) {
			const amount = BigNumber(balance.amount)

			registryService.getAssetByDenom(balance.denom).match({
				ok: (asset) => {
					balances.push({
						actualAmount: amount,
						displayAmount: amount.shiftedBy(-asset.exponent).toString(),
						asset: asset,
					})
				},
				fail: (error) => {
					console.warn(`Skipping balance for asset: ${balance.denom}:`, error)
				}
			})
		}

		return option.ok(balances)
	} catch (error) {
		return option.failFromUnknown(error);
	}
};