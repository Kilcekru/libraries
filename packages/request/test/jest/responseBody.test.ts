import { PassThrough } from "stream";

import { Response } from "node-fetch";

import { request } from "../..";

import { url } from "./config";

describe("response body", () => {
	test("detect text", async () => {
		const res = await request({ url: `${url}/res/text` });
		expect(res.status).toBe(200);
		expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
		expect(res.body).toBe("Hello world");
	});

	test("detect text (xml)", async () => {
		const res = await request({ url: `${url}/res/xml` });
		expect(res.status).toBe(200);
		expect(res.headers.get("content-type")).toBe("text/xml; charset=utf-8");
		expect(res.body).toBe("<tag></tag>");
	});

	test("detect json", async () => {
		const res = await request({ url: `${url}/res/json` });
		expect(res.status).toBe(200);
		expect(res.headers.get("content-type")).toBe("application/json; charset=utf-8");
		expect(res.body).toEqual({ foo: "bar" });
	});

	test("no detection for binary data", async () => {
		const res = await request({ url: `${url}/res/binary` });
		expect(res.status).toBe(200);
		expect(res.headers.get("content-type")).toBe("application/octet-stream");
		expect(res.body).toBeUndefined();
	});

	test("force text on json response", async () => {
		const res = await request({ url: `${url}/res/json`, response: "text" });
		expect(res.status).toBe(200);
		expect(res.headers.get("content-type")).toBe("application/json; charset=utf-8");
		expect(res.body).toEqual(JSON.stringify({ foo: "bar" }));
	});

	test("ignore response", async () => {
		const res = await request({ url: `${url}/res/json`, response: false });
		expect(res.status).toBe(200);
		expect(res.headers.get("content-type")).toBe("application/json; charset=utf-8");
		expect(res.body).toBeUndefined();
	});

	test("arrayBuffer", async () => {
		const res = await request({ url: `${url}/res/text`, response: "arrayBuffer" });
		expect(res.status).toBe(200);
		expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
		expect(res.body).toBeInstanceOf(ArrayBuffer);
	});

	test("stream", async () => {
		const res = await request({ url: `${url}/res/text`, response: "stream" });
		expect(res.status).toBe(200);
		expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
		expect(res.body).toBeInstanceOf(PassThrough);
	});

	test("raw", async () => {
		const res = await request({ url: `${url}/res/text`, response: "raw" });
		expect(res.status).toBe(200);
		expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
		expect(res.body).toBeInstanceOf(Response);
	});
});
