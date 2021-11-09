<template>
  <Card id="container">
    <template #title> Upload </template>
    <template #content>
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-6 p-md-6">
          <label for="input">Input File</label>
          <FileUpload
            ref="input"
            name="demo[]"
            :customUpload="true"
            :auto="true"
            @uploader="uploadInputs"
            @clear="resetInputs"
            :preview-width="0"
            @remove="resetInputs"
            accept=".txt, .csv, .tsv, .json"
            chooseLabel="Select"
          >
            <template #empty>
              <p>Drag and drop files here to upload.</p>
            </template>
          </FileUpload>
        </div>
        <div class="p-field p-col-6 p-md-6">
          <label for="dataModel">Data model (Optional)</label>
          <FileUpload
            ref="dataModel"
            name="demo[]"
            :customUpload="true"
            :auto="true"
            @uploader="uploadDataModel"
            @clear="resetDataModel"
            :preview-width="0"
            @remove="resetDataModel"
            accept=".json"
            chooseLabel="Select"
            :fileLimit="1"
          >
            <template #empty>
              <p>Drag and drop files here to upload.</p>
            </template>
          </FileUpload>
        </div>
      </div>
      <div class="p-fluid p-formgrid p-grid">
        <!-- <div class="p-col-6 p-md-6">
          <DataTable :value="products" responsiveLayout="scroll">
            <Column field="code" header="Code"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="category" header="Category"></Column>
            <Column field="quantity" header="Quantity"></Column>
          </DataTable>
        </div> -->
        <div class="p-col-6 p-md-6">
          <vue-json-pretty id="json-viewer" :path="'res'" :data="inputDisplayJson"> </vue-json-pretty>
        </div>
        <div class="p-col-6 p-md-6">
          <vue-json-pretty id="json-viewer" :path="'res'" :data="dataModelJson"> </vue-json-pretty>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
        <Button label="Next" @click="nextPage" />
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import TransformFormObject from "../../models/transform/TransformFormObject";
import { defineComponent, PropType } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

export default defineComponent({
  name: "TransformUpload",
  components: {
    VueJsonPretty
  },
  emits: ["next-page", "prev-page"],
  props: {
    formObject: {
      type: Object as PropType<TransformFormObject>,
      required: true
    }
  },
  computed: {},
  data() {
    return {
      pageIndex: 0,
      input: {} as File,
      inputJson: [] as any[],
      inputDisplayJson: [] as any[],
      dataModel: {} as File,
      dataModelJson: {}
    };
  },
  mounted() {
    this.input = this.formObject.input;
    this.dataModel = this.formObject.dataModel;
  },
  methods: {
    async convertFileToString(file: any) {
      return await (file as Blob).text();
    },
    getJsonFromCsv(csv: string): any[] {
      const lines = csv.split("\n");
      const jsonArray = [] as any[];
      const headers = lines[0].split(",").map(header => header.replaceAll('"', ""));

      for (var i = 1; i < lines.length; i++) {
        const obj = {} as any;
        const currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j] ? currentline[j].replaceAll('"', "") : "";
        }

        jsonArray.push(obj);
      }

      return jsonArray;
    },
    async uploadInputs(event: any) {
      this.input = event.files[0];
      this.inputJson = this.getJsonFromCsv(await this.convertFileToString(this.input));
      this.inputDisplayJson = this.inputJson;
      this.inputDisplayJson.length = 10;
    },
    async uploadDataModel(event: any) {
      this.dataModel = event.files[0];
      this.dataModelJson = JSON.parse(await this.convertFileToString(this.dataModel));
    },
    resetDataModel() {
      const x = this.$refs.dataModel as any;
      x.uploadedFileCount = 0;
    },
    resetInputs() {
      const x = this.$refs.input as any;
      x.uploadedFileCount = 0;
    },
    nextPage() {
      this.$emit("next-page", {
        formData: {
          input: this.input,
          inputJson: this.inputJson,
          inputDisplayJson: this.inputDisplayJson,
          dataModel: this.dataModel,
          dataModelJson: this.dataModelJson
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
  margin: 1.5rem;
  height: calc(100vh - 16rem);
  width: 98%;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
}

#json-viewer {
  height: calc(100vh - 43rem);
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
