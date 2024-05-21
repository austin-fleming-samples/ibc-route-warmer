import { type Option, option } from "@/modules/shared/utils/error-handling"
import type { SkipService } from "."
import type { Asset } from "../../models";
import { registryService } from "../registry";
import { skipApi } from "./api";

export const getSupportedAssets: SkipService['getSupportedAssets'] =
	async ({
		chainId
	}: {
		chainId: string
	}): Promise<Option<Asset[]>> => {
		try {
			const assetsResponse = (await skipApi.getAssetsByChainId(chainId)).unwrapOrThrow()

			const assets: Asset[] = []
			for (const rawAsset of assetsResponse) {
				registryService.getAssetByDenom(rawAsset.origin_denom).match({
					ok: (asset) => {
						assets.push(asset)
					},
					fail: (error) => {
						console.groupCollapsed(`Skipping asset with denom ${rawAsset.denom}...`)
						console.warn(error)
						console.groupEnd()
					}
				})
			}

			return option.ok(assets);
		} catch (error) {
			return option.failFromUnknown(error);
		}
	}