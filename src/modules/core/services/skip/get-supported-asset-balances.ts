import { option } from "@/modules/shared/utils/error-handling";
import { sortByBigNumber } from "@/modules/shared/utils/sorting";
import { BigNumber } from "bignumber.js";
import type { SkipService } from ".";
import type { AssetBalance } from "../../models/asset-balance";
import { cosmosService } from "../cosmos";
import { getSupportedAssets } from "./get-supported-assets";

export const getSupportedAssetBalances: SkipService['getSupportedAssetBalances'] = async ({ restEndpoints, chainId, address }) => {
	try {
		const allBalances = (await cosmosService.getBalances({ restEndpoint: restEndpoints, address })).unwrapOrThrow()
		const supportedAssets = (await getSupportedAssets({ chainId })).unwrapOrThrow()

		const supported: AssetBalance[] = supportedAssets.map((asset) => {
			const balance = allBalances.find((balance) => balance.asset.denom === asset.denom)

			const amount = balance ? balance.actualAmount : BigNumber('0')
			return {
				asset,
				actualAmount: amount,
				displayAmount: amount.shiftedBy(-asset.exponent).toString(),
			}
		})

		supported.sort(sortByBigNumber('actualAmount'))

		return option.ok(supported)
	} catch (error) {
		return option.failFromUnknown(error);
	}
}