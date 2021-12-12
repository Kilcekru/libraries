import fetch from "node-fetch";
import { mocked } from "ts-jest/utils";

import { request } from "../..";

import { urlReflect } from "./config";

const spyFetch = mocked(fetch);

describe("payload", () => {
	test("custom headers", async () => {
		const headers = { "x-foo": "bar", "x-bar": "foo" };
		const res = await request({ url: urlReflect, headers: headers });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		const options = spyFetch.mock.calls[0]?.[1];
		expect(options?.headers).toEqual(headers);
		expect(res.body).toEqual(expect.objectContaining({ method: "GET", headers: expect.objectContaining(headers) as unknown }));
	});

	test("post - string", async () => {
		const body = "hello world";
		const res = await request({ url: urlReflect, method: "post", headers: { "content-type": "text/plain" }, body });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		const options = spyFetch.mock.calls[0]?.[1];
		expect(options?.body).toBe(body);
		expect(options?.headers).toEqual({ "content-type": "text/plain" });
		expect(res.body).toEqual(
			expect.objectContaining({
				method: "POST",
				headers: expect.objectContaining({ "content-type": "text/plain" }) as unknown,
				body,
			})
		);
	});

	test("post - object", async () => {
		const body = { foo: "bar" };
		const res = await request({ url: urlReflect, method: "post", body });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		const options = spyFetch.mock.calls[0]?.[1];
		expect(options?.body).toBe(JSON.stringify(body));
		expect(options?.headers).toEqual({ "content-type": "application/json" });
		expect(res.body).toEqual(
			expect.objectContaining({
				method: "POST",
				headers: expect.objectContaining({ "content-type": "application/json" }) as unknown,
				body,
			})
		);
	});

	test("post - array", async () => {
		const body = ["foo", "bar"];
		const res = await request({ url: urlReflect, method: "post", body });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		const options = spyFetch.mock.calls[0]?.[1];
		expect(options?.body).toBe(JSON.stringify(body));
		expect(options?.headers).toEqual({ "content-type": "application/json" });
		expect(res.body).toEqual(
			expect.objectContaining({
				method: "POST",
				headers: expect.objectContaining({ "content-type": "application/json" }) as unknown,
				body,
			})
		);
	});

	test("post - custom content-type", async () => {
		const body = { foo: "bar" };
		const res = await request({ url: urlReflect, method: "post", headers: { "content-type": "text/plain" }, body });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		const options = spyFetch.mock.calls[0]?.[1];
		expect(options?.body).toBe(JSON.stringify(body));
		expect(options?.headers).toEqual({ "content-type": "text/plain" });
		expect(res.body).toEqual(
			expect.objectContaining({
				method: "POST",
				headers: expect.objectContaining({ "content-type": "text/plain" }) as unknown,
				body: JSON.stringify(body),
			})
		);
	});

	test("post - custom headers", async () => {
		const headers = { "x-foo": "bar", "x-bar": "foo" };
		const body = { foo: "bar" };
		const res = await request({ url: urlReflect, method: "post", headers, body });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		const options = spyFetch.mock.calls[0]?.[1];
		expect(options?.body).toBe(JSON.stringify(body));
		expect(options?.headers).toEqual({ "content-type": "application/json", "x-foo": "bar", "x-bar": "foo" });
		expect(res.body).toEqual(
			expect.objectContaining({
				method: "POST",
				headers: expect.objectContaining({
					"content-type": "application/json",
					"x-foo": "bar",
					"x-bar": "foo",
				}) as unknown,
				body,
			})
		);
	});
});
