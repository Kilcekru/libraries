import fetch from "node-fetch";
import { mocked } from "ts-jest/utils";

import { request, TimeoutError, AbortController } from "..";

import { url, urlTimeout, urlTimeoutBody } from "./config";

const _setTimeout = setTimeout; // non-fake timer
const spyFetch = mocked(fetch);

jest.useFakeTimers();

function allowPending(t?: number) {
	// allow any pending jobs in the PromiseJobs queue to run by delaying execution to next tick
	return new Promise<void>((resolve) => _setTimeout(() => resolve(), t ?? 1));
}

describe("timeout", () => {
	test("no timeout on success", async () => {
		await request({ url, timeout: { total: 100, headers: 100, body: 100 } });
		expect(spyFetch).toHaveBeenCalledTimes(1);
	});

	test("default timeout", async () => {
		const errCb = jest.fn<undefined, [TimeoutError]>();
		void request({ url: urlTimeout }).catch(errCb);
		expect(spyFetch).toHaveBeenCalledTimes(1);
		expect(errCb).not.toHaveBeenCalled();
		jest.advanceTimersByTime(9999);
		await allowPending();
		expect(errCb).not.toHaveBeenCalled();
		jest.advanceTimersByTime(1);
		await allowPending();
		expect(errCb).toHaveBeenCalled();
		expect(errCb.mock.calls[0]?.[0]).toBeInstanceOf(TimeoutError);
		expect(errCb.mock.calls[0]?.[0]?.reason).toBe("total");
	});

	test("global timeout", async () => {
		const errCb = jest.fn<undefined, [TimeoutError]>();
		void request({ url: urlTimeout, timeout: 1000 }).catch(errCb);
		expect(spyFetch).toHaveBeenCalledTimes(1);
		expect(errCb).not.toHaveBeenCalled();
		jest.advanceTimersByTime(999);
		await allowPending();
		expect(errCb).not.toHaveBeenCalled();
		jest.advanceTimersByTime(1);
		await allowPending();
		expect(errCb).toHaveBeenCalled();
		expect(errCb.mock.calls[0]?.[0]).toBeInstanceOf(TimeoutError);
		expect(errCb.mock.calls[0]?.[0]?.reason).toBe("total");
	});

	test("total timeout", async () => {
		const errCb = jest.fn<undefined, [TimeoutError]>();
		void request({ url: urlTimeout, timeout: { total: 1000 } }).catch(errCb);
		expect(spyFetch).toHaveBeenCalledTimes(1);
		expect(errCb).not.toHaveBeenCalled();
		jest.advanceTimersByTime(999);
		await allowPending();
		expect(errCb).not.toHaveBeenCalled();
		jest.advanceTimersByTime(1);
		await allowPending();
		expect(errCb).toHaveBeenCalled();
		expect(errCb.mock.calls[0]?.[0]).toBeInstanceOf(TimeoutError);
		expect(errCb.mock.calls[0]?.[0]?.reason).toBe("total");
	});

	test("headers timeout", async () => {
		const errCb = jest.fn<undefined, [TimeoutError]>();
		void request({ url: urlTimeout, timeout: { total: 10000, headers: 1000 } }).catch(errCb);
		expect(spyFetch).toHaveBeenCalledTimes(1);
		expect(errCb).not.toHaveBeenCalled();
		jest.advanceTimersByTime(999);
		await allowPending();
		expect(errCb).not.toHaveBeenCalled();
		jest.advanceTimersByTime(1);
		await allowPending();
		expect(errCb).toHaveBeenCalled();
		expect(errCb.mock.calls[0]?.[0]).toBeInstanceOf(TimeoutError);
		expect(errCb.mock.calls[0]?.[0]?.reason).toBe("headers");
	});

	test("body timeout", async () => {
		const errCb = jest.fn<undefined, [TimeoutError]>();
		void request({ url: urlTimeoutBody, timeout: { total: 10000, body: 1000 }, response: "text" }).catch(errCb);
		expect(spyFetch).toHaveBeenCalledTimes(1);
		expect(errCb).not.toHaveBeenCalled();
		await allowPending(50); // enough time for headers to be transmitted and body timeout to be set
		jest.advanceTimersByTime(999);
		await allowPending();
		expect(errCb).not.toHaveBeenCalled();
		jest.advanceTimersByTime(1);
		await allowPending();
		expect(errCb).toHaveBeenCalled();
		expect(errCb.mock.calls[0]?.[0]).toBeInstanceOf(TimeoutError);
		expect(errCb.mock.calls[0]?.[0]?.reason).toBe("body");
	});

	test("no interference with custom abortSignal", async () => {
		const controller = new AbortController();
		const promise = request({ url: urlTimeout, signal: controller.signal });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		jest.advanceTimersByTime(10000);
		await expect(promise).rejects.toBeInstanceOf(TimeoutError);
	});

	test("timeout error", async () => {
		const errCb = jest.fn<undefined, [TimeoutError]>();
		void request({ url: urlTimeout }).catch(errCb);
		jest.advanceTimersByTime(10000);
		await allowPending();
		expect(errCb).toHaveBeenCalledTimes(1);
		const err = errCb.mock.calls[0]?.[0];
		expect(err).toBeInstanceOf(TimeoutError);
		expect(err?.message).toBe("The request timed out");
		expect(err?.reason).toBe("total");
		expect(err?.name).toBe("TimeoutError");
		expect(err?.[Symbol.toStringTag]).toBe("TimeoutError");
		expect(err?.toJSON()).toEqual({
			message: "The request timed out",
			reason: "total",
			name: "TimeoutError",
		});
	});
});
