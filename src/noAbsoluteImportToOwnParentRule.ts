import * as ts from 'typescript';
import * as Lint from 'tslint';
import {IOptions} from 'tslint';
import * as path from 'path';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'importing parent path ';

  private static _projectRoot: string;
  static getProjectPath(): string {
    if (!Rule._projectRoot) {
      Rule._projectRoot = process.cwd();
      console.info('no-absolute-import-to-own-parent assumes project path:', Rule._projectRoot);
    }
    return this._projectRoot;
  }

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    // tslint:disable-next-line:no-use-before-declare
    return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
  }
}

// The walker takes care of all the work.
class NoImportsWalker extends Lint.RuleWalker {
  readonly packagePathList: ReadonlyArray<string>;

  constructor(sourceFile: ts.SourceFile, options: IOptions) {
    super(sourceFile, options);
    const relative = path.relative(Rule.getProjectPath(), sourceFile.fileName);

    // split and chop of source folder (1st element) and module file name (last element)
    this.packagePathList = relative.split(path.sep).slice(1, -1); // get rid of source folder
  }

  public visitImportDeclaration(node: ts.ImportDeclaration) {
    // moduleSpecifier is the part after `from`, we need to trim of the `'` on both sides.
    const imported = node.moduleSpecifier.getText().slice(1, -1);

    // we only check for relative paths that contain at least one slash
    if (imported[0] !== '.' && imported.indexOf('/') > -1) {
      const importedList = imported.split('/', 2);
      // 1st part of import path matches with root package
      if (importedList[0] === this.packagePathList[0]) {
        // TODO: providing a fix for this would be awesome, but I think it is not trivial
        // maybe we can deal with some easy cases, more complex stuff still needs hand work?
        this.addFailureAtNode(
          node.moduleSpecifier, `${Rule.FAILURE_STRING} ${imported} is not allowed.`
        );
      }
    }
    super.visitImportDeclaration(node);
  }
}
