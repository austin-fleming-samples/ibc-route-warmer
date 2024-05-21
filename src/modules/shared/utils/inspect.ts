export const inspect = <T>(value: T): T => {
	console.group("Inspect");
	console.log(value);
	console.groupEnd();
	return value;
}

export const makeInspect = (label: string) => <T>(value: T): T => {
	console.group(`Inspect | ${label}`);
	console.log(value);
	console.groupEnd();
	return value;
}