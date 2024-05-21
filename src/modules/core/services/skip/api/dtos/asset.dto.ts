export type AssetDTO = {
	denom: string
	chain_id: string
	origin_denom: string
	origin_chain_id: string
	trace: string
	is_cw20: boolean
	is_evm: boolean
	symbol: string
	name: string
	logo_uri: string
	decimals: number
	description: string
	coingecko_id: string
	recommended_symbol: string
}

