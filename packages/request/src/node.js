import * as http from "http";
import * as https from "https";

import { AbortController } from "abort-controller";
import fetch from "node-fetch";

import { createRequestObj } from "./core";

export { AbortController };

const httpAgent = new http.Agent({
	keepAlive: true,
});
const httpsAgent = new https.Agent({
	keepAlive: true,
});

export const createRequest = (defaultOptions) =>
	createRequestObj({
		fetch,
		AbortController,
		defaultAgent: (url) => (url.protocol === "http:" ? httpAgent : httpsAgent),
		defaultOptions,
	});

const req = createRequest();
export const request = req.request;
export const setDefaultOptions = req.setDefaultOptions;
