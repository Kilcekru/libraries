import fetch from "node-fetch";
import { mocked } from "ts-jest/utils";

import { request, ResponseError, TimeoutError, FetchError } from "..";

import { urlError, urlStatus, urlTimeout } from "./config";

const _setTimeout = setTimeout; // non-fake timer
const spyFetch = mocked(fetch);

function allowPending(t?: number) {
	// allow any pending jobs in the PromiseJobs queue to run by delaying execution to next tick
	return new Promise<void>((resolve) => _setTimeout(() => resolve(), t ?? 1));
}

describe("retry", () => {
	test("no default retry", async () => {
		await expect(request({ url: urlError })).rejects.toBeInstanceOf(FetchError);
		expect(spyFetch).toHaveBeenCalledTimes(1);
	});

	test("retry connection error", async () => {
		await expect(request({ url: urlError, retry: { attempts: 2, delay: 0 } })).rejects.toBeInstanceOf(FetchError);
		expect(spyFetch).toHaveBeenCalledTimes(3);
	});

	test("retry status 500", async () => {
		await expect(request({ url: urlStatus(500), retry: { attempts: 2, delay: 0 } })).rejects.toBeInstanceOf(ResponseError);
		expect(spyFetch).toHaveBeenCalledTimes(3);
	});

	test("retry timeout", async () => {
		jest.useFakeTimers();
		const errCb = jest.fn<undefined, [TimeoutError]>();
		request({ url: urlTimeout, timeout: 1000, retry: { attempts: 2, delay: 0 } }).catch(errCb);
		while (jest.getTimerCount() > 0) {
			jest.advanceTimersByTime(1000);
			await allowPending();
		}
		expect(errCb).toHaveBeenCalledTimes(1);
		expect(errCb.mock.calls[0]?.[0]).toBeInstanceOf(TimeoutError);
		expect(spyFetch).toHaveBeenCalledTimes(3);
		jest.useRealTimers();
	});

	test("dont retry status 400", async () => {
		await expect(request({ url: urlStatus(400), retry: { attempts: 2, delay: 0 } })).rejects.toBeInstanceOf(ResponseError);
		expect(spyFetch).toHaveBeenCalledTimes(1);
	});

	test("should retry fn", async () => {
		const fn = (attempt: number) => attempt < 3;
		await expect(request({ url: urlError, retry: { attempts: fn, delay: 0 } })).rejects.toBeInstanceOf(FetchError);
		expect(spyFetch).toHaveBeenCalledTimes(3);
	});

	describe("delay", () => {
		beforeAll(() => {
			jest.useFakeTimers();
			spyFetch.mockImplementation(() => {
				throw new FetchError();
			});
		});

		afterAll(() => {
			jest.useRealTimers();
			spyFetch.mockReset();
		});

		test("default delay", async () => {
			const errCb = jest.fn<undefined, [FetchError]>();
			request({ url: urlError, retry: 2 }).catch(errCb);
			expect(spyFetch).toHaveBeenCalledTimes(1);
			await allowPending();
			jest.advanceTimersByTime(499);
			await allowPending();
			expect(spyFetch).toHaveBeenCalledTimes(1);
			jest.advanceTimersByTime(1);
			await allowPending();
			expect(spyFetch).toHaveBeenCalledTimes(2);
			jest.advanceTimersByTime(999);
			await allowPending();
			expect(spyFetch).toHaveBeenCalledTimes(2);
			expect(errCb).not.toHaveBeenCalled();
			jest.advanceTimersByTime(1);
			await allowPending();
			expect(spyFetch).toHaveBeenCalledTimes(3);
			expect(errCb).toHaveBeenCalledTimes(1);
		});

		test("custom delay value", async () => {
			const errCb = jest.fn<undefined, [FetchError]>();
			request({ url: urlError, retry: { attempts: 2, delay: 100 } }).catch(errCb);
			expect(spyFetch).toHaveBeenCalledTimes(1);
			await allowPending();
			jest.advanceTimersByTime(99);
			await allowPending();
			expect(spyFetch).toHaveBeenCalledTimes(1);
			jest.advanceTimersByTime(1);
			await allowPending();
			expect(spyFetch).toHaveBeenCalledTimes(2);
			jest.advanceTimersByTime(99);
			await allowPending();
			expect(spyFetch).toHaveBeenCalledTimes(2);
			expect(errCb).not.toHaveBeenCalled();
			jest.advanceTimersByTime(1);
			await allowPending();
			expect(spyFetch).toHaveBeenCalledTimes(3);
			expect(errCb).toHaveBeenCalledTimes(1);
		});

		test("custom delay function", async () => {
			const errCb = jest.fn<undefined, [FetchError]>();
			request({ url: urlError, retry: { attempts: 2, delay: (attempt) => attempt * 100 } }).catch(errCb);
			expect(spyFetch).toHaveBeenCalledTimes(1);
			await allowPending();
			jest.advanceTimersByTime(99);
			await allowPending();
			expect(spyFetch).toHaveBeenCalledTimes(1);
			jest.advanceTimersByTime(1);
			await allowPending();
			expect(spyFetch).toHaveBeenCalledTimes(2);
			jest.advanceTimersByTime(199);
			await allowPending();
			expect(spyFetch).toHaveBeenCalledTimes(2);
			expect(errCb).not.toHaveBeenCalled();
			jest.advanceTimersByTime(1);
			await allowPending();
			expect(spyFetch).toHaveBeenCalledTimes(3);
			expect(errCb).toHaveBeenCalledTimes(1);
		});
	});
});
