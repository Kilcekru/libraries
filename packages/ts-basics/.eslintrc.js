module.exports = {
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
			impliedStrict: true,
		},
		ecmaVersion: 2021,
		sourceType: "module",
	},
	plugins: ["import", "simple-import-sort"],
	extends: ["eslint:recommended", "prettier"],
	rules: {
		"import/first": "error", // imports have to be first statements in file
		"import/no-extraneous-dependencies": ["error"], // don't allow import/require of missing dependencies
		"no-console": "error", // don't allow usage of console
		"simple-import-sort/exports": "error", // sort exports
		"simple-import-sort/imports": "error", // sort imports
	},
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			parser: "@typescript-eslint/parser",
			extends: ["plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/recommended-requiring-type-checking", "plugin:import/typescript"],
			rules: {
				"@typescript-eslint/explicit-module-boundary-types": "off",
				"@typescript-eslint/no-misused-promises": [
					"error",
					{ checksVoidReturn: false }, // return Promise<void> should be allowed where void is expected
				],
				"@typescript-eslint/no-namespace": "off",
				"@typescript-eslint/no-unnecessary-type-constraint": "off", // inside tsx file 'extends unknown' is necessary, otherwise <T> would be parsed as react tag
				"@typescript-eslint/no-unused-vars": [
					"error",
					{
						ignoreRestSiblings: true, // necessary to "omit" properties from an object
						argsIgnorePattern: "^_", // allow args and vars starting with _ for rare exceptions when it is needed
						varsIgnorePattern: "^_",
					},
				],
				"@typescript-eslint/require-await": "off", // functions implementing a type sometimes have to return Promise even without await. async is easier than multiple Promise.resolve
			},
		},
	],
};
