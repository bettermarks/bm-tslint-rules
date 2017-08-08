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
var Lint = require("tslint");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        // tslint:disable-next-line:no-use-before-declare
        return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'importing parent path ';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
// The walker takes care of all the work.
var NoImportsWalker = (function (_super) {
    __extends(NoImportsWalker, _super);
    function NoImportsWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        var full = sourceFile.fileName.split('/');
        full.pop(); // get rid of module file name
        _this.absPathList = full;
        return _this;
    }
    NoImportsWalker.prototype.visitImportDeclaration = function (node) {
        // moduleSpecifier is the part after `from`, we need to trim of the `'` on both sides.
        var imported = node.moduleSpecifier.getText().slice(1, -1);
        // we only check for relative paths that contain at least one slash
        if (imported[0] !== '.' && imported.indexOf('/') > -1) {
            var importedList = imported.split('/');
            var matchedFilePathIndex = this.absPathList.lastIndexOf(importedList[0]);
            // first path part from moduleSpecifier was found in the path to the file.
            if (matchedFilePathIndex > -1) {
                /* so far it is matching, but one of the following path elements
                   could point to another directory
                 */
                // mark that whole line as Error, we could easliy be more precise
                // about where to put the marker, e.g. just at the path that shouldn't be used
                // TODO: providing a fix for this would be awesome, but I think it is not trivial
                // maybe we can deal with some easy cases, more complex stuff still needs hand work?
                this.addFailureAtNode(node, Rule.FAILURE_STRING + " " + imported + " is not allowed.");
            }
        }
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    return NoImportsWalker;
}(Lint.RuleWalker));
