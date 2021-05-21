import { URL } from "url";

import fetch from "node-fetch";
import { mocked } from "ts-jest/utils";

import { request, ResponseError, FetchError, setDefaultOptions, DefaultOptions, AbortSignal } from "..";

import { url, urlError, urlStatus } from "./config";

const spyFetch = mocked(fetch);

describe("basic", () => {
	test("simple get", async () => {
		const res = await request(url);
		expect(spyFetch).toHaveBeenCalledTimes(1);
		expect(spyFetch.mock.calls[0]?.[0]).toBe(url);
		expect(res.status).toBe(200);
	});

	test("simple get - requestOptions", async () => {
		const res = await request({ url });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		expect(spyFetch.mock.calls[0]?.[0]).toBe(url);
		expect(res.status).toBe(200);
	});

	test("default fetch args", async () => {
		await request(url);
		expect(spyFetch).toHaveBeenCalledTimes(1);
		const options = spyFetch.mock.calls[0]?.[1];
		expect(options).toBeDefined();
		expect(options?.method).toBeUndefined();
		expect(options?.headers).toEqual({});
		expect(options?.body).toBeUndefined();
		expect(options?.redirect).toBeUndefined();
		expect(options?.signal).toBeInstanceOf(AbortSignal);
		expect(typeof options?.agent).toBe("function");
		expect(options?.compress).toBeUndefined();
		expect(options?.follow).toBeUndefined();
		expect(options?.size).toBeUndefined();
		expect(options?.timeout).toBeUndefined();
	});

	test("node url object", async () => {
		const res = await request({ url: new URL(url) });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		expect(spyFetch.mock.calls[0]?.[0]).toBe(`${url}/`); // URL sets ending / if there is no path
		expect(res.status).toBe(200);
	});

	test("custom url object", async () => {
		const res = await request({ url: { href: url } });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		expect(spyFetch.mock.calls[0]?.[0]).toBe(url);
		expect(res.status).toBe(200);
	});

	test("throw on fetch error", async () => {
		expect.assertions(4);
		try {
			await request(urlError);
		} catch (err) {
			expect(err).toBeInstanceOf(FetchError);
			expect((err as FetchError).type).toBe("system");
			expect((err as FetchError).errno).toBe("ECONNRESET");
			expect((err as FetchError).code).toBe("ECONNRESET");
		}
	});

	test("throw on 404", async () => {
		expect.assertions(4);
		try {
			await request(urlStatus(404));
		} catch (err) {
			expect(err).toBeInstanceOf(ResponseError);
			expect((err as ResponseError).status).toBe(404);
			expect((err as ResponseError)[Symbol.toStringTag]).toBe("ResponseError");
			expect((err as ResponseError).toJSON()).toEqual({
				message: "Response not ok",
				name: "ResponseError",
				status: 404,
				body: { status: 404 },
			});
		}
	});

	test("throw on 500", async () => {
		expect.assertions(4);
		try {
			await request(urlStatus(500));
		} catch (err) {
			expect(err).toBeInstanceOf(ResponseError);
			expect((err as ResponseError).status).toBe(500);
			expect((err as ResponseError)[Symbol.toStringTag]).toBe("ResponseError");
			expect((err as ResponseError).toJSON()).toEqual({
				message: "Response not ok",
				name: "ResponseError",
				status: 500,
				body: { status: 500 },
			});
		}
	});

	test("default options", async () => {
		const options: DefaultOptions = {
			method: "post",
			headers: { foo: "bar" },
			body: "test body",
		};
		setDefaultOptions(options);
		await request(url);
		expect(spyFetch).toHaveBeenCalledTimes(1);
		expect(spyFetch.mock.calls[0]?.[0]).toBe(url);
		const fetchOptions = spyFetch.mock.calls[0]?.[1];
		expect(fetchOptions).toBeDefined();
		expect(fetchOptions?.method).toBe(options.method);
		expect(fetchOptions?.headers).toEqual(options.headers);
		expect(fetchOptions?.body).toBe(options.body);
	});
});
