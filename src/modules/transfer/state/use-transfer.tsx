import type { Asset, ChannelPair } from "@/modules/core/models";

type State = {
	assets: Asset[];
	channelPairs: ChannelPair[];
	receiverAddress: string;
	transferAmount: string;
};

type OtherState = {
	asset: Asset;
	channelPair: ChannelPair;
	receiverAddress: string;
	transferAmount: string;
};
