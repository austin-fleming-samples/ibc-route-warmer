import type { BigNumber } from 'bignumber.js'
import type { Asset } from './asset'

export type AssetBalance = {
	asset: Asset,
	actualAmount: BigNumber,
	displayAmount: string
}