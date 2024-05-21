/**
 * Errors from TryCatch are not always Error,
 * so this function provides a convenience for converting.
 */

export const errorOrUnknown = (maybeError: Error | unknown): Error =>
	maybeError instanceof Error
		? maybeError
		: new Error(`Unexpected error: ${maybeError}`);
