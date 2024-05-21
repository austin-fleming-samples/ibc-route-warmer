import { errorOrUnknown } from ".";

type OptionMatchPattern<T, E, U, F = U> = { ok: (value: T) => U; fail: (failValue: E) => F };

export interface Option<T, E = Error> {
	isOk: () => this is Ok<T, E>
	isFail: () => this is Fail<T, E>
	unwrap: () => T;
	unwrapFail: () => E;
	unwrapOrThrow: () => T;
	match: <U, F>(matchPattern: OptionMatchPattern<T, E, U, F>) => U | F;
	mapOk: <U>(fn: (value: T) => U) => Option<U, E>;
	chainOk: <U>(fn: (value: T) => Option<U, E>) => Option<U, E>;
	clone: () => Option<T, E>;
	effect: (sideEffect: (value: Option<T, E>) => void) => Option<T, E>;
}

class Fail<E, T = never> implements Option<T, E> {
	private readonly _failValue: E;

	constructor(failValue: E) {
		this._failValue = failValue;
	}

	isOk(): this is Ok<T, E> {
		return false;
	}
	isFail(): this is Fail<T, E> {
		return true;
	}
	unwrap(): T {
		throw new ReferenceError(
			"Cannot unwrap the value of an error option.",
		);
	}
	unwrapFail(): E {
		return this._failValue;
	}
	unwrapOrThrow(): T {
		throw this._failValue;
	}
	match<U, F>(matchPattern: OptionMatchPattern<T, E, U, F>): U | F {
		return matchPattern.fail(this._failValue);
	}
	mapOk<U>(_: (value: T) => U): Option<U, E> {
		return this as unknown as Option<U, E>;
	}
	chainOk<U>(_: (value: T) => Option<U, E>): Option<U, E> {
		return this as unknown as Option<U, E>;
	}
	clone(): Option<T, E> {
		return new Fail(this._failValue);
	}
	effect(sideEffect: (value: Option<T, E>) => void): Option<T, E> {
		sideEffect(this.clone());
		return this;
	}
}

class Ok<T, E = never> implements Option<T, E> {
	private readonly _value: T;

	constructor(value: T) {
		this._value = value;
	}

	isOk(): this is Ok<T, E> {
		return true;
	}
	isFail(): this is Fail<T, E> {
		return false;
	}
	unwrap(): T {
		return this._value;
	}
	unwrapFail(): E {
		throw new ReferenceError(
			"Cannot unwrap the error of an ok result.",
		);
	}
	unwrapOrThrow(): T {
		return this._value;
	}
	match<U, F>(matchPattern: OptionMatchPattern<T, E, U, F>): U | F {
		return matchPattern.ok(this._value);
	}
	mapOk<U>(fn: (value: T) => U): Option<U, E> {
		return new Ok(fn(this._value));
	}
	chainOk<U>(fn: (value: T) => Option<U, E>): Option<U, E> {
		return fn(this._value);
	}
	clone(): Option<T, E> {
		return new Ok(this._value);
	}
	effect(sideEffect: (value: Option<T, E>) => void): Option<T, E> {
		sideEffect(this.clone());
		return this;
	}
}

export const option = {
	ok: <T, E = never>(value: T): Option<T, E> =>
		new Ok(value),
	fail: <E, T = never>(failValue: E): Option<T, E> =>
		new Fail(failValue),
	failFromUnknown: <E = Error, T = never>(value: unknown): Option<T, E> => new Fail(errorOrUnknown(value) as E),
	failWithReason: <E, T = never>(message: string): Option<T, E> =>
		new Fail(new Error(message) as E),
};