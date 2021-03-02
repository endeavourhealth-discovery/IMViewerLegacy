import * as monaco from "monaco-editor";
import ITextModel = monaco.editor.ITextModel;
import CompletionList = monaco.languages.CompletionList;
import CompletionItem = monaco.languages.CompletionItem;
import Position = monaco.Position;
import ErrorListener, {
  Error,
} from "../discovery-syntax/DiscoveryErrorListener";
import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { DiscoverySyntaxLexer } from "../discovery-syntax/DiscoverySyntaxLexer";
import { CandidatesCollection, CodeCompletionCore } from "antlr4-c3";
import { DiscoverySyntaxParser } from "../discovery-syntax/DiscoverySyntaxParser";
import SuggestionService from "../services/SuggestionService";

function buildCompletionItem(label: string, value: string, range: any) {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Function,
    // documentation: suggestion,
    insertText: value,
    range,
  };
}

function getParser(text: string) {
  const inputStream = new ANTLRInputStream(text);
  const lexer = new DiscoverySyntaxLexer(inputStream);
  lexer.removeErrorListeners();
  const todoLangErrorListener = new ErrorListener();
  lexer.addErrorListener(todoLangErrorListener);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new DiscoverySyntaxParser(tokenStream);
  parser.removeErrorListeners();
  parser.addErrorListener(todoLangErrorListener);
  const ast = parser.concept();
  const errors: Error[] = todoLangErrorListener.getErrors();
  return parser;
}

async function getSuggestions(
  model: ITextModel,
  position: Position,
  parser: DiscoverySyntaxParser,
  candidates: CandidatesCollection
) {
  const word = model.getWordUntilPosition(position);
  const suggestions: CompletionItem[] = [];
  const range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn,
  };
  for (const candidate of candidates.tokens) {
    const keyword = parser.vocabulary
      .getDisplayName(candidate[0])
      .toLocaleLowerCase();
    switch (keyword) {
      case "quoted_string": {
        const conceptReferences = await SuggestionService.getIriSuggestions(
          keyword,
          word.word
        );
        conceptReferences.forEach((conceptReference) => {
          suggestions.push(
            buildCompletionItem(
              conceptReference.name,
              conceptReference.iri,
              range
            )
          );
        });
        suggestions.push(buildCompletionItem(keyword, `""`, range));
        break;
      }
      case "prefixiri":
        suggestions.push(buildCompletionItem(keyword, ":", range));
        break;
      case "iri_label":
        suggestions.push(buildCompletionItem(keyword, "iri", range));
        break;
      case "subclass":
        suggestions.push(buildCompletionItem(keyword, "SubClassOf", range));
        break;
      default:
        suggestions.push(
          keyword.startsWith(`'`)
            ? buildCompletionItem(
                keyword,
                keyword.substr(1, keyword.length - 2),
                range
              )
            : buildCompletionItem(keyword, keyword, range)
        );
    }
  }
  return { suggestions };
}

export function getDiscoveryCompletionProvider() {
  return {
    provideCompletionItems(
      model: ITextModel,
      position: Position
    ): monaco.Thenable<CompletionList> {
      // get editor content before the pointer
      const text = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      const parser = getParser(text);
      const core = new CodeCompletionCore(parser as any);
      const candidates = core.collectCandidates(text.length);
      return getSuggestions(model, position, parser, candidates);
    },
  };
}
