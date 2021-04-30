# @kilcekru/request

Simple promise-based requests for browser and nodeJS.  
No dependencies for browser version (Fetch and AbortController from browser are used).  
Node version uses node-fetch and abort-controller.  

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
	- [request(options)](#requestoptions)
	- [Options](#options)
	- [Response](#response)
	- [setDefaultOptions([options])](#setdefaultoptionsoptions)
	- [createRequest([options])](#createrequestoptions)
- [Motivation](#motivation)

## Installation

`$ npm install @kilcekru/request`

If you are planning to use this package with typescript in nodeJs, also install @types/node  
`$ npm install --save-dev @types/node`

## Usage

```typescript
import { request } from "@kilcekru/request";

// Promise
request("https://httpbin.org/get").then((res) => {
	console.log(res.status);
	console.log(res.headers);
	console.log(res.body);
});

// async / await
async function req() {
	const res = await request("https://httpbin.org/get");
	console.log(res.status);
	console.log(res.headers);
	console.log(res.body);
}
req();

// Options
request({
	url: "https://httpbin.org/post",
	method: "POST",
	headers: {
		dnt: "1",
	},
	body: {
		message: "Hello world"
	},
	timeout: 5000,
	retry: 3,
}).then((res) => {
	console.log(res.body);
});
```

## API

### request(options)

Perform a HTTP(s) request.

- `options`: [Options](#options) for the request. Can be a string (url) for simple GET requests.
- Returns: Promise&lt;[Response](#response)&gt;

### Options

<details>
<summary>url (mandatory)</summary>

```typescript
url: string | { href: string };
```
A string representing the URL for fetching.  
The object variaton allows direct usage of `new URL`.  
In nodeJs the url has to be absolute.
</details>

<details>
<summary>method</summary>

```typescript
method?: string; // default: "GET"
```
The request method (GET, POST, ...)
</details>

<details>
<summary>headers</summary>

```typescript
headers?: Record<string, string>;
```
Request headers.

*Example*
```typescript
headers: {
	"Content-Type": "text/html; charset=UTF-8"
}
```
</details>

<details>
<summary>body</summary>

```typescript
body?: string | Record<string, unknown> | unknown[];
```
Request body.  
If the given body is an object or an array, it will be stringified and the `Content-Type` header will be set to `application/json`.  
If the body is a string, no header will be set.
</details>

<details>
<summary>redirect</summary>

```typescript
redirect?: "error" | "follow" | "manual"; // default: "follow"
```
Define how redirects are handled
</details>

<details>
<summary>signal</summary>

```typescript
signal?: AbortSignal;
```
Instance of AbortSignal to optionally abort requests.

*Example*
```typescript
import { request, AbortController } from "@kilcekru/request";

const controller = new AbortController();
request({
	url: "https://httpbin.org/get",
	signal: controller.signal,
}).catch((err) => {
	console.log(err);
});
controller.abort();
```
</details>

<details>
<summary>response</summary>

```typescript
response?: false | "detect" | "arrayBuffer" | "json" | "blob" | "text" | "stream"; // default: "detect"
```
Define how the response body will be parsed.  
- false: will discard the responseBody (might be faster if you only care about response status)
- detect: use content-type of response. `application/json` will be parse as json, `text/*` will be parsed as text
- arrayBuffer, json, blob, text: use the according function of the response
- return the raw response, which is a readable stream
</details>

<details>
<summary>timeout</summary>

```typescript
timeout?: number | TimeoutOptions; // default: 10000

interface TimeoutOptions {
	total: number;
	headers?: number;
	body?: number;
}
```
Specify a time after which the request will be automatically aborted.  
If a number is given, it is treated the same as `{total: number}`
- total: Maximum time from start of the request until body parsing is finished.
- headers: Maximum time from start of the request until the headers are parsed.
- body: Maximum time from start of body parsing (after headers are parsed) until body parsing is finished.
</details>

<details open>
<summary>retry</summary>

```typescript
retry?: number | RetryFn | RetryOptions;

type RetryFn = (attempt: number, error: Error) => boolean | number;
interface RetryOptions {
	attempts?: number | RetryFn;
	delay?: "backoff" | number | ((attempt: number, error: Error) => number); // default: "backoff"
}
```
Retry failed requests.  
If a number or RetryFn is given, it is treated the same as `{attempts: number | RetryFn}`.  
If no RetryFn is given, all errors from request and all statusCodes >= 500 are retried.

- attempts:
  - number: How many times to retry failed requests.
  - RetryFn: will be called when a requests fails to determine if it should be retried.  
    It receives 2 arguments: the count of failed requests and the last Error.  
		It can return a number (which will be used as delay), true (retry.delay will be used) or false (will not be retried)
- delay: How long to wait between retries. Will not be used if RetryFn returns a number.  
  "backoff" will wait 500ms on the first retry, and double this time for every further retry to a max of 30 seconds.

</details>

<details>
<summary>mode (only browser)</summary>

```typescript
mode?: "cors" | "navigate" | "no-cors" | "same-origin";
```
Define which mode is used for cross-origin requests.  
See <a href="https://developer.mozilla.org/en-US/docs/Web/API/Request/mode" target="_blank">https://developer.mozilla.org/en-US/docs/Web/API/Request/mode</a>  
Only useful in browser environment, will be silently ignored when running on nodeJs.
</details>

<details>
<summary>credentials (only browser)</summary>

```typescript
credentials?: "include" | "omit" | "same-origin"; // default: same-origin
```
Define how cookies are handled on cross-origin requests.  
See <a href="https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials" target="_blank">https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials</a>  
Only useful in browser environment, will be silently ignored when running on nodeJs.
</details>

<details>
<summary>agent (ony nodeJs)</summary>

```typescript
agent?: false | Agent | ((parsedUrl: URL) => Agent);
```
http(s).Agent to use for this request.  
By default a single agent with keepAlive enabled is used for all requests.  
This behaviour can be disabled by passing `false`, which will create a new Agent for every request.  
More Details: <a href="https://www.npmjs.com/package/node-fetch#custom-agent" target="_blank">https://www.npmjs.com/package/node-fetch#custom-agent</a>  
Only useful in nodeJs environment, will be silently ignored when running on browser.
</details>

### Response

```typescript
interface Response {
	status: number;
	headers: Headers;
	body: unknown;
}

interface Headers {
	append(name: string, value: string): void;
	delete(name: string): void;
	get(name: string): string | null;
	has(name: string): boolean;
	set(name: string, value: string): void;
	forEach(callback: (value: string, key: string) => void): void;
}
```
- status: Response status code
- headers: Response headers as Headers object
- body: the parsed response body

### setDefaultOptions([options])
Set default options for all requests.  

- options: [Options](#options) used for all request.  
  Every valid option for a request can also be set to a default.  
- Returns: void

You can call `setDefaultOptions()` without arguments to reset all default options.

### createRequest([options])
Create a new Request instance with it's own set of default options

- options: [Options](#options) used for all request.  
  Every valid option for a request can also be set to a default.  
- Returns a new request instance
	```typescript
	{
		request: (options: string | RequestOptions) => Promise<Response>;
		setDefaultOptions: (options?: Partial<RequestOptions>) => void;
	}
	```

Useful if you want to have multiple groups of requests with different defaults.

*Example*
```typescript
const Request = createRequest({
	retry: 3,
})
Request.request({
	url: "https://httpbin.org/get",
}).then((res) => {
	console.log(res.body);
});
```

## Motivation
Fetch and node-fetch are great, but lack some convience functionality like timeout and retry.  
@kilcekru/requests is a wrapper with some useful features:
- independent of environment, same api in node and browser
- send request and parse body with a single function
- customize default values for parameters
- timeout requests
- retry failed requests