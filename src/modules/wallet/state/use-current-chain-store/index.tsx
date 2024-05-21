import { CONFIG } from "@/config/constants";
import type { Chain } from "@/modules/core/models";
import { registryService } from "@/modules/core/services/registry";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
	currentChain: Chain;
	setCurrentChain: (chain: Chain) => void;
};

export const useCurrentChainStore = create(
	persist<State>(
		(set) => ({
			currentChain: registryService
				.getChainById(CONFIG.CONNECTION.DEFAULT_CHAIN_ID)
				.unwrapOrThrow(),
			setCurrentChain: (chain: Chain) => set({ currentChain: chain }),
		}),
		{
			name: "current-chain",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
