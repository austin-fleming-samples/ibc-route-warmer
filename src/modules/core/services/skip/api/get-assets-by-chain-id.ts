import { CONFIG } from "@/config/constants";
import { option } from "@/modules/shared/utils/error-handling";
import type { SkipApi } from ".";
import type { AssetDTO } from "./dtos";

type GetAssetsResponse = {
	chain_to_assets_map: {
		[chainId: string]: {
			assets: AssetDTO[]
		}
	}
}

const sortAssets = (assets: AssetDTO[]): AssetDTO[] => {

	assets.sort((a, b) => {
		const aName = a.name.toLowerCase()
		const bName = b.name.toLowerCase()

		if (aName < bName) {
			return -1;
		}
		if (aName > bName) {
			return 1;
		}
		return 0;
	})

	return assets
}

export const getAssetsByChainId: SkipApi['getAssetsByChainId'] = async (chainId: string) => {
	const url = new URL(`${CONFIG.SKIP.API_URL}/v1/fungible/assets?chain_id=${chainId}`)
	const encodedUrl = encodeURIComponent(url.toString())

	return fetch(`/api/cors-proxy?url=${encodedUrl}`,
		{
			method: "GET",
			headers: {
				accept: "application/json",
			},
		})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Failed to fetch assets: ${response.statusText}`)
			}

			return response.json()
		})
		.then((response: GetAssetsResponse) => {
			const chainAssets = response.chain_to_assets_map?.[chainId]?.assets
			if (!chainAssets) {
				throw new Error(`Could not find chain "${chainId}" in assets map.`)
			}

			return chainAssets
		})
		.then(sortAssets)
		.then(option.ok)
		.catch(option.failFromUnknown)
}