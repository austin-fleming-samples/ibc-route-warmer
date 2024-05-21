import { BaseError } from "."

export const printError = (error: Error) => {
	console.group("Error")
	if (error instanceof BaseError) {
		console.error(error.name)
		console.error(error.message)

		if (error.cause) {
			printError(error.cause)
		}
	} else {
		console.error(error)
	}

	console.groupEnd()
}