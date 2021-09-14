<template
  >
  <div class="panel-content">
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12 p-md-8">
        <label for="graph">Graph</label>
        <InputText id="graph" type="text" v-model="graph" />
      </div>
      <div class="p-field p-col-12 p-md-4">
        <label for="nested">Nested</label>
        <Dropdown
          inputId="nested"
          v-model="nested"
          :options="options"
          optionLabel="name"
          optionValue="value"
          placeholder="Is content nested"
        />
      </div>
      <div class="p-field p-col-12 p-md-12">
        <label for="contentFile">Content File</label>
        <FileUpload
          ref="contentFile"
          name="demo[]"
          :customUpload="true"
          :auto="true"
          @uploader="uploadContent"
          @clear="resetContent"
          :preview-width="0"
          @remove="resetContent"
          accept=".txt, .csv, .tsv, .json"
          chooseLabel="Select"
          :fileLimit="1"
        >
          <template #empty>
            <p>Drag and drop files here to upload.</p>
          </template>
        </FileUpload>
      </div>
    </div>
  </div>
  <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
    <Button label="Next" @click="nextPage" />
  </div>
</template>

<script lang="ts">
import { MappingFormObject } from "@/models/mapping/MappingFormObject";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "ContentUpload",
  emits: ["next-page", "prev-page"],
  props: {
    formObject: {
      type: Object as PropType<MappingFormObject>,
      required: true,
    },
  },
  computed: {
    isValid(): boolean {
      return !!this.contentFile && !!this.graph && !!this.nested;
    },
  },
  data() {
    return {
      contentFile: "",
      contentFileName: "",
      contentFileType: "",
      graph: "",
      nested: "",
      options: [
        { name: "Yes", value: "true" },
        { name: "No", value: "false" },
      ],
    };
  },
  methods: {
    uploadContent(event: any) {
      console.log(event.files[0].type);
      this.contentFileName = event.files[0].name;
      this.contentFileType = event.files[0].type;
      this.contentFile = event.files[0];
    },
    resetContent() {
      const x = this.$refs.contentFile as any;
      x.uploadedFileCount = 0;
    },
    nextPage() {
      this.$emit("next-page", {
        formData: {
          contentFile: this.contentFile,
          contentFileName: this.contentFileName,
          contentFileType: this.contentFileType,
          graph: this.graph,
          nested: this.nested,
        },
        pageIndex: 0,
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
</style>
