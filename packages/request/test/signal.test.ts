import fetch from "node-fetch";
import { mocked } from "ts-jest/utils";

import { request, AbortError, AbortController } from "..";

import { urlTimeout } from "./config";

const spyFetch = mocked(fetch);

describe("signal", () => {
	test("abort", async () => {
		expect.assertions(5);
		const controller = new AbortController();
		const promise = request({ url: urlTimeout, signal: controller.signal });
		controller.abort();
		expect(spyFetch).toHaveBeenCalledTimes(1);
		try {
			await promise;
		} catch (err) {
			expect(err).toBeInstanceOf(AbortError);
			expect((err as AbortError).name).toBe("AbortError");
			expect((err as AbortError)[Symbol.toStringTag]).toBe("AbortError");
			expect((err as AbortError).toJSON()).toEqual({
				message: "The request has been aborted",
				name: "AbortError",
			});
		}
	});
});
