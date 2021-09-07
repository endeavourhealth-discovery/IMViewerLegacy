<template>
  <div class="panel-content">
    <Card>
      <template #title> MapDocument.ttl </template>
      <template #content>
        <!-- <Editor
          v-if="!editMode"
          readonly="true"
          v-model="mapDocumentString"
          editorStyle="height: 320px"
        >
          <template #toolbar>
            <span class="ql-formats"> Turtle map </span>
          </template>
        </Editor>

        <Editor v-else v-model="mapDocumentString" editorStyle="height: 320px">
          <template #toolbar>
            <span class="ql-formats"> Turtle map </span>
          </template>
        </Editor> -->

        <div id="monaco-container"></div>

        <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
          <Button
            v-if="!editMode"
            class="p-button-secondary"
            icon="pi pi-pencil"
            @click="editMode = true"
          />
          <Button
            v-else
            class="p-button-success"
            icon="pi pi-check"
            @click="editMode = false"
          />
        </div>
      </template>
    </Card>
  </div>
  <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
    <Button label="Back" @click="prevPage" />
    <Button label="Download" @click="download" />
    <Button label="Next" @click="nextPage" />
  </div>
</template>

<script lang="ts">
import * as monaco from "monaco-editor";
import { defineComponent, PropType } from "vue";
import { MappingFormObject } from "@/models/mapping/MappingFormObject";

export default defineComponent({
  name: "DocumentValidation",
  props: {
    formObject: {
      type: Object as PropType<MappingFormObject>,
      required: true,
    },
  },
  computed: {},
  data() {
    return {
      code: "code",
      editMode: false,
      mapDocumentString: "",
      pageIndex: 2,
    };
  },
  beforeMount() {
    this.mapDocumentString = this.formObject.mapDocumentString;
  },
  mounted() {
    monaco.editor.create(document.getElementById("monaco-container")!, {
      value: this.formObject.mapDocumentString,
      language: "javascript",
    });
  },
  methods: {
    download() {
      const blob = new Blob([this.mapDocumentString!]);
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
          mapDocument: new Blob([this.mapDocumentString]),
        },
        pageIndex: this.pageIndex,
      });
    },
    prevPage() {
      this.$emit("prev-page", {
        pageIndex: this.pageIndex,
      });
    },
  },
});
</script>

<style scoped>
#container {
  margin: 1rem;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
}

.loading-container {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
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
  height: 35rem;
}
</style>
