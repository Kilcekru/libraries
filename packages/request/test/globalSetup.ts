import Fastify from "fastify";

import * as Config from "./config";

export default async function () {
	const server = Fastify();
	server.server.unref();

	server.all("/", async (req, reply) => {
		await reply.send("Hello world");
	});

	server.all("/reflect", async (req, reply) => {
		await reply.send({
			method: req.method,
			headers: req.headers,
			body: req.body,
		});
	});

	server.all("/res/text", async (_req, reply) => {
		await reply.send("Hello world");
	});

	server.all("/res/json", async (_req, reply) => {
		await reply.send({ foo: "bar" });
	});

	server.all("/res/xml", async (_req, reply) => {
		await reply.type("text/xml; charset=utf-8").send("<tag></tag>");
	});

	server.all("/res/binary", async (_req, reply) => {
		await reply.type("application/octet-stream").send(Buffer.from([20, 120, 220]));
	});

	server.all("/error", async (_req, reply) => {
		reply.raw.socket?.destroy();
	});

	server.all("/timeout", async () => {
		// no response
	});

	server.all("/timeout/body", async (_req, reply) => {
		reply.raw.flushHeaders();
		// only headers sent, no body will be sent
	});

	server.all<{ Params: { status: string } }>("/status/:status", async (req, reply) => {
		const status = parseInt(req.params.status);
		if (isNaN(status)) {
			reply.raw.socket?.destroy();
		}
		await reply.status(status).send({ status });
	});

	await server.listen(Config.port);
	global.__fastify = server;
}
