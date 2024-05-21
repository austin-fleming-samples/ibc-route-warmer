import { useTransferContext } from "../Master/state";

export const TransferForm = () => {
	const { chain, chainList, setChain, asset, assetList, setAsset } =
		useTransferContext();
};
