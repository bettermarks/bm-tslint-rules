# bm-tslint-rules

[![David](https://david-dm.org/bettermarks/bm-tslint-rules.svg)](https://david-dm.org/bettermarks/bm-tslint-rules)
[![CircleCI](https://circleci.com/gh/bettermarks/bm-tslint-rules.svg?style=svg)](https://circleci.com/gh/bettermarks/bm-tslint-rules)

This is a utility package to ease adding tslint checking to a project.

## Dependencies

It is different from other [rule configurations](https://github.com/palantir/tslint#custom-rules--plugins) in that it depends on a fixed version of the following npm packages:
* [`tslint`](https://github.com/palantir/tslint) for running it against a codebase (so it doesn't need to be part of your `package.json`)
the configurations that are extended in the following order:
* [`tslint-eslint-rules`](https://github.com/buzinas/tslint-eslint-rules/blob/master/CHANGELOG.md)
* [`tslint-microsoft-contrib`](https://github.com/Microsoft/tslint-microsoft-contrib/wiki/Release-Notes)
* [`tslint-react`](https://github.com/Microsoft/tslint-microsoft-contrib/wiki/Release-Notes)
* [`tslint-no-unused-expression-chai`](https://github.com/kwonoj/tslint-no-unused-expression-chai)

to make sure upgrading dependencies in a project does not break any code/CI pipeline because of fixed/improve/more strict tslint rules.

Instead we are using [renovatebot](https://renovatebot.com) to provide regular upgrade PRs and each project can decide when to switch to a newer version of this package on it's own.

For further details see [Configured Rules](#configured-rules).

## Usage

1. install an [available version](https://github.com/bettermarks/bm-tslint-rules/releases) (e.g. `v0.7.16`)) as a devDependency:

`npm install -D github:bettermarks/bm-tslint-rules#<VERSION>`
(You should not leave out `<VERSION>`, since this refers to master and differs depending on which time you install it, since npm's cache prevents updates once it fetched it.)

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

PS: So far we didn't spend any effort in making this available via npm since it works quite well this way and it is not a high prio for us. 

## Configured rules

The repo exports its [`tslint.json`](https://github.com/bettermarks/bm-tslint-rules/blob/master/tslint.json) as it's main file.

We are using [karfau/tslint-report](https://github.com/karfau/tslint-report/) to provide a way of reasoning about (currently 301) [available](https://github.com/bettermarks/bm-tslint-rules/blob/master/tslint.report.available.json) and (currently 179) [active](https://github.com/bettermarks/bm-tslint-rules/blob/master/tslint.report.active.json) rules and their [sources](https://github.com/bettermarks/bm-tslint-rules/blob/master/tslint.report.sources.json) (currently 6).
As of writing this the rule set has  
These can be generated using `npm run report` and will be generated automatically when running `npm version ...`.
Our CircleCI integration makes sure the reports are always up to date. So when a commit lands on master you will be able to know what rules have been changed.

When upgrading version we stick to semver where every rule (that we are aware of) that could your `npm run tslint` will be marked as a breaking change. (This can be different from what the different rule sets consider a breaking change.)  

## Custom Rules

### no-absolute-import-to-own-parent

In a mono-repo with each folder under src being an alias, 
you should avoid using the alias to import things within an alias.

There is no configuration for this rule, it just checks that you are not importing
from the root level folder in src, that the module lives in.
