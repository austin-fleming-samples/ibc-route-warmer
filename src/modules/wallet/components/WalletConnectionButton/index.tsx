import type { Chain } from "@/modules/core/models";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";

export const WalletConnectionButton = ({ chain }: { chain: Chain }) => {
	const { connect, disconnect, status } = useChain(chain.chainName); // TODO: abstract this

	switch (status) {
		case WalletStatus.Connected:
			return (
				<button
					className="btn btn-sm btn-outline"
					type="button"
					onClick={() => disconnect()}
				>
					Disconnect
				</button>
			);
		case WalletStatus.Disconnected:
			return (
				<button
					className="btn btn-sm"
					type="button"
					onClick={(e) => {
						e.preventDefault();
						connect();
					}}
				>
					Connect
				</button>
			);
		case WalletStatus.Connecting:
			return (
				<button className="btn btn-sm" disabled type="button">
					<span className="loading loading-spinner" />
					Connecting
				</button>
			);
		case WalletStatus.Error:
			return (
				<button type="button" className="btn btn-sm btn-error" disabled>
					Error
				</button>
			);
		case WalletStatus.NotExist:
			return (
				<button type="button" className="btn btn-sm btn-warning" disabled>
					No Wallet Found
				</button>
			);
		case WalletStatus.Rejected:
			return (
				<button type="button" className="btn btn-sm btn-warning" disabled>
					Rejected
				</button>
			);
		default:
			return <div>Unknown</div>;
	}
};
