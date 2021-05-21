import fetch from "node-fetch";
import { mocked } from "ts-jest/utils";

import { request } from "..";

import { url } from "./config";

const spyFetch = mocked(fetch);

describe("simple arguments", () => {
	test("medhod post", async () => {
		await request({ url, method: "post" });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		const options = spyFetch.mock.calls[0]?.[1];
		expect(options?.method).toBe("post");
	});

	test("medhod delete", async () => {
		await request({ url, method: "delete" });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		const options = spyFetch.mock.calls[0]?.[1];
		expect(options?.method).toBe("delete");
	});

	test("redirect manual", async () => {
		await request({ url, redirect: "manual" });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		const options = spyFetch.mock.calls[0]?.[1];
		expect(options?.redirect).toBe("manual");
	});

	test("redirect error", async () => {
		await request({ url, redirect: "error" });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		const options = spyFetch.mock.calls[0]?.[1];
		expect(options?.redirect).toBe("error");
	});
});
