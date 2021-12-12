module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	clearMocks: true,
	globalSetup: "./globalSetup.ts",
	globalTeardown: "./globalTeardown.ts",
};
