import {DiscoveryLanguage, DiscoveryLanguageId, richLanguageConfiguration} from './discovery-syntax/DiscoveryLanguage';
import {NgxMonacoEditorConfig} from 'ngx-monaco-editor';

export const monacoConfig: NgxMonacoEditorConfig = {
  onMonacoLoad: discoveryMonacoInit
}

export function discoveryMonacoInit() {
    monaco.languages.register({id: DiscoveryLanguageId});
    monaco.languages.onLanguage(DiscoveryLanguageId, () => {
      monaco.languages.setMonarchTokensProvider(DiscoveryLanguageId, DiscoveryLanguage);
      monaco.languages.setLanguageConfiguration(DiscoveryLanguageId, richLanguageConfiguration);
    });
}
