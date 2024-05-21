import { CONFIG } from "@/config/constants";
import { type Option, option } from "@/modules/shared/utils/error-handling";
import type { Asset as RegistryAsset, Chain as RegistryChain } from '@chain-registry/types'
import type { Asset, Chain, } from "../../models";

interface RegistryMapper {
	chainToModel: (registryChain: RegistryChain) => Option<Chain>;
	assetToModel: (registryAsset: RegistryAsset) => Option<Asset>;
}

const registryChainToChain: RegistryMapper['chainToModel'] = (registryChain: RegistryChain): Option<Chain> => {
	const isTestnet = registryChain.network_type !== "mainnet";

	const logoURI =
		registryChain.logo_URIs?.svg ||
		registryChain.logo_URIs?.png ||
		registryChain.logo_URIs?.jpeg ||
		CONFIG.CONNECTION.FALLBACK_CHAIN_URI;

	const maybeRestEndpoint = registryChain.apis?.rest?.[0]?.address;
	if (!maybeRestEndpoint) {
		return option.fail(
			new Error(`No rest endpoint found for chain ${registryChain.chain_name}`),
		);
	}

	const feeToken = registryChain.fees?.fee_tokens[0]
	if (!feeToken) {
		return option.fail(
			new Error(`No fee token found for chain ${registryChain.chain_name}`),
		);
	}

	return option.ok({
		chainId: registryChain.chain_id,
		chainName: registryChain.chain_name,
		isTestnet,
		logoURI,
		restEndpoint: maybeRestEndpoint
	});
}

const registryAssetToAsset: RegistryMapper['assetToModel'] = (registryAsset: RegistryAsset): Option<Asset> => {
	const logoURI = registryAsset.logo_URIs?.svg ||
		registryAsset.logo_URIs?.png ||
		registryAsset.logo_URIs?.jpeg ||
		CONFIG.CONNECTION.FALLBACK_ASSET_URI

	// NOTE: hacky way to cover most evm-based assets
	const exponent = registryAsset.denom_units.some((unit) => unit.exponent === 6) ? 6 : 8;

	return option.ok({
		denom: registryAsset.base,
		name: registryAsset.name,
		logoURI,
		exponent,
	});
}

export const registryMapper: RegistryMapper = {
	chainToModel: registryChainToChain,
	assetToModel: registryAssetToAsset,
}
