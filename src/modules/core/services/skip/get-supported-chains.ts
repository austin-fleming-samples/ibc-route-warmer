import { type Option, option } from "@/modules/shared/utils/error-handling";
import type { SkipService } from ".";
import type { Chain } from "../../models";
import { registryService } from "../registry";
import { skipApi } from "./api";

export const getSupportedChains: SkipService['getSupportedChains'] =
	async ({
		includeEVM = false,
		includeTestnet = true
	}: {
		includeEVM?: boolean,
		includeTestnet?: boolean
	}): Promise<Option<Chain[]>> => {
		try {
			const chainsResponse = (await skipApi.getChains({ includeEVM, includeTestnet })).unwrapOrThrow()

			const chains: Chain[] = []
			for (const chainDTO of chainsResponse) {
				registryService.getChainById(chainDTO.chain_id).match({
					ok: (chain) => {
						chains.push(chain);
					},
					fail: (error) => {
						console.groupCollapsed(`Skipping chain ${chainDTO.chain_id}`)
						console.error("Chain not found in registry");
						console.error(error)
						console.groupEnd();
					},
				})
			}

			return option.ok(chains);
		} catch (error) {
			return option.failFromUnknown(error);
		}
	}