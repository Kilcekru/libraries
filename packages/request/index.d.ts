import { Agent } from "http";
import { URL } from "url";

import { AbortController, AbortSignal } from "abort-controller";

export { AbortController, AbortSignal };

export interface URLLike {
	href: string;
}

export type ResponseBodyType = false | "detect" | "json" | "text" | "arrayBuffer" | "stream" | "raw";
export interface ResponseOptions {
	body?: ResponseBodyType;
	errorStatus?: (status: number) => boolean;
	errorBody?: ResponseBodyType;
}

export interface TimeoutOptions {
	total: number;
	headers?: number;
	body?: number;
}

export type RetryFn = (attempt: number, error: Error) => boolean | number;
export interface RetryOptions {
	attempts?: number | RetryFn;
	delay?: number | ((attempt: number, error: Error) => number);
}

export interface RequestOptions {
	url: string | URLLike;
	method?: string;
	headers?: Record<string, string>;
	body?: string | Record<string, unknown> | unknown[];
	redirect?: "error" | "follow" | "manual";
	signal?: AbortSignal;
	response?: ResponseBodyType | ResponseOptions;
	timeout?: number | TimeoutOptions;
	retry?: number | RetryOptions | RetryFn;
	mode?: "cors" | "navigate" | "no-cors" | "same-origin";
	credentials?: "include" | "omit" | "same-origin";
	agent?: false | Agent | ((parsedUrl: URL) => Agent);
}
export type DefaultOptions = Omit<RequestOptions, "url">;

export interface Headers {
	append(name: string, value: string): void;
	delete(name: string): void;
	get(name: string): string | null;
	has(name: string): boolean;
	set(name: string, value: string): void;
	forEach(callback: (value: string, key: string) => void): void;
}

export interface Response<T> {
	status: number;
	headers: Headers;
	body: T;
}

declare interface Request {
	(requestOptions: RequestOptions & { response: false }): Promise<Response<undefined>>;
	(requestOptions: RequestOptions & { response: { body: false } }): Promise<Response<undefined>>;
	(requestOptions: RequestOptions & { response: "text" }): Promise<Response<string>>;
	(requestOptions: RequestOptions & { response: { body: "text" } }): Promise<Response<string>>;
	(requestOptions: RequestOptions & { response: "arrayBuffer" }): Promise<Response<ArrayBuffer>>;
	(requestOptions: RequestOptions & { response: { body: "arrayBuffer" } }): Promise<Response<ArrayBuffer>>;
	(requestOptions: RequestOptions & { response: "raw" }): Promise<Response<FetchResponse>>;
	(requestOptions: RequestOptions & { response: { body: "raw" } }): Promise<Response<FetchResponse>>;
	(requestOptions: string | RequestOptions): Promise<Response<unknown>>;
}

export type SetDefaultOptions = (options?: DefaultOptions) => void;
export declare const request: Request;
export declare const setDefaultOptions: SetDefaultOptions;

export declare const createRequest: (options?: Partial<RequestOptions>) => {
	request: Request;
	setDefaultOptions: SetDefaultOption;
};

declare class BaseError extends Error {
	get name(): string;
	get [Symbol.toStringTag](): string;
	toJSON(): Record<string, unknown>;
}
export declare class ResponseError extends BaseError {
	status: number;
	body: unknown;
}
export declare class TimeoutError extends BaseError {
	reason: string;
}

export declare class AbortError extends BaseError {}

export declare class FetchError extends BaseError {
	type: string | undefined;
	errno: string | undefined;
	code: string | undefined;
}

interface FetchResponse {
	readonly headers: Headers;
	readonly ok: boolean;
	readonly redirected: boolean;
	readonly status: number;
	readonly statusText: string;
	readonly type: "basic" | "cors" | "default" | "error" | "opaque" | "opaqueredirect";
	readonly url: string;
	readonly body: unknown;
	readonly bodyUsed: boolean;
	clone(): FetchResponse;
	arrayBuffer(): Promise<ArrayBuffer>;
	blob(): Promise<Blob>;
	json(): Promise<unknown>;
	text(): Promise<string>;
	buffer?(): Promise<Buffer>;
}
