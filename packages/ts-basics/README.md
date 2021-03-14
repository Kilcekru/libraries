# @kilcekru/ts-basics

Provides basic configuration for typescript and eslint.

- [Setup](#setup)
- [tsconfig](#tsconfig)
- [eslint](#eslint)

## Setup

`npm i -D @kilcekru/ts-basics`

ts-basics has a peer dependency on typescript >= 4.1
`npm i -D typescript@latest`

## tsconfig

There are four flavours available:
- `tsconfig-node-base`: for node >=14; use this for scripts and services
- `tsconfig-node-library`: for node >=14; use this for libraries (enables declaration files)
- `tsconfig-react-base`: for browser; use this for a project (es2019 is used, support for older browsers not given)
- `tsconfig-react-library`: for browser, use this for libraries (enables declaration files)

To use one of those flavours, just extend your tsconfig from it:
```json
{
	"extends": "@kilcekru/ts-basics/tsconfig-node-base.json",
}
```

This will give you the basic configuration, but does not specify any paths.  
You still have to setup include, outDir,...

*Example*:
```json
{
	"extends": "@kilcekru/ts-basics/tsconfig-node-base.json",
	"compilerOptions": {
		"outDir": "dist",
	},
	"include": [
		"src/**/*"
	]
}
```

## eslint

The base config for eslint is available at `.eslintrc.js`.  
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

**Eslint and typescript**  
`@typescript-eslint/parser` is used for all typescript files.  
For this to work it is necessary that all typescript file are included in a `tsconfig.json` file  
and this tsconfig files need to be set in `parserOptions.project`.
Eslint will throw an error, if a file is not referenced correctly.

If you have typescript files, that are not part of your build (config, tests),  
you can create a `tsconfig.eslint.json` which just includes those files (don't forget to add this file to `parserOptions.project`).
```json
{
	"extends": "@kilcekru/ts-basics/tsconfig-node-base.json",
	"include": ["config/**/*", "tests/**/*"]
}
```


**Performance**  
Eslint gets exponential slower on bigger projects.  
If you use it in a monorepo, create a separate .eslintrc.js for each package.  
Linting each package will be faster and use less memory than linting everything at once.