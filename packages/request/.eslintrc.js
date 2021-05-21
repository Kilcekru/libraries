module.exports = {
	env: {
		node: true,
		browser: true,
		es2020: true,
	},
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"],
	},
	extends: [require.resolve("@kilcekru/ts-basics/.eslintrc.js")],
};
