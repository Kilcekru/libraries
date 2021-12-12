export default async function () {
	await global.__fastify.close();
}
