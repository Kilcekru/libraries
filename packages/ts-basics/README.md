# @kilcekru/ts-basics

Provides basic configuration for typescript and eslint.

- [Setup](#setup)
- [tsconfig](#tsconfig)
- [eslint](#eslint)

## Setup

`npm i -D @kilcekru/ts-basics`

ts-basics has a peer dependency on typescript >= 4.3  
`npm i -D typescript@latest`

## tsconfig

There are four flavours available:
- `tsconfig-node-app`: for node >=16; use this for nodejs apps
- `tsconfig-node-library`: for node >=16; use this for libraries (enables declaration files)
- `tsconfig-react-app`: for browser; use this for react apps (es2021 is used, support for older browsers not given)
- `tsconfig-react-library`: for browser, use this for libraries (enables declaration files)

To use one of those flavours, just extend your tsconfig from it:  
This will give you the basic configuration, but does not specify any paths.  
You still have to add `include`, `outDir`,...

*Example*:
```json
{
	"extends": "@kilcekru/ts-basics/tsconfig-node-app.json",
	"compilerOptions": {
		"outDir": "dist",
	},
	"include": [
		"src/**/*"
	]
}
```

## eslint

There are three flavours available:
- `.eslintrc.js`: base config, no environment set
- `.eslintrc.node.js`: environment set for nodejs
- `.eslintrc.react.js`: extends for react rules, environment set for browser
To use it just extend your eslintrc from this file.

*Example*:
```js
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
```

Don't forget to add a file called `.eslintignore` in your project root.  
Specify all files that don't need linting (like node_modules and build artifacts)

**Eslint and typescript**  
`@typescript-eslint/parser` is used for all typescript files.  
For this to work it is necessary that all typescript file are included in a `tsconfig.json` file  
and this tsconfig files need to be set in `parserOptions.project`.
Eslint will throw an error, if a file is not referenced correctly.

If you have typescript files, that are not part of your build (config, tests),  
you can create a `tsconfig.eslint.json` which just includes those files (don't forget to add this file to `parserOptions.project` in the `.eslintrc.js`).
```json
{
	"extends": "@kilcekru/ts-basics/tsconfig-node-app.json",
	"include": ["config/**/*", "tests/**/*"]
}
```

**Performance**  
Eslint gets exponential slower on bigger projects.  
If you use it in a monorepo, create a separate .eslintrc.js for each package.  
Linting each package will be faster and use less memory than linting everything at once.
