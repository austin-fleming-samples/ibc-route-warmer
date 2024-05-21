import { LogoIcon } from "@/modules/shared/components/LogoIcon";
import { truncate } from "@/modules/shared/utils/string-formatting";
import { useEffect, useState } from "react";
import type { AssetBalance } from "../../models/asset-balance";
import { skipService } from "../../services/skip";
import { useTransferContext } from "../Master/state";

export const AssetBalancesList = () => {
	const { chain, sender } = useTransferContext();
	const [assetBalances, setAssetBalances] = useState<AssetBalance[]>([]);

	useEffect(() => {
		if (!sender || !chain) {
			setAssetBalances([]);
			return;
		}

		skipService
			.getSupportedAssetBalances({
				restEndpoints: chain.restEndpoint,
				chainId: chain.chainId,
				address: sender,
			})
			.then((result) => {
				result.match({
					ok: (balances) => {
						setAssetBalances(balances);
					},
					fail: (error) => {
						console.error(error);
					},
				});
			});
	}, [sender, chain]);

	return (
		<div className="card w-96 bg-base-200 p-4 shadow-xl">
			{assetBalances.map(({ asset, displayAmount }) => (
				<div
					key={asset.denom}
					className="flex flex-row justify-between items-center p-4"
				>
					<div className="flex flex-row justify-center items-center gap-2">
						<LogoIcon src={asset.logoURI} alt={asset.name} />
						<div className="flex flex-col">
							<p>{asset.name}</p>
							<p className=" text-xs">{truncate(asset.denom, 12)}</p>
						</div>
					</div>
					<p>{displayAmount}</p>
				</div>
			))}
		</div>
	);
};
