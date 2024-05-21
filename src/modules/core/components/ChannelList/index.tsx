import { DropDownSelect } from "../../../shared/components/DropDownSelect";
import { useTransferContext } from "../Master/state";

export const ChannelList = () => {
	const { channelPairList, channelPair, setChannelPair } = useTransferContext();

	return (
		<label className="form-control w-full max-w-xs">
			<div className="label">
				<span className="label-text">Source Channel</span>
			</div>
			<DropDownSelect
				items={channelPairList.map((pair) => ({
					label: `${pair.source.channelId} -> ${pair.counterparty.chainName}`,
					value: pair.source.channelId,
				}))}
				selected={
					channelPair && {
						label: channelPair.source.channelId,
						value: channelPair.source.channelId,
					}
				}
				setSelected={(item) => {
					setChannelPair(item.value);
				}}
				name={"channel"}
			/>
		</label>
	);
};
