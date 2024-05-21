export class BaseError<T extends string> extends Error {
	public name: T;
	public message: string;
	public cause?: Error;

	constructor(
		name: T,
		message: string,
		cause?: Error
	) {
		super(message);
		this.name = name;
		this.message = message;
		this.cause = cause;
	}
}
