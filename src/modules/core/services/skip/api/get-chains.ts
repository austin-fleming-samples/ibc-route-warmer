import { CONFIG } from "@/config/constants";
import { type Option, option } from "@/modules/shared/utils/error-handling";
import type { SkipApi } from ".";
import type { ChainDTO } from "./dtos";

type GetChainsResponse = {
	chains: ChainDTO[]
}

const sortChains = (chains: ChainDTO[]): ChainDTO[] => {
	chains.sort((a, b) => {
		if (a.chain_name < b.chain_name) {
			return -1;
		}
		if (a.chain_name > b.chain_name) {
			return 1;
		}
		return 0;
	})

	return chains
}

export const getChains: SkipApi['getChains'] = async (options: {
	includeEVM: boolean,
	includeTestnet: boolean
}): Promise<Option<ChainDTO[]>> => {
	const url = new URL(`${CONFIG.SKIP.API_URL}/v1/info/chains`)
	url.searchParams.append("include_evm", options.includeEVM.toString())
	url.searchParams.append("include_testnet", options.includeTestnet.toString())

	const encodedUrl = encodeURIComponent(url.toString())

	return fetch(`/api/cors-proxy?url=${encodedUrl}`,
		{
			method: "GET",
			headers: {
				accept: "application/json",
			},
		})
		.then(response => {
			if (!response.ok) {
				throw new Error(`Failed to fetch chains: ${response.statusText}`)
			}

			return response.json()
		})
		.then((data: GetChainsResponse) => sortChains(data.chains))
		.then(option.ok)
		.catch(option.failFromUnknown)
}