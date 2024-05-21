import type { Channel } from "./channel"

export type ChannelPair = {
	source: Channel,
	counterparty: Channel
}