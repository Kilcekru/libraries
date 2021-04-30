import { createRequestObj } from "./core";

const AbortController = window.AbortController;
export { AbortController };

export const createRequest = (defaultOptions) =>
	createRequestObj({
		fetch: window.fetch,
		AbortController,
		defaultOptions,
	});

const req = createRequest();
export const request = req.request;
export const setDefaultOptions = req.setDefaultOptions;
