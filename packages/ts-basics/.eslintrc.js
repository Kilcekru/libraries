module.exports = {
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
			impliedStrict: true,
		},
		ecmaVersion: 2020,
		sourceType: "module",
	},
	extends: [
		"eslint:recommended",
		"plugin:import/recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"prettier",
	],
	rules: {
		"import/order": [
			"error",
			{ "newlines-between": "always", alphabetize: { order: "asc" } },
		],
		"import/no-extraneous-dependencies": [
			"error",
			{ peerDependencies: false, devDependencies: false }, // don't allow import/require of dev- or peerDependencies
		],
	},
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			extends: [
				"plugin:@typescript-eslint/recommended",
				"plugin:@typescript-eslint/recommended-requiring-type-checking",
				"plugin:import/typescript",
			],
			rules: {
				"@typescript-eslint/require-await": "off", // functions implementing a type sometimes have to return Promise even without await. async is easier than multiple Promise.resolve
			},
		},
		{
			files: [
				"jest.config.js",
				"webpack.config.js",
				"**/scripts/*",
				"*.test.tsx",
			],
			rules: {
				"import/no-extraneous-dependencies": [
					"error",
					{ peerDependencies: false },
				], // config and scripts may import devDependencies
			},
		},
	],
	settings: {
		react: {
			version: "detect",
		},
	},
};
