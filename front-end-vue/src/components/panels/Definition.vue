<template>
  <div id="container" class="definition"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as monaco from "monaco-editor";
import LoggerService from "@/services/LoggerService";
import {
  DiscoveryLanguage,
  DiscoveryLanguageId,
  richLanguageConfiguration
} from "@/discovery-syntax/DiscoveryLanguage";
@Options({
  name: "Definition",
  components: {},
  props: ["definition", "resize"],
  watch: {
    async definition() {
      const model = monaco.editor.getModels()[0];
      model.setValue(this.filteredDefinition);
    },
    async resize() {
      this.destroyMonaco();
      this.initEditor();
    }
  }
})
export default class Definition extends Vue {
  definition!: string;
  resize!: boolean;

  get filteredDefinition() {
    const lines = this.definition.split(";");
    const filteredLines = lines.filter(
      line => !line?.startsWith("\nName") && !line?.startsWith("\ndescription")
    );
    return filteredLines.join("");
  }

  editor = {};

  initEditor() {
    try {
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
      });
      const html = document.documentElement;
      const currentFontSize = parseFloat(
        window.getComputedStyle(html, null).getPropertyValue("font-size")
      );
      const container = document.getElementById("container");
      if (container) {
        this.editor = monaco.editor.create(container, {
          value: this.filteredDefinition,
          language: "DiscoverySyntax",
          readOnly: true,
          lineNumbers: "off",
          glyphMargin: false,
          automaticLayout: true,
          minimap: {
            enabled: false
          },
          fontSize: currentFontSize
        });
      } else {
        LoggerService.error(undefined, "monaco container not found");
      }
    } catch (error) {
      this.$toast.add(
        LoggerService.error("Monaco editor initialisation failed", error)
      );
    }
  }

  destroyMonaco() {
    monaco.editor.getModels().forEach(model => model.dispose());
    const container = document.getElementById("container");
    if (container) {
      container.removeAttribute("data-keybinding-context");
      container.removeAttribute("data-mode-id");
    }
  }

  mounted() {
    this.initEditor();
  }

  beforeUnmount() {
    this.destroyMonaco();
  }
}
</script>

<style>
.definition .monaco-editor .overflow-guard {
  border: solid 1px #dee2e6;
  border-radius: 3px;
}
</style>
