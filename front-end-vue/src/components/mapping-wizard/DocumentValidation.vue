<template>
  <Card id="container">
    <template #title> MapDocument.ttl </template>
    <template #content>
      <div id="monaco-container"></div>
    </template>
  </Card>
  <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
    <Button label="Back" @click="prevPage" />
    <Button label="Download" @click="download" />
    <Button label="Next" @click="nextPage" :disabled="!valid" />
  </div>
</template>

<script lang="ts">
import * as monaco from "monaco-editor";
import { defineComponent, PropType } from "vue";
import { MappingFormObject } from "@/models/mapping/MappingFormObject";
import MappingService from "@/services/MappingService";
import { MapDocumentError } from "@/models/mapping/MapDocumentError";

export default defineComponent({
  name: "DocumentValidation",
  emits: ["next-page", "prev-page"],
  props: {
    formObject: {
      type: Object as PropType<MappingFormObject>,
      required: true
    }
  },
  computed: {
    valid(): boolean {
      return !this.error.message;
    }
  },
  data() {
    return {
      mapDocumentString: "",
      pageIndex: 2,
      error: {} as MapDocumentError
    };
  },
  async mounted() {
    this.mapDocumentString = this.formObject.mapDocumentString;
    this.initMonaco();
  },
  beforeUnmount() {
    monaco.editor.getModels()[0].dispose();
  },
  methods: {
    async initMonaco() {
      monaco.editor.create(document.getElementById("monaco-container")!, {
        value: this.formObject.mapDocumentString,
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false
      });

      monaco.editor.getModels()[0].onDidChangeContent(async () => {
        this.mapDocumentString = monaco.editor.getModels()[0].getValue();
        const model = monaco.editor.getModels()[0];
        this.error = await MappingService.getMapDocumentError(this.getFormData());
        const lineContent = this.error.lineNumber ? model.getLineContent(this.error.lineNumber) : model.getLineContent(model.getLineCount());
        monaco.editor.setModelMarkers(model, "owner", [
          {
            startLineNumber: this.error.lineNumber || model.getLineCount(),
            startColumn: 0,
            endLineNumber: this.error.lineNumber || model.getLineCount(),
            endColumn: lineContent.length + 1,
            message: this.error.message,
            severity: monaco.MarkerSeverity.Error
          }
        ]);
      });
    },
    getFormData(): FormData {
      const formData = new FormData();
      formData.append("mapDocument", new Blob([this.mapDocumentString]));
      return formData;
    },
    download() {
      const blob = new Blob([this.mapDocumentString]);
      const fileURL = URL.createObjectURL(blob);

      const fileLink = document.createElement("a");

      fileLink.href = fileURL;
      fileLink.setAttribute("download", "map.ttl");
      document.body.appendChild(fileLink);

      fileLink.click();
    },
    nextPage() {
      this.$emit("next-page", {
        formData: {
          mapDocumentString: this.mapDocumentString,
          mapDocument: new Blob([this.mapDocumentString])
        },
        pageIndex: this.pageIndex
      });
    },
    prevPage() {
      this.$emit("prev-page", {
        pageIndex: this.pageIndex
      });
    }
  }
});
</script>

<style scoped>
#container {
  margin: 1rem;
  height: calc(100vh - 19rem);
  width: 98%;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
}

#button-bar {
  padding: 0 2rem 1rem 0;
  gap: 0.5rem;
}

.p-card {
  box-shadow: unset;
}

#monaco-container {
  width: 100%;
  height: calc(100vh - 24rem);
}
</style>
