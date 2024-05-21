import type { ChangeEvent } from "react";

const formatInputValue = (value: string) => {
	let formattedValue = value;

	if (value.match(/^[.,]/)) {
		formattedValue = `0.${formattedValue}`;
	}
	formattedValue = formattedValue.replace(/^[0]{2,}/, "0");
	formattedValue = formattedValue.replace(/[^\d.,]/g, "");
	formattedValue = formattedValue.replace(/[.]{2,}/g, ".");
	formattedValue = formattedValue.replace(/[,]{2,}/g, ",");

	return Number(formattedValue);
};

export const NumericInput = ({
	onChange,
	value,
}: {
	onChange: (value: string) => unknown;
	value: string;
}) => {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		onChange(formatInputValue(event.target.value).toString());
	};

	return (
		<input
			type="text"
			inputMode="numeric"
			pattern="[0-9]*"
			value={value}
			className="w-full max-w-xs input input-bordered"
			onChange={handleChange}
		/>
	);
};
