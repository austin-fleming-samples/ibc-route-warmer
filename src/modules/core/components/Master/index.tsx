import { AmountInput } from "@/modules/core/components/AmountInput";
import { AssetBalancesList } from "@/modules/core/components/AssetBalancesList";
import { AssetList } from "@/modules/core/components/AssetList";
import { ChainList } from "@/modules/core/components/ChainList";
import { ChannelList } from "@/modules/core/components/ChannelList";
import { LogoIcon } from "@/modules/shared/components/LogoIcon";
import { truncateAddress } from "@/modules/shared/utils/string-formatting";
import { isString } from "@/modules/shared/utils/type-guards";
import { WalletConnectionButton } from "@/modules/wallet/components/WalletConnectionButton";
import { useChain } from "@cosmos-kit/react";
import { useState } from "react";
import { TransferProvider, useTransferContext } from "./state";

const ChainSelector = () => {
	const { chainList, setChain, chain } = useTransferContext();
	const [error, setError] = useState<Error | null>(null);

	return (
		<div>
			{error && <div className="alert alert-error">{error.message}</div>}
			<div className="dropdown dropdown-hover">
				<div tabIndex={0} role="button" className="btn m-1">
					<div className="flex flex-row gap-2">
						<img
							className="h-[1em] w-[1em]"
							src={chain.logoURI}
							alt={chain.chainName}
						/>
						<p>{chain.chainName}</p>
					</div>
				</div>
				<ul className="dropdown-content z-[1] menu p-2  gap-1 shadow bg-base-100 rounded-box w-52">
					{chainList.map(({ chainId, chainName, logoURI }) => (
						<li key={chainId}>
							<button
								className={`btn ${
									chain.chainId === chainId ? "btn-primary" : "btn-ghost"
								}`}
								type="button"
								onClick={() => setChain(chainId)}
							>
								<img
									className="h-[1em] w-[1em]"
									src={logoURI}
									alt={chainName}
								/>
								{chainName}
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

const WalletConnectionSection = () => {
	const { chain } = useTransferContext();
	const { address, wallet } = useChain(chain.chainName);

	return (
		<div className="w-full flex flex-row justify-end items-center gap-4 p-4 border-b-2">
			{address && (
				<div className="flex flex-row justify-center leading-none gap-2">
					{wallet?.logo && (
						<LogoIcon
							src={isString(wallet.logo) ? wallet.logo : wallet.logo.minor}
							alt={wallet.name || ""}
						/>
					)}
					<p>{truncateAddress(address)}</p>
				</div>
			)}
			<ChainSelector />
			<WalletConnectionButton chain={chain} />
		</div>
	);
};

const CurrentState = () => {
	const ctx = useTransferContext();

	return (
		<div className="card w-96 bg-base-200 p-4 shadow-xl">
			<div>
				<h2>Chain</h2>
				<pre>{JSON.stringify(ctx.chain, null, 2)}</pre>
			</div>

			<div>
				<h2>Asset</h2>
				<pre>{JSON.stringify(ctx.asset, null, 2)}</pre>
			</div>

			<div>
				<h2>Amount</h2>
				<pre>{JSON.stringify(ctx.amount, null, 2)}</pre>
			</div>

			<div>
				<h2>Channel</h2>
				<pre>{JSON.stringify(ctx.channelPair, null, 2)}</pre>
			</div>

			<div>
				<h2>Sender</h2>
				<pre>{JSON.stringify(ctx.sender, null, 2)}</pre>
			</div>

			<div>
				<h2>Receiver</h2>
				<pre>{JSON.stringify(ctx.receiver, null, 2)}</pre>
			</div>

			<div>
				<h2>Derive Tx</h2>
				<pre>{JSON.stringify(ctx.derivedAminoMessage, null, 2)}</pre>
			</div>
		</div>
	);
};

const InnerComponent = () => {
	const { chain, derivedAminoMessage, simulateTransfer, signAndBroadcast } =
		useTransferContext();
	const { address } = useChain(chain.chainName);

	return (
		<div>
			<WalletConnectionSection />

			<div className="flex flex-row gap-4">
				<div className="flex flex-col gap-4">
					<ChainList />
					<AssetList />
					<AmountInput />
					<ChannelList />
					{derivedAminoMessage && (
						<button
							className="btn btn-primary"
							type="button"
							onClick={(e) => {
								e.preventDefault();
								simulateTransfer();
							}}
						>
							Simulate Transfer
						</button>
					)}
					{derivedAminoMessage && (
						<button
							className="btn btn-primary"
							type="button"
							onClick={(e) => {
								e.preventDefault();
								signAndBroadcast();
							}}
						>
							Sign and Broadcast
						</button>
					)}
				</div>

				{address && <AssetBalancesList />}

				<CurrentState />
			</div>
		</div>
	);
};

export const MasterComponent = () => {
	return (
		<TransferProvider>
			<InnerComponent />
		</TransferProvider>
	);
};
