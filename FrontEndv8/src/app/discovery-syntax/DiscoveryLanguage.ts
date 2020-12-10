import IMonarchLanguage = monaco.languages.IMonarchLanguage;
import LanguageConfiguration = monaco.languages.LanguageConfiguration;

export const DiscoveryLanguageId = 'DiscoverySyntax';
export const richLanguageConfiguration: LanguageConfiguration = {
  // If we want to support code folding, brackets ... ( [], (), {}....), we can override some properties here
  // check the doc
};
export const DiscoveryLanguage = <IMonarchLanguage> {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: 'invalid',
  keywords: [
    'COMPLETE', 'ADD', 'SubClassOf'
  ],
  typeKeywords: ['TODO'],
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [/[a-zA-Z_$][\w$]*/, {
        cases: {
          '@keywords': { token: 'keyword' },
          '@typeKeywords': { token: 'type' },
          '@default': 'identifier'
        }
      }],
      // whitespace
      { include: '@whitespace' },
      // strings for todos
      [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
      [/"/, 'string', '@string'],
    ],
    whitespace: [
      [/[ \t\r\n]+/, ''],
    ],
    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop']
    ]
  },
}
