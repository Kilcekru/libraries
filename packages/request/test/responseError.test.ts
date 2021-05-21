import { request, ResponseError } from "..";

import { url, urlStatus } from "./config";

describe("response error", () => {
	test("detect text body", async () => {
		expect.assertions(3);
		try {
			await request({ url: urlStatus(404) });
		} catch (err) {
			expect(err).toBeInstanceOf(ResponseError);
			const error = err as ResponseError;
			expect(error.status).toBe(404);
			expect(error.body).toEqual({ status: 404 });
		}
	});

	test("force text body", async () => {
		expect.assertions(3);
		try {
			await request({ url: urlStatus(404), response: { errorBody: "text" } });
		} catch (err) {
			expect(err).toBeInstanceOf(ResponseError);
			const error = err as ResponseError;
			expect(error.status).toBe(404);
			expect(error.body).toBe(JSON.stringify({ status: 404 }));
		}
	});

	test("ignore body", async () => {
		expect.assertions(3);
		try {
			await request({ url: urlStatus(404), response: { errorBody: false } });
		} catch (err) {
			expect(err).toBeInstanceOf(ResponseError);
			const error = err as ResponseError;
			expect(error.status).toBe(404);
			expect(error.body).toBeUndefined();
		}
	});

	test("error status, allow all", async () => {
		const res = await request({ url: urlStatus(404), response: { errorStatus: () => false } });
		expect(res.status).toBe(404);
		expect(res.body).toEqual({ status: 404 });
	});

	test("error status, forbid all", async () => {
		expect.assertions(3);
		try {
			await request({ url, response: { errorStatus: () => true } });
		} catch (err) {
			expect(err).toBeInstanceOf(ResponseError);
			const error = err as ResponseError;
			expect(error.status).toBe(200);
			expect(error.body).toBe("Hello world");
		}
	});
});
