import { ResponseError } from "./errors";

function getUrl(url) {
	if (typeof url === "string") {
		return url;
	} else {
		return url.href;
	}
}

export async function parseBody(res, parse) {
	if (parse == undefined || parse === "detect") {
		const contentType = res.headers.get("content-type")?.split(";")[0];
		if (contentType === "application/json") {
			parse = "json";
		} else if (contentType?.startsWith("text/")) {
			parse = "text";
		}
	}
	switch (parse) {
		case "arrayBuffer": {
			return await res.arrayBuffer();
		}
		case "json": {
			return await res.json();
		}
		case "blob": {
			return await res.blob();
		}
		case "text": {
			return await res.text();
		}
		case "stream": {
			return res.body;
		}
	}
}

export function getOptions(requestOptions, defaultOptions) {
	let options;
	if (typeof requestOptions === "string") {
		options = {
			...defaultOptions,
			url: requestOptions,
		};
	} else {
		options = { ...defaultOptions, ...requestOptions };
	}
	const timeout =
		!options.timeout || typeof options.timeout === "number"
			? {
					total: options.timeout ?? 10000,
			  }
			: options.timeout;
	const retry =
		options.retry != undefined
			? typeof options.retry === "number" || typeof options.retry === "function"
				? {
						attempts: options.retry,
				  }
				: options.retry
			: undefined;

	return {
		...options,
		url: getUrl(options.url),
		timeout,
		retry,
	};
}

export function checkRetry(attempt, err, options) {
	// no retry config
	if (options == undefined || options.attempts == undefined) {
		return false;
	}
	// number of retries
	if (typeof options.attempts === "number") {
		if (attempt > options.attempts) {
			return false;
		}
		// do not retry status codes < 500
		if (err instanceof ResponseError && err.status < 500) {
			return false;
		}
	}
	// should retry function
	if (typeof options.attempts === "function") {
		const res = options(attempt, err);
		if (res !== true) {
			return res;
		}
	}

	// should retry, find out delay
	// delay time
	if (typeof options.delay === "number") {
		return options.delay;
	}
	// delay function
	if (typeof options.delay === "function") {
		return options.delay(attempt, err);
	}
	// default delay
	return Math.min(500 * 2 ** (attempt - 1), 30000);
}

export function sleep(time) {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
}
