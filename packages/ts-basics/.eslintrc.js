module.exports = {
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
			impliedStrict: true,
		},
		ecmaVersion: 2021,
		sourceType: "module",
	},
	extends: ["eslint:recommended", "plugin:import/recommended", "plugin:react/recommended", "plugin:react-hooks/recommended", "prettier"],
	rules: {
		"import/order": ["error", { "newlines-between": "always", alphabetize: { order: "asc" } }],
		"import/no-extraneous-dependencies": ["error"],
	},
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			settings: {
				"import/resolver": {
					typescript: {},
				},
			},
			parser: "@typescript-eslint/parser",
			extends: ["plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/recommended-requiring-type-checking", "plugin:import/typescript"],
			rules: {
				"react/prop-types": "off", // doesn't play well with Utility Types, props need to be typed anyway
				"@typescript-eslint/explicit-module-boundary-types": "off",
				"@typescript-eslint/no-namespace": "off",
				"@typescript-eslint/require-await": "off", // functions implementing a type sometimes have to return Promise even without await. async is easier than multiple Promise.resolve
				"@typescript-eslint/no-unnecessary-type-constraint": "off", // inside tsx file 'extends unknown' is necessary, otherwise <T> would be parsed as react tag
			},
		},
	],
	settings: {
		react: {
			version: "detect",
		},
	},
};
