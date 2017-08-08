import * as ts from 'typescript';
import * as Lint from 'tslint';
import {IOptions} from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'importing parent path ';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    // tslint:disable-next-line:no-use-before-declare
    return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
  }
}

// The walker takes care of all the work.
class NoImportsWalker extends Lint.RuleWalker {
  readonly absPathList: ReadonlyArray<string>;
  constructor(sourceFile: ts.SourceFile, options: IOptions) {
    super(sourceFile, options);
    const full = sourceFile.fileName.split('/');
    full.pop(); // get rid of module file name
    this.absPathList = full;
  }

  public visitImportDeclaration(node: ts.ImportDeclaration) {
    // moduleSpecifier is the part after `from`, we need to trim of the `'` on both sides.
    const imported = node.moduleSpecifier.getText().slice(1, -1);

    // we only check for relative paths that contain at least one slash
    if (imported[0] !== '.' && imported.indexOf('/') > -1) {
      const importedList = imported.split('/');
      const matchedFilePathIndex = this.absPathList.lastIndexOf(importedList[0]);
      // first path part from moduleSpecifier was found in the path to the file.
      if (matchedFilePathIndex > -1) {
        /* so far it is matching, but one of the following path elements
           could point to another directory
         */
        // mark that whole line as Error, we could easliy be more precise
        // about where to put the marker, e.g. just at the path that shouldn't be used
        // TODO: providing a fix for this would be awesome, but I think it is not trivial
        // maybe we can deal with some easy cases, more complex stuff still needs hand work?
        this.addFailureAtNode(
          node, `${Rule.FAILURE_STRING} ${imported} is not allowed.`
        );
      }
    }
    super.visitImportDeclaration(node);
  }
}
