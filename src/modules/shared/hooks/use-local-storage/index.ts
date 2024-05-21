
import { useState } from "react";

type Props = {
	key: string;
}

const getStoredValue = <T>(key: string): T | undefined => {
	try {
		const storedValue = localStorage.getItem(key);
		if (storedValue) {
			return JSON.parse(storedValue);
		}
		return;
	} catch (err) {
		console.error(err);
		return;
	}
}

const setStoredValue = <T>(key: string, value: T) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (err) {
		console.error(err);
	}
}

export const useLocalStorage = <T>({ key }: Props) => {
	const [value, setValue] = useState<T | undefined>(() => getStoredValue<T>(key));

	const set = (newValue: T) => {
		setStoredValue(key, newValue);
		setValue(newValue);
	}

	return [value, set] as const;
}