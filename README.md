# bm-tslint-rules

This is a utility package to ease adding tslint checking to a project.

## Dependencies

It is different from other [rule configurations](https://github.com/palantir/tslint#custom-rules--plugins) in that it depends on a fixed version of the following npm packages:
* [`tslint`](https://github.com/palantir/tslint) for running it against a codebase (so it doesn't need to be part of your `package.json`)
the configurations that are extended in the following order:
* [`tslint-eslint-rules`](https://github.com/buzinas/tslint-eslint-rules/blob/master/CHANGELOG.md)
* [`tslint-microsoft-contrib`](https://github.com/Microsoft/tslint-microsoft-contrib/wiki/Release-Notes)
* [`tslint-react`](https://github.com/Microsoft/tslint-microsoft-contrib/wiki/Release-Notes)

to make sure upgrading dependencies in a project does not break any code/CI pipeline because of fixed/improve/more strict tslint rules.

Instead we are doing regular upgrade days in this project and each project can decide when to switch to a newer version of this package on it's own.

For executing the custom rule(s) coming with this package there is the additional (peer-)dependency [`ts-node`](https://github.com/TypeStrong/ts-node/). Since `ts-node` also [needs `typescript`](https://github.com/TypeStrong/ts-node/blob/v4.1.0/src/index.ts#L11) at runtime, that is the second peer dependency (`^2.4.1` since this is the version `ts-node` [devDepends on](https://github.com/TypeStrong/ts-node/blob/v4.1.0/package.json#L75).

## Usage

1. install an [available version](https://github.com/bettermarks/bm-tslint-rules/releases) (e.g. `v0.1.0`)) as a devDependency:

`npm install -D github:bettermarks/bm-tslint-rules#<VERSION>`
(You should not use leave out `<VERSION>` since this refers to master and differs depending on which time you install it and npm's cache prevents updates once it fetched it.)

2. copy [`tslint.json`](https://github.com/bettermarks/bm-tslint-rules/blob/master/examples/minimal/tslint.json) to your project root.

   (optionally adopt the configuration to your need, see [examples](https://github.com/bettermarks/bm-tslint-rules/blob/master/examples))

3. add the following to the `scripts` in your `package.json`:
    ```json
    "tslint": "tslint [OPTIONS]",
    ```
   - you will need to find the [options](https://palantir.github.io/tslint/usage/cli/) that work best for your project, we recommend:
   
    ```json
    "tslint": "tslint -c tslint.json --project tsconfig.json -t stylish",
    ```

4. on the command line run `npm run tslint`.

## Configured rules

The repo exports its [`tslint.json`]() as it's main file.

Since documenting each and every rule here would possible get outdated soon here are the sources for the rules we have configured:

* [`tslint-eslint-rules`](https://github.com/buzinas/tslint-eslint-rules#rules-copied-from-the-eslint-website)
* `tslint-microsoft-contrib`: 
  - [extending recommended ruleset](https://github.com/Microsoft/tslint-microsoft-contrib/blob/master/recommended_ruleset.js),  
  - [available rules and options](https://github.com/Microsoft/tslint-microsoft-contrib#supported-rules)
* `tslint-react`:
  - [extending ruleset](https://github.com/palantir/tslint-react/blob/master/tslint-react.json)
  - [available rules and options](https://github.com/palantir/tslint-react#rules)
  

## Custom Rules

### no-absolute-import-to-own-parent

TODO: document
