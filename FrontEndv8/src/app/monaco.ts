import {DiscoveryLanguage, DiscoveryLanguageId, richLanguageConfiguration} from './discovery-syntax/DiscoveryLanguage';
import {NgxMonacoEditorConfig} from 'ngx-monaco-editor';
import ITextModel = monaco.editor.ITextModel;
import CompletionContext = monaco.languages.CompletionContext;
import CancellationToken = monaco.CancellationToken;
import ProviderResult = monaco.languages.ProviderResult;
import CompletionList = monaco.languages.CompletionList;
import Position = monaco.Position;
import {ConceptContext, DiscoverySyntaxParser} from './discovery-syntax/DiscoverySyntaxParser';
import TodoLangErrorListener, {ITodoLangError} from './discovery-syntax/DiscoveryErrorListener';
import {ANTLRInputStream, CommonTokenStream} from 'antlr4ts';
import {DiscoverySyntaxLexer} from './discovery-syntax/DiscoverySyntaxLexer';
import {ParserRuleContext} from 'antlr4ts/ParserRuleContext';
import { CandidatesCollection, CodeCompletionCore } from 'antlr4-c3';

export const monacoConfig: NgxMonacoEditorConfig = {
  onMonacoLoad: discoveryMonacoInit
};

export function discoveryMonacoInit() {
    monaco.languages.register({id: DiscoveryLanguageId});
    monaco.languages.onLanguage(DiscoveryLanguageId, () => {
      monaco.languages.setMonarchTokensProvider(DiscoveryLanguageId, DiscoveryLanguage);
      monaco.languages.setLanguageConfiguration(DiscoveryLanguageId, richLanguageConfiguration);
      monaco.languages.registerCompletionItemProvider(DiscoveryLanguageId, getDiscoveryCompletionProvider(monaco));
    });
}

export function getDiscoveryCompletionProvider(monaco) {
  return {
    provideCompletionItems(model: ITextModel, position: Position, context: CompletionContext, token: CancellationToken): ProviderResult<CompletionList> {
      // get editor content before the pointer
      const text = model.getValueInRange({startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column});
      const parser = getParser(text);
      const core = new CodeCompletionCore(parser as any);
      const candidates = core.collectCandidates(text.length);
      return { suggestions: getSuggestions(model, position, parser, candidates)};
    }
  };
}

export function getParser(text: string) {
    const inputStream = new ANTLRInputStream(text);
    const lexer = new DiscoverySyntaxLexer(inputStream);
    lexer.removeErrorListeners();
    const todoLangErrorListener = new TodoLangErrorListener();
    lexer.addErrorListener(todoLangErrorListener);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new DiscoverySyntaxParser(tokenStream);
    parser.removeErrorListeners();
    parser.addErrorListener(todoLangErrorListener);
    const ast = parser.concept();
    const errors: ITodoLangError[] = todoLangErrorListener.getErrors();
    return parser;
}

export function getSuggestions(model: ITextModel, position: Position, parser: DiscoverySyntaxParser, candidates: CandidatesCollection) {
  const word = model.getWordUntilPosition(position);
  const keywords: string[] = [];
  for (const candidate of candidates.tokens) {
    keywords.push(parser.vocabulary.getDisplayName(candidate[0]));
  }
  const suggestions: any[] = [];
  for (const keyword of keywords) {
    const suggestion = {
      label: keyword.toLocaleLowerCase(),
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: keyword.toLocaleLowerCase(),
      insertText: keyword.toLocaleLowerCase(),
      range: {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      }
    };
    suggestions.push(suggestion);
  }
  return suggestions;
}

export function parseAntlr(code: string): {ast: ConceptContext, errors: ITodoLangError[]} {
  const inputStream = new ANTLRInputStream(code);
  const lexer = new DiscoverySyntaxLexer(inputStream);
  lexer.removeErrorListeners();
  const todoLangErrorsListner = new TodoLangErrorListener();
  lexer.addErrorListener(todoLangErrorsListner);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new DiscoverySyntaxParser(tokenStream);
  parser.removeErrorListeners();
  parser.addErrorListener(todoLangErrorsListner);
  const ast =  parser.concept();
  const errors: ITodoLangError[]  = todoLangErrorsListner.getErrors();
  return {ast, errors};
}

export function findLocation(ctx: ParserRuleContext, path: string = '') {
  if (ctx.constructor.name != 'ExpressionContext' && ctx.constructor.name != 'ExpressionListContext') {
    path += '|' + ctx.constructor.name;
  }

  if (!ctx.children) {
    return path;
  }

  let l = ctx.children.length - 1;

  while (l >= 0 && ctx.children[l].constructor.name == 'ErrorNode') {
    l--;
  }

  if (l >= 0) {
    const child = ctx.children[l];
    path = findLocation(child as ParserRuleContext, path);
  }
  return path;
}
