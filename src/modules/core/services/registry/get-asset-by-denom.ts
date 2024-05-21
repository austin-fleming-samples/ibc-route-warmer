import { type Option, option } from "@/modules/shared/utils/error-handling";
import { assets as registryAssets } from "chain-registry";
import type { Asset } from "../../models";
import { registryMapper } from "./mapper";

export const getAssetByDenom = (denom: string): Option<Asset> => {
	const maybeAsset = registryAssets
		.flatMap((list) => list.assets)
		.find((asset) => asset.base === denom);

	if (!maybeAsset) {
		return option.fail(new Error(`Asset with denom ${denom} not found in registry`));
	}

	return registryMapper.assetToModel(maybeAsset);
}