import { nodeResolve } from "@rollup/plugin-node-resolve";

export default () => {
	return [
		{
			input: "src/node.js",
			output: {
				file: "dist/node.js",
				format: "cjs",
			},
			plugins: [nodeResolve()],
			external: ["abort-controller", "node-fetch"],
		},
		{
			input: "src/browser.js",
			output: {
				file: "dist/browser.js",
				format: "esm",
			},
			plugins: [nodeResolve()],
		},
	];
};
