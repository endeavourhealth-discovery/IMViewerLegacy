import {DiscoveryLanguage, DiscoveryLanguageId, richLanguageConfiguration} from './discovery-syntax/DiscoveryLanguage';
import {NgxMonacoEditorConfig} from 'ngx-monaco-editor';
import ITextModel = monaco.editor.ITextModel;
import CompletionContext = monaco.languages.CompletionContext;
import CancellationToken = monaco.CancellationToken;
import ProviderResult = monaco.languages.ProviderResult;
import CompletionList = monaco.languages.CompletionList;
import Position = monaco.Position;
import {DefinitionContext, DiscoverySyntaxParser} from './discovery-syntax/DiscoverySyntaxParser';
import TodoLangErrorListener, {ITodoLangError} from './discovery-syntax/DiscoveryErrorListener';
import {ANTLRInputStream, CommonTokenStream} from 'antlr4ts';
import {DiscoverySyntaxLexer} from './discovery-syntax/DiscoverySyntaxLexer';
import {ParserRuleContext} from 'antlr4ts/ParserRuleContext';

export const monacoConfig: NgxMonacoEditorConfig = {
  onMonacoLoad: discoveryMonacoInit
}

export function discoveryMonacoInit() {
    monaco.languages.register({id: DiscoveryLanguageId});
    monaco.languages.onLanguage(DiscoveryLanguageId, () => {
      monaco.languages.setMonarchTokensProvider(DiscoveryLanguageId, DiscoveryLanguage);
      monaco.languages.setLanguageConfiguration(DiscoveryLanguageId, richLanguageConfiguration);
      monaco.languages.registerCompletionItemProvider(DiscoveryLanguageId, getDiscoveryCompletionProvider(monaco))
    });
}

export function getDiscoveryCompletionProvider(monaco) {
  return {
    provideCompletionItems: function (model: ITextModel, position: Position, context: CompletionContext, token: CancellationToken): ProviderResult<CompletionList> {
      // get editor content before the pointer
      let text = model.getValueInRange({startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column});

      console.log('ValueInRange: ' + text);

      let antlr = parseAntlr(text);

      console.log(antlr);

      let location = findLocation(antlr.ast);

      console.log("Location: " + location);

      return null;
    }
  };
}

export function parseAntlr(code: string): {ast:DefinitionContext, errors: ITodoLangError[]} {
  const inputStream = new ANTLRInputStream(code);
  const lexer = new DiscoverySyntaxLexer(inputStream);
  lexer.removeErrorListeners()
  const todoLangErrorsListner = new TodoLangErrorListener();
  lexer.addErrorListener(todoLangErrorsListner);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new DiscoverySyntaxParser(tokenStream);
  parser.removeErrorListeners();
  parser.addErrorListener(todoLangErrorsListner);
  const ast =  parser.definition();
  const errors: ITodoLangError[]  = todoLangErrorsListner.getErrors();
  return {ast, errors};
}

export function findLocation(ctx: ParserRuleContext, path: string = '') {
  if (ctx.constructor.name != 'ExpressionContext' && ctx.constructor.name != 'ExpressionListContext')
    path += '|' + ctx.constructor.name;

  if (!ctx.children)
    return path;

  let l = ctx.children.length - 1;

  while (l >= 0 && ctx.children[l].constructor.name == 'ErrorNode')
    l--;

  if (l >= 0) {
    let child = ctx.children[l];
    path = findLocation(child as ParserRuleContext, path);
  }
  return path;
}
