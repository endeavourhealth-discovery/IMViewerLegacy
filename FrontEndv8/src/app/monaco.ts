import {DiscoveryLanguage, DiscoveryLanguageId, richLanguageConfiguration} from './discovery-syntax/DiscoveryLanguage';
import {NgxMonacoEditorConfig} from 'ngx-monaco-editor';
import {DiscoverySyntaxParser} from './discovery-syntax/DiscoverySyntaxParser';
import TodoLangErrorListener, {ITodoLangError} from './discovery-syntax/DiscoveryErrorListener';
import {ANTLRInputStream, CommonTokenStream} from 'antlr4ts';
import {DiscoverySyntaxLexer} from './discovery-syntax/DiscoverySyntaxLexer';
import { CandidatesCollection, CodeCompletionCore } from 'antlr4-c3';
import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import ITextModel = monaco.editor.ITextModel;
import IWordAtPosition = monaco.editor.IWordAtPosition;
import ProviderResult = monaco.languages.ProviderResult;
import CompletionList = monaco.languages.CompletionList;
import Position = monaco.Position;

export const monacoConfig: NgxMonacoEditorConfig = {
  onMonacoLoad: discoveryMonacoInit
};

export function discoveryMonacoInit() {
    monaco.languages.register({id: DiscoveryLanguageId});
    monaco.languages.onLanguage(DiscoveryLanguageId, () => {
      monaco.languages.setMonarchTokensProvider(DiscoveryLanguageId, DiscoveryLanguage);
      monaco.languages.setLanguageConfiguration(DiscoveryLanguageId, richLanguageConfiguration);
      monaco.languages.registerCompletionItemProvider(DiscoveryLanguageId, getDiscoveryCompletionProvider());
    });
}

export function getDiscoveryCompletionProvider() {
  return {
    provideCompletionItems(model: ITextModel, position: Position): ProviderResult<CompletionList> {
      // get editor content before the pointer
      const text = model.getValueInRange({startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column});
      const parser = getParser(text);
      const core = new CodeCompletionCore(parser as any);
      const candidates = core.collectCandidates(text.length);
      return { suggestions: getSuggestions(model, position, parser, candidates)};
    }
  };
}

export function getSuggestions(model: ITextModel, position: Position, parser: DiscoverySyntaxParser, candidates: CandidatesCollection) {
  const word = model.getWordUntilPosition(position);
  const suggestions: string[] = [];
  const httpClient = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
  for (const candidate of candidates.tokens) {
    const keyword = parser.vocabulary.getDisplayName(candidate[0]).toLocaleLowerCase();
    switch (keyword) {
      // TODO
      // case where context suggestions are needed
      // getContextSuggestions and add to suggestions list
      case 'quoted_string':
        suggestions.push(`""`);
        break;
      case 'prefixiri':
        suggestions.push(':');
        break;
      case 'iri_label':
        suggestions.push('iri');
        break;
      case 'subclass':
        suggestions.push('SubClassOf');
        break;
      case '':
      default:
        suggestions.push(keyword.startsWith(`'`) ? keyword.substr(1, keyword.length - 2) : keyword);
    }
  }

  return buildCompletionItemList(suggestions, position, word);
}

export function buildCompletionItemList(suggestions: string[], position: Position, word: IWordAtPosition) {
  const completionList: any[] = [];
  for (const suggestion of suggestions) {
    const completionItem = {
      label: suggestion,
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: suggestion,
      insertText: suggestion,
      range: {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      }
    };
    completionList.push(completionItem);
  }
  return completionList;
}

export function getContextSuggestions() {
  let contextSuggestions;
  const httpClient = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
  httpClient.get<string[]>(environment.api + 'api/concept/search').subscribe(
    (suggestions) => {
      contextSuggestions = suggestions;
      console.log(contextSuggestions);
    },
    (error) => console.log(error)
  );
  console.log(contextSuggestions);
  // return contextSuggestions;
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
