import { DropDownSelect } from "../../../shared/components/DropDownSelect";
import { useTransferContext } from "../Master/state";

export const ChainList = () => {
	const { chainList, chain, setChain } = useTransferContext();

	return (
		<label className="form-control w-full max-w-xs">
			<div className="label">
				<span className="label-text">Source Chain</span>
			</div>
			<DropDownSelect
				items={chainList.map(({ chainName, chainId, logoURI }) => ({
					label: chainId,
					value: chainId,
					icon: logoURI,
				}))}
				selected={
					chain && {
						label: chain.chainId,
						value: chain.chainId,
						icon: chain.logoURI,
					}
				}
				setSelected={(item) => {
					setChain(item.value);
				}}
				name={"chain"}
			/>
		</label>
	);
};
