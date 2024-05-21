import { type Option, option } from "@/modules/shared/utils/error-handling";
import { chains as registryChains } from "chain-registry";
import type { RegistryService } from ".";
import type { Chain } from "../../models";
import { registryMapper } from "./mapper";

export const getChainById: RegistryService['getChainById'] = (chainId: string): Option<Chain> => {
	const maybeChain = registryChains.find(
		(chain) => chain.chain_id === chainId,
	);
	if (!maybeChain) {
		return option.fail(
			new Error(`Chain with id ${chainId} not found in registry`),
		);
	}

	return registryMapper.chainToModel(maybeChain);
};