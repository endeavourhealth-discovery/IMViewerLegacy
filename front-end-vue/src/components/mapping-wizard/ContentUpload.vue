<template>
  <Card id="container">
    <template #title> New predicates that will be created </template>
    <template #content>
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-12 p-md-4">
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
        <div class="p-field p-col-12 p-md-4">
          <label for="nested">Map Document (Optional)</label>
          <Dropdown
            v-model="selectedMapDocument"
            :options="mapDocumentOptions"
            optionLabel="name"
            placeholder="Choose from library"
          />
        </div>
        <div class="p-field p-col-6 p-md-6">
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
        <div class="p-field p-col-6 p-md-6">
          <label for="mapDocument">Map Document (Optional)</label>
          <FileUpload
            ref="mapDocument"
            name="demo[]"
            :customUpload="true"
            :auto="true"
            @uploader="uploadMapDocument"
            @clear="resetMapDocument"
            :preview-width="0"
            @remove="resetMapDocument"
            accept=".ttl"
            chooseLabel="Select"
            :fileLimit="1"
          >
            <template #empty>
              <p>Drag and drop files here to upload.</p>
            </template>
          </FileUpload>
        </div>
      </div>
    </template>
  </Card>

  <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
    <Button label="Next" @click="nextPage" :disabled="!isValid" />
  </div>
</template>

<script lang="ts">
import { MappingFormObject } from "@/models/mapping/MappingFormObject";
import MappingService from "@/services/MappingService";
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
      mapDocument: "",
      mapDocumentName: "",
      mapDocumentString: "",
      graph: "",
      nested: "",
      selectedMapDocument: "",
      mapDocumentOptions: [] as any[],
      options: [
        { name: "Yes", value: "true" },
        { name: "No", value: "false" },
      ],
    };
  },
  async mounted() {
    this.contentFile = this.formObject.contentFile;
    this.contentFileName = this.formObject.contentFileName;
    this.contentFileType = this.formObject.contentFileType;
    this.mapDocument = this.formObject.mapDocument;
    this.mapDocumentName = this.formObject.mapDocumentName;
    this.mapDocumentString = this.formObject.mapDocumentString;
    this.graph = this.formObject.graph;
    this.nested = this.formObject.nested;
    this.selectedMapDocument = this.formObject.selectedMapDocument;
    this.mapDocumentOptions = await this.getMapDocumentOptions();
  },
  methods: {
    async getMapDocumentOptions() {
      return (await MappingService.getMapDocuments()).map((mapDocument) => {
        return { value: mapDocument.dbid, name: mapDocument.filename };
      });
    },
    async getSelectedMapDocumentContent() {
      const document = (
        await MappingService.getMapDocument(
          (this.selectedMapDocument as any).value
        )
      ).document;
      return await new Blob([Buffer.from(document, "base64")]).text();
    },
    async convertFileToString(file: any) {
      return await (file as Blob).text();
    },
    uploadContent(event: any) {
      this.contentFileName = event.files[0].name;
      this.contentFileType = event.files[0].type;
      this.contentFile = event.files[0];
    },
    async uploadMapDocument(event: any) {
      this.mapDocument = event.files[0];
      this.mapDocumentName = event.files[0].name;
      this.mapDocumentString = await this.convertFileToString(this.mapDocument);
      this.selectedMapDocument = "";
    },
    resetMapDocument() {
      const x = this.$refs.mapDocument as any;
      x.uploadedFileCount = 0;
    },
    resetContent() {
      const x = this.$refs.contentFile as any;
      x.uploadedFileCount = 0;
    },
    async nextPage() {
      if (this.selectedMapDocument) {
        this.mapDocumentString = await this.getSelectedMapDocumentContent();
        this.mapDocumentName = (this.selectedMapDocument as any).name;
        (this.mapDocument as any) = new Blob([this.mapDocumentString]);
      }
      this.$emit("next-page", {
        formData: {
          contentFile: this.contentFile,
          contentFileName: this.contentFileName,
          contentFileType: this.contentFileType,
          mapDocument: this.mapDocument,
          mapDocumentName: this.mapDocumentName,
          mapDocumentString: this.mapDocumentString,
          graph: this.graph,
          nested: this.nested,
        },
        pageIndex: !this.mapDocument ? 0 : 1,
      });
    },
  },
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
