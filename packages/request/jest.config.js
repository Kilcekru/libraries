module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	clearMocks: true,
	globalSetup: "./test/globalSetup.ts",
	globalTeardown: "./test/globalTeardown.ts",
};
