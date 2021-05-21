// node-fetch is not mocked here, just wrapped soe we can easily spy on it
// tested code uses the real node-fetch (against the fastify test server)

import fetch, { Headers, Request, Response, FetchError } from "node-fetch";
import { mocked } from "ts-jest/utils";

const mockedFetch = mocked(jest.createMockFromModule<typeof fetch>("node-fetch"));

mockedFetch.mockImplementation(fetch);

export default mockedFetch;
export { Headers, Request, Response, FetchError };
