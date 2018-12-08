import * as path from 'path';
import {IOptions, IRuleMetadata, RuleFailure, Rules, RuleWalker} from 'tslint';
// tslint:disable-next-line:no-submodule-imports (only available this way)
import {findConfigurationPath} from 'tslint/lib/configuration';
// tslint:disable-next-line:no-implicit-dependencies (it is a peer dependency through tslint)
import * as ts from 'typescript';

export class Rule extends Rules.AbstractRule {
  public static metadata: IRuleMetadata = {
    description: 'In a mono-repo with each folder under src being an alias, ' +
    'you should avoid using the alias to import things within an alias.',
    options: [],
    optionsDescription: '',
    ruleName: 'no-absolute-import-to-own-parent',
    type: 'typescript',
    typescriptOnly: true
  };
  public static FAILURE_STRING = 'importing parent path ';

  private static _projectRoot: string;
  static getProjectPath(sourceFilePath: string): string {
    if (Rule._projectRoot === undefined || !sourceFilePath.startsWith(Rule._projectRoot)) {
      // tslint:disable-next-line:no-null-keyword type in tslint only allows null (but checks both)
      const configurationPath = findConfigurationPath(null, sourceFilePath);
      if (configurationPath === undefined) {
        throw new Error('no-absolute-import-to-own-parent couldn\'t find config path');
      }
      Rule._projectRoot = path.parse(configurationPath).dir;
      console.info('no-absolute-import-to-own-parent assumes project path:', Rule._projectRoot);
    }
    return this._projectRoot;
  }

  public apply(sourceFile: ts.SourceFile): RuleFailure[] {

    // tslint:disable-next-line:no-use-before-declare
    return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
  }
}

// The walker takes care of all the work.
class NoImportsWalker extends RuleWalker {
  readonly packagePathList: ReadonlyArray<string>;

  constructor(sourceFile: ts.SourceFile, options: IOptions) {
    super(sourceFile, options);
    const relative = path.relative(Rule.getProjectPath(sourceFile.fileName), sourceFile.fileName);

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
