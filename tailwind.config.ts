import daisyUI from "daisyui";
import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	plugins: [daisyUI],
};
export default config;
