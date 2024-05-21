type Config = {
	APP: {
		TITLE: string,
		DESCRIPTION: string,
		URL: string,
		ICON: string
	},
	CONNECTION: {
		DEFAULT_CHAIN_ID: string,
		FALLBACK_CHAIN_URI: string
		FALLBACK_ASSET_URI: string
	},
	WALLET_CONNECT: {
		PROJECT_ID: string
	},
	SKIP: {
		API_URL: string,
		CLIENT_ID: string
	}
}

type FeatureFlags = {
	ALLOW_EVM_CHAINS: boolean;
	ALLOW_TESTNETS: boolean;
}

export const CONFIG: Config = {
	APP: {
		TITLE: "Route Warmer",
		DESCRIPTION: "Take home challenge from Skip Protocol by Austin Fleming",
		URL: "https://localhost:3000",
		ICON: "https://localhost:3000/favicon.ico"
	},
	CONNECTION: {
		DEFAULT_CHAIN_ID: "cosmoshub-4",
		FALLBACK_CHAIN_URI: "",
		FALLBACK_ASSET_URI: ""
	},
	WALLET_CONNECT: {
		PROJECT_ID: "3ccd4a3ee795fa812a7a0e6aa06bff3f"
	},
	SKIP: {
		API_URL: "https://api.skip.money",
		CLIENT_ID: "skip-api-docs"
	}
}

export const FEATURE_FLAGS: FeatureFlags = {
	ALLOW_EVM_CHAINS: false,
	ALLOW_TESTNETS: false
}