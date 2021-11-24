<template>
  <Card id="container">
    <template #content>
      <JsonPathSelectionDialog
        :input="selected"
        :jsonSelectDialog="jsonSelectDialog"
        @jsonSelect="jsonSelect($event)"
        @closeJsonSelectDialog="closeJsonSelectDialog($event)"
      />

      <JoinInstructionsDialog
        :selectedInputs="selectedInputs"
        :joinDialog="joinDialog"
        @updateJoinInstructions="updateJoinInstructions($event)"
        @closeJoinDialog="closeJoinDialog($event)"
      />
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-6 p-md-6">
          <div class="p-col">
            <DataTable :value="inputs" v-model:selection="selectedInputs" responsiveLayout="scroll">
              <template #header>
                <div class="p-d-flex p-jc-between p-ai-center">
                  <h5 class="p-m-0">File upload</h5>
                  <div class="p-fluid p-formgrid p-grid">
                    <div class="p-col"><Button label="Join..." @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" /></div>
                    <Menu id="overlay_menu" ref="menu" :model="actionMenu" :popup="true" />
                    <div class="p-col">
                      <FileUpload
                        mode="basic"
                        ref="input"
                        name="demo[]"
                        :customUpload="true"
                        :auto="true"
                        @uploader="uploadInputs"
                        @clear="resetInputs"
                        @remove="resetInputs"
                        accept=".txt, .csv, .tsv, .json"
                        chooseLabel="Upload"
                        :multiple="true"
                      />
                    </div>
                  </div>
                </div>
              </template>
              <template #empty>
                No files uploaded.
              </template>
              <template #loading>
                Loading files. Please wait.
              </template>
              <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
              <Column field="file" header="File">
                <template #body="slotProps">
                  {{ slotProps.data.inputFile.name }}
                </template>
              </Column>
              <Column field="lastModified" header="Updated">
                <template #body="slotProps">
                  {{ getDateFromMillis(slotProps.data.inputFile.lastModified) }}
                </template>
              </Column>
              <Column field="preview-save-delete">
                <template #body="slotProps">
                  <Button icon="pi pi-download" class="p-button-rounded p-button-info p-mr-2" @click="preview(slotProps.data)" />
                  <Button icon="pi pi-cog" class="p-button-rounded p-button-info p-mr-2" @click="openJsonSelectDialog(slotProps.data)" />
                  <Button icon="pi pi-eye" class="p-button-rounded p-button-info p-mr-2" @click="preview(slotProps.data)" />
                  <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="removeInput(slotProps.data)" />
                </template>
              </Column>
            </DataTable>
          </div>
        </div>

        <div class="p-col-6 p-md-6">
          <TabView>
            <TabPanel header="File display">
              <vue-json-pretty id="json-viewer" :path="'res'" :data="selected.inputDisplayJson"> </vue-json-pretty>
            </TabPanel>
            <TabPanel header="Data model">
              <vue-json-pretty id="json-viewer" :path="'res'" :data="selected.inputDisplayJson"> </vue-json-pretty>
            </TabPanel>
          </TabView>
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
import TransformFormObject from "../../../models/transform/TransformFormObject";
import { TransformInputUpload, JoinInstruction } from "../../../models/transform/TransformInputUpload";
import TransformService from "../../../services/TransformService";
import { defineComponent, PropType } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { isArrayHasLength, isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import JoinInstructionsDialog from "./JoinInstructionsDialog.vue";
import JsonPathSelectionDialog from "./JsonPathSelectionDialog.vue";

export default defineComponent({
  name: "TransformInputProcessing",
  components: {
    VueJsonPretty,
    JoinInstructionsDialog,
    JsonPathSelectionDialog
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
      inputs: [] as TransformInputUpload[],
      selectedInputs: [] as TransformInputUpload[],
      selected: {} as TransformInputUpload,
      joinInstructions: [{}] as JoinInstruction[],
      nestedOptions: ["flat", "nested"],
      joinDialog: false,
      jsonSelectDialog: false,
      actionMenu: [
        {
          label: "Join",
          command: () => {
            this.toggleJoinDialog();
          }
        },
        { label: "Auto Join", command: () => console.log("Auto Join") }
      ]
    };
  },
  methods: {
    openJsonSelectDialog(input: TransformInputUpload) {
      this.selected = input;
      this.jsonSelectDialog = true;
    },
    closeJsonSelectDialog() {
      this.jsonSelectDialog = false;
    },
    closeJoinDialog() {
      this.joinDialog = !this.joinDialog;
    },
    jsonSelect(newInput: TransformInputUpload) {
      this.selected = newInput;
    },
    updateJoinInstructions(newInput: TransformInputUpload[]) {
      this.inputs.push(newInput[0]);
    },
    getDateFromMillis(millis: number) {
      const date = new Date(millis);
      return date.toLocaleString();
    },
    removeJoin(removedJoin: JoinInstruction) {
      this.joinInstructions = this.joinInstructions.filter(
        join =>
          join.dataA !== removedJoin.dataA &&
          join.dataB !== removedJoin.dataB &&
          join.propertyA !== removedJoin.propertyA &&
          join.propertyB !== removedJoin.propertyB &&
          join.joinType !== removedJoin.joinType
      );
    },
    addJoin() {
      this.joinInstructions.push({} as JoinInstruction);
    },
    toggle(event: any) {
      const x = this.$refs.menu as any;
      x.toggle(event);
    },

    toggleJoinDialog() {
      this.joinDialog = !this.joinDialog;
    },

    preview(file: TransformInputUpload) {
      this.selected = file;
    },

    //move to nodets
    async convertFileToString(file: any) {
      return await (file as Blob).text();
    },

    //move to nodets
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
      event.files.forEach(async (input: File) => {
        const inputJson =
          input.type === "text/csv"
            ? this.getJsonFromCsv(await this.convertFileToString(input))
            : JSON.parse(await this.convertFileToString(input))["Relationships"];
        const inputDisplayJson = inputJson;
        if (inputDisplayJson.length > 10) {
          inputDisplayJson.length = 10;
        }

        this.inputs.push({
          id: input.name + input.lastModified,
          inputFile: input,
          inputJson: inputJson,
          inputDisplayJson: inputDisplayJson
        });
      });
      this.resetInputs();
    },
    removeInput(input: TransformInputUpload) {
      this.inputs = this.inputs.filter(upload => input.id !== upload.id);
    },
    resetInputs() {
      const x = this.$refs.input as any;
      x.files = [];
    },
    nextPage() {
      this.$emit("next-page", {
        formData: {
          input: this.selectedInputs[0].inputFile,
          inputJson: this.selectedInputs[0].inputJson,
          inputDisplayJson: this.selectedInputs[0].inputDisplayJson
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

.join-instruction {
  margin: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #dee2e6;
}

#remove-join {
  position: relative;
  top: -20px;
  right: -99%;
}

#json-viewer {
  height: calc(100vh - 30rem);
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
