import { createRequestObj } from "./core";

const AbortController = window.AbortController;
const AbortSignal = window.AbortSignal;

export { AbortController, AbortSignal };
export { ResponseError, TimeoutError, AbortError, FetchError } from "./core/errors";

export const createRequest = (defaultOptions) =>
	createRequestObj({
		fetch: window.fetch,
		AbortController,
		defaultOptions,
	});

const req = createRequest();
export const request = req.request;
export const setDefaultOptions = req.setDefaultOptions;
