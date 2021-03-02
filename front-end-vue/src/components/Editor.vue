<template>
  <div class="p-fluid p-formgrid p-grid">
    <div class="p-field p-col-12 p-md-4">
      <span class="p-float-label">
        <InputText
          class="p-inputtext-sm"
          v-model="conceptDto.iri"
          type="text"
        />
        <label for="Iri">Iri</label>
      </span>
    </div>
    <div class="p-field p-col-12 p-md-4">
      <span class="p-float-label">
        <InputText
          class="p-inputtext-sm"
          v-model="conceptDto.name"
          type="text"
        />
        <label for="Name">Name</label>
      </span>
    </div>
    <div class="p-field p-col-12 p-md-4">
      <span class="p-float-label">
        <InputText
          class="p-inputtext-sm"
          v-model="conceptDto.code"
          type="text"
        />
        <label for="Name">Code</label>
      </span>
    </div>
    <div class="p-field p-col-12">
      <span class="p-float-label">
        <Textarea
          class="p-inputtext-sm"
          v-model="conceptDto.description"
          rows="4"
        />
        <label for="address">Description</label>
      </span>
    </div>
    <div class="p-field p-col-12 p-md-2">
      <span class="p-float-label">
        <InputText
          class="p-inputtext-sm"
          v-model="conceptDto.version"
          type="text"
        />
        <label for="Version">Version</label>
      </span>
    </div>
    <div class="p-field p-col-12 p-md-5">
      <span class="p-float-label">
        <Dropdown
          class="p-inputtext-sm"
          v-model="conceptDto.status"
          :options="statusOptions"
        />
        <label>Status</label>
      </span>
    </div>
    <div class="p-field p-col-12 p-md-5">
      <span class="p-float-label">
        <Dropdown
          class="p-inputtext-sm"
          v-model="conceptDto.scheme"
          :options="statusOptions"
        />
        <label>Scheme</label>
      </span>
    </div>
    <div class="p-field p-col-12">
      <Card>
        <template #title>
          IMLang
        </template>
        <template #content>
          <div id="container" contenteditable="contenteditable"></div>
        </template>
      </Card>
    </div>
  </div>
  <div v-tooltip="tooltipMessage">
    <Button :disabled="!isValidSyntax" label="Submit" @click="submit($event)" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as monaco from "monaco-editor";
import {
  DiscoveryLanguageId,
  DiscoveryLanguage,
  richLanguageConfiguration
} from "../discovery-syntax/DiscoveryLanguage";
import { getDiscoveryCompletionProvider } from "../services/MonacoService";
import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import {
  ConceptContext,
  DiscoverySyntaxParser
} from "@/discovery-syntax/DiscoverySyntaxParser";
import ErrorListener, {
  Error
} from "@/discovery-syntax/DiscoveryErrorListener";
import { DiscoverySyntaxLexer } from "@/discovery-syntax/DiscoverySyntaxLexer";
import { ConceptDto } from "../models/ConceptDto";
import Dropdown from "primevue/dropdown";
import { ConceptStatus } from "@/models/ConceptStatus";

@Options({
  components: {
    Dropdown
  }
})
export default class Editor extends Vue {
  private conceptDto = new ConceptDto();

  get statusOptions() {
    return Object.keys(ConceptStatus).filter(f => isNaN(Number(f)));
  }

  get isValidSyntax(): boolean {
    let validation;
    try {
      validation = this.parse(this.conceptDto.definitionText);
      return !!this.conceptDto.definitionText && !validation.errors.length;
    } catch (error) {
      return false;
    }
  }

  get tooltipMessage() {
    if (!this.isValidSyntax) {
      return "Syntax is invalid";
    }
    return "";
  }

  private initMonaco() {
    monaco.languages.register({ id: DiscoveryLanguageId });
    monaco.languages.onLanguage(DiscoveryLanguageId, () => {
      monaco.languages.setMonarchTokensProvider(
        DiscoveryLanguageId,
        DiscoveryLanguage
      );
      monaco.languages.setLanguageConfiguration(
        DiscoveryLanguageId,
        richLanguageConfiguration
      );
      monaco.languages.registerCompletionItemProvider(
        DiscoveryLanguageId,
        getDiscoveryCompletionProvider()
      );
    });

    const editor = document.getElementById("container");

    if (editor) {
      monaco.editor.create(editor, {
        // value: "function hello() {\n\talert('Hello world!');\n}",
        language: "DiscoverySyntax"
      });

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      const model = monaco.editor.getModels()[0];
      model.onDidChangeContent(event => {
        that.conceptDto.definitionText = model.getValue();
        that.validate();
      });
    }
  }

  validate() {
    const ret = this.parse(this.conceptDto.definitionText);
    const model = monaco.editor.getModels()[0];
    monaco.editor.setModelMarkers(
      model,
      DiscoveryLanguageId,
      ret.errors.map(e => this.toDiagnostics(e))
    );
  }

  parse(code: string): { ast: ConceptContext; errors: Error[] } {
    const inputStream = new ANTLRInputStream(code);
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
    return { ast, errors };
  }

  toDiagnostics(error: Error): monaco.editor.IMarkerData {
    return {
      ...error,
      severity: monaco.MarkerSeverity.Error
    };
  }

  mounted() {
    this.initMonaco();
  }

  submit() {
    console.log(this.conceptDto);
  }
}
</script>

<style scoped>
#container {
  height: calc(100vh - 500px);
}

#send {
  align-self: center;
}

button.p-button {
  width: 100%;
}

.p-field {
  margin-top: 5px;
}
</style>
