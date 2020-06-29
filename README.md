# Package-Test

This package is deprecated. Please use [@toolbuilder/rollup-config-pkg-test](https://github.com/toolbuilder/rollup-config-pkgtest) instead. The Rollup configuration `@toolbuilder/rollup-config-pkg-test` and plugins it uses are  the result of refactoring this package. The plugins are far more configurable than this package.

This package tests the output of 'npm pack' in a separate, temporary, project. It does the following:

* Builds a temporary package in a temporary directory
* Uses rollup to create unit tests that import the package from ones that use relative imports
* Writes the new unit tests to the temporary package
* Installs the dependencies it found during the conversion
* Runs the unit tests

Options for input and output are provided. It has defaults that suit me.

## Installation

```bash
npm install --save @toolbuilder/package-test
# Or
pnpm add @toolbuilder/package-test
```

## Operation

This package provides a CLI (`cli.js`), and a programmatic API (`src/index.js`). A script called `package-test` is installed in `node_modules/.bin` when the package is installed. The script `package-test` provides access to the CLI.

```bash
pnpm add @toolbuilder/package-test
pnpx package-test --help
```

## Contributing

Yes, please! Or point out a better package, since I couldn't find any. This is a rough version just to get started testing my other packages.
