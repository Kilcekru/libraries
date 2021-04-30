import { Agent } from "http";
import { URL } from "url";

import { AbortController, AbortSignal } from "abort-controller";

export { AbortController };

interface URLLike {
	href: string;
}

type ResponseType = false | "detect" | "arrayBuffer" | "json" | "blob" | "text" | "stream";

type RequestMode = "cors" | "navigate" | "no-cors" | "same-origin";
type RequestCredentials = "include" | "omit" | "same-origin";
type RequestRedirect = "error" | "follow" | "manual";

interface TimeoutOptions {
	total: number;
	headers?: number;
	body?: number;
}

type RetryFn = (attempt: number, error: Error) => boolean | number;
interface RetryOptions {
	attempts?: number | RetryFn;
	delay?: number | ((attempt: number, error: Error) => number);
}

export interface RequestOptions {
	url: string | URLLike;
	method?: string;
	headers?: Record<string, string>;
	body?: string | Record<string, unknown> | unknown[];
	redirect?: RequestRedirect;
	signal?: AbortSignal;
	response?: ResponseType;
	timeout?: number | TimeoutOptions;
	retry?: number | RetryOptions | RetryFn;
	mode?: RequestMode;
	credentials?: RequestCredentials;
	agent?: false | Agent | ((parsedUrl: URL) => Agent);
}

export interface Headers {
	append(name: string, value: string): void;
	delete(name: string): void;
	get(name: string): string | null;
	has(name: string): boolean;
	set(name: string, value: string): void;
	forEach(callback: (value: string, key: string) => void): void;
}

export interface Response {
	status: number;
	headers: Headers;
	body: unknown;
}

type Request = (options: string | RequestOptions) => Promise<Response>;
type SetDefaultOptions = (options?: Partial<RequestOptions>) => void;
export declare const request: Request;
export declare const setDefaultOptions: SetDefaultOptions;

export declare const createRequest: (
	options?: Partial<RequestOptions>
) => {
	request: Request;
	setDefaultOptions: SetDefaultOption;
};
