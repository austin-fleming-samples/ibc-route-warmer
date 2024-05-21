import type BigNumber from "bignumber.js";

export const sortByBigNumber = <T>(key: keyof T) => (a: T, b: T): number => {
	const aBigNumber = a[key] as unknown as BigNumber;
	const bBigNumber = b[key] as unknown as BigNumber;
	return bBigNumber.minus(aBigNumber).toNumber();
}