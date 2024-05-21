import { type Option, option } from "@/modules/shared/utils/error-handling"
import { ibc } from "chain-registry"
import type { Chain, ChannelPair } from "../../models"
import { getChainByName } from "./get-chain-by-name"


const sortChannels = (channels: ChannelPair[]): ChannelPair[] => {
	return channels.sort((a, b) => {
		const sourceChannelNumber = Number.parseInt(a.source.channelId.split('-')[1])
		const counterpartyChannelNumber = Number.parseInt(b.source.channelId.split('-')[1])

		if (sourceChannelNumber < counterpartyChannelNumber) return -1
		if (sourceChannelNumber > counterpartyChannelNumber) return 1
		return 0
	})

}

export const getChannelPairsByChain = (sourceChain: Chain): Option<ChannelPair[]> => {
	try {
		/* 
		NOTE:
		There's better ways to do this, but using a hash table to avoid repetitive chain lookups
		while building the channel pairs.
		*/
		const chainLookupTable: Record<string, Chain> = {
			[sourceChain.chainName]: sourceChain
		}

		const channelPairs = ibc
			.filter(info =>
				info.chain_1.chain_name === sourceChain.chainName || info.chain_2.chain_name === sourceChain.chainName
			)
			.reduce((acc, info) => {
				const source = getChainByName(info.chain_1.chain_name).unwrapOrThrow()
				const counterparty = getChainByName(info.chain_2.chain_name).unwrapOrThrow()

				const pairs: ChannelPair[] = info.channels.map(channelInfo => {
					if (source.chainName === sourceChain.chainName) {
						return {
							source: {
								chainId: source.chainId,
								chainName: source.chainName,
								channelId: channelInfo.chain_1.channel_id,
								portId: channelInfo.chain_1.port_id
							},
							counterparty: {
								chainId: counterparty.chainId,
								chainName: counterparty.chainName,
								channelId: channelInfo.chain_2.channel_id,
								portId: channelInfo.chain_2.port_id
							}
						}
					}

					return {
						source: {
							chainId: counterparty.chainId,
							chainName: counterparty.chainName,
							channelId: channelInfo.chain_2.channel_id,
							portId: channelInfo.chain_2.port_id
						},
						counterparty: {
							chainId: source.chainId,
							chainName: source.chainName,
							channelId: channelInfo.chain_1.channel_id,
							portId: channelInfo.chain_1.port_id
						}
					}
				})

				return acc.concat(pairs)
			}, [] as ChannelPair[])

		sortChannels(channelPairs)

		return option.ok(channelPairs)
	} catch (error) {
		return option.failFromUnknown(error)
	}
}