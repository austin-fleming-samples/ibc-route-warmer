import { errorOrUnknown } from "@/modules/shared/utils/error-handling";
import { isUrl } from "@/modules/shared/utils/type-guards";
import fetch from "isomorphic-unfetch";
import type { NextApiHandler, } from "next";

/* 
NOTE:
Some of the provided public API endpoints for chains have CORS policies unfriendly to the frontend.
Using this route as a proxy is a work-around to avoid filling the console with CORS errors. 
*/

type SuccessResponse = unknown

type ErrorResponse = {
	error: string;
}

const CorsProxy: NextApiHandler<SuccessResponse | ErrorResponse> = async (req, res) => {
	const { url } = req.query;
	if (!isUrl(url)) {
		res.status(400).send({ error: "Invalid URL" });
		return;
	}

	const method = req.method ? req.method : "GET";

	try {
		const resProxy = await fetch(url, { method });
		console.dir(resProxy)
		if (!resProxy.ok) {
			throw new Error(`Failed to fetch data: ${resProxy.statusText}`);
		}

		const data = await resProxy.json();
		res.status(200).json(data);
	} catch (error) {
		res.status(400).send({ error: errorOrUnknown(error).toString() });
	}
};

export default CorsProxy;