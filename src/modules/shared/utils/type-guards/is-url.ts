export const isUrl = (value: unknown): value is string => {
	return typeof value === 'string' && /^https?:\/\//.test(value);
}