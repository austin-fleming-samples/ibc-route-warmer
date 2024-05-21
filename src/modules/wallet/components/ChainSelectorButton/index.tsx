import { useWalletConnection } from "../../state/use-wallet-connection";

export const ChainSelectorButton = () => {
	const wallet = useWalletConnection();

	return (
		<div>
			<div className="dropdown dropdown-hover">
				<div tabIndex={0} role="button" className="btn m-1">
					<div className="flex flex-row gap-2">
						<img
							className="h-[1em] w-[1em]"
							src={wallet.chain.logoURI}
							alt={wallet.chain.chainName}
						/>
						<p>{wallet.chain.chainName}</p>
					</div>
				</div>

				<ul className="dropdown-content z-[1] menu p-2  gap-1 shadow bg-base-100 rounded-box w-52">
					{chainList.map((chain) => (
						<li key={chain.chainId}>
							<button
								className={`btn ${
									chain.chainId === wallet.chain.chainId
										? "btn-primary"
										: "btn-ghost"
								}`}
								type="button"
								onClick={() => wallet.setChain(chain.chainId)}
							>
								<img
									className="h-[1em] w-[1em]"
									src={chain.logoURI}
									alt={chain.chainName}
								/>
								{chain.chainName}
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
