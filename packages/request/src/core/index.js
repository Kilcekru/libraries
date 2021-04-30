import { ResponseError, TimeoutError } from "./errors";
import { parseBody, getOptions, checkRetry, sleep } from "./utils";

export const createRequestObj = ({ fetch, AbortController, defaultAgent, defaultOptions }) => {
	let defaultRequestOptions = defaultOptions;

	const execFetch = async (options) => {
		let abortReason;
		const timeouts = {};
		try {
			const abortController = new AbortController();
			const abort = (reason) => {
				abortReason = reason;
				abortController.abort();
			};
			options.signal?.addEventListener("abort", () => abort());
			timeouts.total = setTimeout(() => abort("total"), options.timeout.total);
			if (options.timeout.headers != undefined) {
				timeouts.headers = setTimeout(() => abort("headers"), options.timeout.headers);
			}
			const res = await fetch(options.url, {
				method: options.method,
				headers: options.headers,
				body: options.body,
				redirect: options.redirect,
				signal: abortController.signal,
				mode: options.mode,
				credentials: options.credentials,
				agent: options.agent === false ? undefined : options.agent == undefined ? defaultAgent : options.agent,
			});

			if (timeouts.headers) {
				clearTimeout(timeouts.headers);
			}
			if (options.timeout.body) {
				timeouts.body = setTimeout(() => abort("body"), options.timeout.body);
			}

			if (!res.ok) {
				throw new ResponseError({
					message: `Response not ok`,
					status: res.status,
				});
			}

			const body = await parseBody(res, options.parse);

			if (timeouts.body) {
				clearTimeout(timeouts.body);
			}
			clearTimeout(timeouts.total);
			options.signal?.removeEventListener("abort", abortController.abort);
			return {
				status: res.status,
				headers: res.headers,
				body,
			};
		} catch (err) {
			for (const timeout of Object.values(timeouts)) {
				clearTimeout(timeout);
			}
			if (abortReason && err.name === "AbortError") {
				throw new TimeoutError({
					message: "The request timed out",
					reason: abortReason,
				});
			}
			throw err;
		}
	};

	const request = async (requestOptions) => {
		const options = getOptions(requestOptions, defaultRequestOptions);
		// request body
		const headers = options.headers ? { ...options.headers } : {};
		let reqBody;
		if (options.body != undefined) {
			if (typeof options.body === "string") {
				reqBody = options.body;
			} else {
				reqBody = JSON.stringify(options.body);
				if (!headers["Content-Type"]) {
					headers["Content-Type"] = "application/json";
				}
			}
		}

		let attempt = 0;
		for (;;) {
			try {
				const res = await execFetch({
					...options,
					headers: headers,
					body: reqBody,
				});

				return res;
			} catch (err) {
				const delay = checkRetry(++attempt, err, options.retry);
				if (delay === false) {
					throw err;
				} else {
					await sleep(delay);
				}
			}
		}
	};

	const setDefaultOptions = (requestOptions) => {
		defaultRequestOptions = requestOptions;
	};

	return {
		request,
		setDefaultOptions,
	};
};
