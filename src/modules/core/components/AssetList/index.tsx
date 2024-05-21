import { DropDownSelect } from "../../../shared/components/DropDownSelect";
import { useTransferContext } from "../Master/state";

export const AssetList = () => {
	const { assetList, asset, setAsset } = useTransferContext();

	return (
		<label className="form-control w-full max-w-xs">
			<div className="label">
				<span className="label-text">Source Asset</span>
			</div>

			<DropDownSelect
				items={assetList.map((asset) => ({
					label: asset.name,
					value: asset.denom,
					icon: asset.logoURI,
				}))}
				selected={
					asset && {
						label: asset.name,
						value: asset.denom,
						icon: asset.logoURI,
					}
				}
				setSelected={(item) => {
					setAsset(item.value);
				}}
				name={"asset"}
			/>
		</label>
	);
};
