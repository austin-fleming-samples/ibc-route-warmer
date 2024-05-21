import { type Option, option } from "@/modules/shared/utils/error-handling";
import { assets as registryAssets } from "chain-registry";
import type { RegistryService } from ".";
import type { Asset } from "../../models";
import { registryMapper } from "./mapper";

export const getAssetsByChainName: RegistryService['getAssetsByChainName'] = (chainName: string): Option<Asset[]> => {
	const maybeAssets = registryAssets.find(
		(list) => list.chain_name === chainName,
	);
	if (!maybeAssets) {
		return option.fail(new Error(`No assets found for chain ${chainName}`));
	}

	const assets: Asset[] = [];
	for (const registryAsset of maybeAssets.assets) {
		registryMapper
			.assetToModel(registryAsset)
			.match({
				ok: (asset) => assets.push(asset),
				fail: (error) => console.warn(error),
			});
	}

	return option.ok(assets);
};