"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var tslint_1 = require("tslint");
// tslint:disable-next-line:no-submodule-imports (only available this way)
var configuration_1 = require("tslint/lib/configuration");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.getProjectPath = function (sourceFilePath) {
        if (Rule._projectRoot === undefined || !sourceFilePath.startsWith(Rule._projectRoot)) {
            var configurationPath = configuration_1.findConfigurationPath(null, sourceFilePath);
            if (configurationPath === undefined) {
                throw new Error('no-absolute-import-to-own-parent couldn\'t find config path');
            }
            Rule._projectRoot = path.parse(configurationPath).dir;
            console.info('no-absolute-import-to-own-parent assumes project path:', Rule._projectRoot);
        }
        return this._projectRoot;
    };
    Rule.prototype.apply = function (sourceFile) {
        // tslint:disable-next-line:no-use-before-declare
        return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        description: 'In a mono-repo with each folder under src being an alias, ' +
            'you should avoid using the alias to import things within an alias.',
        options: [],
        optionsDescription: '',
        ruleName: 'no-absolute-import-to-own-parent',
        type: 'typescript',
        typescriptOnly: true
    };
    Rule.FAILURE_STRING = 'importing parent path ';
    return Rule;
}(tslint_1.Rules.AbstractRule));
exports.Rule = Rule;
// The walker takes care of all the work.
var NoImportsWalker = /** @class */ (function (_super) {
    __extends(NoImportsWalker, _super);
    function NoImportsWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        var relative = path.relative(Rule.getProjectPath(sourceFile.fileName), sourceFile.fileName);
        // split and chop of source folder (1st element) and module file name (last element)
        _this.packagePathList = relative.split(path.sep).slice(1, -1); // get rid of source folder
        return _this;
    }
    NoImportsWalker.prototype.visitImportDeclaration = function (node) {
        // moduleSpecifier is the part after `from`, we need to trim of the `'` on both sides.
        var imported = node.moduleSpecifier.getText().slice(1, -1);
        // we only check for relative paths that contain at least one slash
        if (imported[0] !== '.' && imported.indexOf('/') > -1) {
            var importedList = imported.split('/', 2);
            // 1st part of import path matches with root package
            if (importedList[0] === this.packagePathList[0]) {
                // TODO: providing a fix for this would be awesome, but I think it is not trivial
                // maybe we can deal with some easy cases, more complex stuff still needs hand work?
                this.addFailureAtNode(node.moduleSpecifier, Rule.FAILURE_STRING + " " + imported + " is not allowed.");
            }
        }
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    return NoImportsWalker;
}(tslint_1.RuleWalker));
