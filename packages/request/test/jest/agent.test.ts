import { Agent } from "http";
import { Agent as AgentHttps } from "https";
import { URL } from "url";

import fetch from "node-fetch";
import { mocked } from "ts-jest/utils";

import { request } from "../..";

import { url } from "./config";

const spyFetch = mocked(fetch);

describe("agent", () => {
	test("default agent", async () => {
		await request({ url });
		await request({ url });
		expect(spyFetch).toHaveBeenCalledTimes(2);
		const agent = spyFetch.mock.calls[0]?.[1]?.agent;
		expect(typeof agent).toBe("function");
		expect((agent as (url: URL) => Agent)(new URL("http://localhost"))).toBeInstanceOf(Agent);
		expect((agent as (url: URL) => Agent)(new URL("https://localhost"))).toBeInstanceOf(AgentHttps);
		expect(spyFetch.mock.calls[1]?.[1]?.agent).toBe(agent); // same agent for multiple requests
	});

	test("disable agent", async () => {
		await request({ url, agent: false });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		expect(spyFetch.mock.calls[0]?.[1]).toEqual(expect.not.objectContaining({ agent: expect.anything() as unknown }));
	});

	test("custom agent", async () => {
		const agent = new Agent();
		await request({ url, agent });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		expect(spyFetch.mock.calls[0]?.[1]?.agent).toBe(agent);
	});

	test("custom agent function", async () => {
		const agent = new Agent();
		await request({ url, agent: () => agent });
		expect(spyFetch).toHaveBeenCalledTimes(1);
		const usedAgent = spyFetch.mock.calls[0]?.[1]?.agent;
		expect(typeof usedAgent).toBe("function");
		expect((usedAgent as (url: URL) => Agent)(new URL("http://localhost"))).toBe(agent);
	});
});
