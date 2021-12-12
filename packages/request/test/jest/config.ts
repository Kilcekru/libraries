import { FastifyInstance } from "fastify";

export const port = 38955;
export const url = `http://localhost:${port}`;
export const urlReflect = `${url}/reflect`;
export const urlError = `${url}/error`;
export const urlStatus = (status: number) => `${url}/status/${status}`;
export const urlTimeout = `${url}/timeout`;
export const urlTimeoutBody = `${url}/timeout/body`;

declare global {
	namespace NodeJS {
		interface Global {
			__fastify: FastifyInstance;
		}
	}
}
