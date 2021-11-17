<template>
  <Card id="container">
    <template #content>
      <Dialog header="Header" v-model:visible="joinDialog" :breakpoints="{ '960px': '75vw' }" :style="{ width: '50vw' }">
        <div>
          <p v-if="!selectedInputs.length">
            No input selected.
          </p>
          <div class="p-fluid p-formgrid p-grid" v-else>
            <div class="p-col">{{ selectedInputs?.[0]?.input?.name }}</div>
            <div class="p-col">{{ selectedInputs?.[1]?.input?.name }}</div>
          </div>
        </div>
        <template #footer>
          <Button label="Cancel" class="p-button-text" icon="pi pi-times" @click="toggleJoinDialog" />
          <Button label="Join" icon="pi pi-check" @click="toggleJoinDialog" />
        </template>
      </Dialog>
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-6 p-md-6">
          <div class="p-col">
            <DataTable :value="inputs" v-model:selection="selectedInputs" responsiveLayout="scroll">
              <template #header>
                <div class="p-d-flex p-jc-between p-ai-center">
                  <h5 class="p-m-0">Input upload</h5>
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
                  {{ slotProps.data.input.name }}
                </template>
              </Column>
              <Column field="size" header="Size">
                <template #body="slotProps">
                  {{ slotProps.data.input.size }}
                </template>
              </Column>
              <Column field="lastModified" header="Updated">
                <template #body="slotProps">
                  {{ slotProps.data.input.lastModified }}
                </template>
              </Column>
              <Column field="preview-save-delete">
                <template #body="slotProps">
                  <Button icon="pi pi-eye" class="p-button-rounded p-button-info p-mr-2" @click="preview(slotProps.data)" />
                  <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="removeInput(slotProps.data)" />
                </template>
              </Column>
            </DataTable>
          </div>
        </div>

        <div class="p-col-6 p-md-6">
          <vue-json-pretty id="json-viewer" :path="'res'" :data="selected.inputDisplayJson"> </vue-json-pretty>
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
import TransformInputUpload from "../../models/transform/TransformInputUpload";
import { defineComponent, PropType } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

export default defineComponent({
  name: "TransformInputProcessing",
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
      inputs: [] as TransformInputUpload[],
      selectedInputs: [] as TransformInputUpload[],
      selected: {} as TransformInputUpload,
      joinDialog: false,
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
      event.files.forEach(async (input: any) => {
        const inputJson = this.getJsonFromCsv(await this.convertFileToString(input));
        const inputDisplayJson = inputJson;
        inputDisplayJson.length = 10;
        this.inputs.push({
          input: input,
          inputJson: inputJson,
          inputDisplayJson: inputDisplayJson
        });
      });
      this.resetInputs();
    },
    removeInput(input: TransformInputUpload) {
      this.inputs = this.inputs.filter(upload => input.input.name !== upload.input.name);
    },
    resetInputs() {
      const x = this.$refs.input as any;
      x.files = [];
    },
    nextPage() {
      this.$emit("next-page", {
        formData: {
          input: this.selected.input,
          inputJson: this.selected.inputJson,
          inputDisplayJson: this.selected.inputDisplayJson
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
  height: calc(100vh - 25rem);
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
