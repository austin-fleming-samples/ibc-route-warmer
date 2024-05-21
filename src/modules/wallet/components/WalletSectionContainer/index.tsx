import type { ReactNode } from "react";
import { useWalletConnection } from "../../state/use-wallet-connection";

const Toolbar = ({ children }: { children: ReactNode }) => (
	<div>{children}</div>
);

const BaseButton = ({
	children,
	onClick,
	classes,
	disabled = false,
}: {
	children: ReactNode;
	onClick?: () => void;
	classes?: string;
	disabled?: boolean;
}) => {
	return (
		<button
			className={`btn btn-sm${classes ? ` ${classes}` : ""}`}
			type="button"
			onClick={(e) => {
				e.preventDefault();

				if (onClick) {
					onClick();
				}
			}}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

const WalletConnectionButton = () => {
	const wallet = useWalletConnection();

	switch (wallet.status) {
		case "CONNECTED":
			return (
				<BaseButton classes="btn-outline" onClick={() => wallet.disconnect()}>
					Disconnect
				</BaseButton>
			);
		case "DISCONNECTED":
			return <BaseButton onClick={() => wallet.connect()}>Connect</BaseButton>;
		case "CONNECTING":
			return (
				<BaseButton disabled>
					<span className="loading loading-spinner" />
					Connecting
				</BaseButton>
			);
		default:
			return (
				<BaseButton classes="btn-error" disabled>
					Error
				</BaseButton>
			);
	}
};

const WalletSectionContainer = () => {
	const wallet = useWalletConnection();

	return (
		<Toolbar>
			{wallet.chain.chainName}
			<WalletConnectionButton />
		</Toolbar>
	);
};
