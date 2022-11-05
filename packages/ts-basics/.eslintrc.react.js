module.exports = {
	extends: ["./.eslintrc.js", "plugin:react/recommended", "plugin:react-hooks/recommended"],
	env: {
		browser: true,
		es2021: true,
	},
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			rules: {
				"react/prop-types": "off", // doesn't play well with Utility Types, props need to be typed anyway
			},
		},
	],
	settings: {
		react: {
			version: "detect",
		},
	},
};
