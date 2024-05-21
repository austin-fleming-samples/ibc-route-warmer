export const capitalizeFirstLetter = (string: string) => {
	const preparedString = string.trim().toLowerCase()
	return preparedString.charAt(0).toUpperCase() + preparedString.slice(1);
}