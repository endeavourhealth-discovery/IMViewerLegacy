import {DiscoveryLanguage, DiscoveryLanguageId, richLanguageConfiguration} from './discovery-syntax/DiscoveryLanguage';
import {NgxMonacoEditorConfig} from 'ngx-monaco-editor';
import {DiscoverySyntaxParser} from './discovery-syntax/DiscoverySyntaxParser';
import TodoLangErrorListener, {ITodoLangError} from './discovery-syntax/DiscoveryErrorListener';
import {ANTLRInputStream, CommonTokenStream} from 'antlr4ts';
import {DiscoverySyntaxLexer} from './discovery-syntax/DiscoverySyntaxLexer';
import { CandidatesCollection, CodeCompletionCore } from 'antlr4-c3';
import { HttpClient, HttpXhrBackend, HttpParams  } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import ITextModel = monaco.editor.ITextModel;
import ProviderResult = monaco.languages.ProviderResult;
import CompletionList = monaco.languages.CompletionList;
import CompletionItem = monaco.languages.CompletionItem;
import IWordAtPosition = monaco.editor.IWordAtPosition;
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
  const httpClient = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
  const suggestions: CompletionItem[] = [];
  const range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn
  };
  for (const candidate of candidates.tokens) {
    const keyword = parser.vocabulary.getDisplayName(candidate[0]).toLocaleLowerCase();
    switch (keyword) {
      case 'quoted_string':
        suggestions.push(buildCompletionItem(keyword, `""`, range));
        break;
      case 'prefixiri':
        suggestions.push(buildCompletionItem(keyword, ':', range));
        break;
      case 'iri_label':
        suggestions.push(buildCompletionItem(keyword, 'iri', range));
        break;
      case 'subclass':
        suggestions.push(buildCompletionItem(keyword, 'SubClassOf', range));
        break;
      case '':
        suggestions.push.apply(suggestions, getContextSuggestions(keyword, word));
        break;
      default:
        suggestions.push(keyword.startsWith(`'`)
          ? buildCompletionItem(keyword, keyword.substr(1, keyword.length - 2), range)
          : buildCompletionItem(keyword, keyword, range));
    }
  }

  return suggestions;
}

export function buildCompletionItem(label: string, value: string, range: any) {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Function,
    // documentation: suggestion,
    insertText: value,
    range
  };
}

export async function getContextSuggestions(keyword: string, word: IWordAtPosition) {
  const params = new HttpParams().set('keyword', keyword).set('word', word.word);
  const httpClient = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
  return await httpClient.get<CompletionItem[]>(environment.api + 'api/suggestions', { params }).toPromise();
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
