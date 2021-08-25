<template>
  <SideNav />
  <div id="container">
    <Panel header="Mapping">
      <TabPanel>
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
            <div class="p-field p-col-12 p-md-6">
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
            <div class="p-field p-col-12 p-md-6">
              <label for="mappingFile">Mapping File</label>
              <FileUpload
                ref="mappingFile"
                name="demo[]"
                :customUpload="true"
                :auto="true"
                @uploader="uploadMapping"
                @clear="resetMapping"
                :preview-width="0"
                @remove="resetMapping"
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
        </div>
        <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
          <Button
            icon="pi pi-check"
            label="Submit"
            class="save-button"
            :disabled="!isValid"
            @click="submit"
          />
        </div>
      </TabPanel>
    </Panel>
    <div v-if="loading" class="loading-container">
      <ProgressSpinner />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import MappingService from "@/services/MappingService";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "Mapping",
  components: {
    SideNav
  },
  computed: {
    isValid(): boolean {
      return (
        !!this.contentFile &&
        !!this.mappingFile &&
        !!this.graph &&
        !!this.nested
      );
    }
  },
  data() {
    return {
      loading: false,
      contentFile: "",
      mappingFile: "",
      graph: "",
      nested: "",
      options: [
        { name: "Yes", value: "true" },
        { name: "No", value: "false" }
      ]
    };
  },
  methods: {
    uploadContent(event: any) {
      this.contentFile = event.files[0];
    },
    resetContent() {
      const x = this.$refs.contentFile as any;
      x.uploadedFileCount = 0;
    },
    uploadMapping(event: any) {
      this.mappingFile = event.files[0];
    },
    resetMapping() {
      const x = this.$refs.mappingFile as any;
      x.uploadedFileCount = 0;
    },
    async submit() {
      this.loading = true;
      MappingService.getMappedTTDocument(this.getFormData())
        .then(response => {
          this.loading = false;
          this.download(response);
        })
        .catch(error => {
          this.loading = false;
          this.$toast.add(
            LoggerService.error("Request failed from server", error.message)
          );
        });
    },
    download(response: any) {
      const json = JSON.stringify(response);
      const blob = new Blob([json], { type: "application/json" });
      const fileURL = URL.createObjectURL(blob);

      const fileLink = document.createElement("a");

      fileLink.href = fileURL;
      fileLink.setAttribute("download", "response.json");
      document.body.appendChild(fileLink);

      fileLink.click();
    },
    getFormData(): FormData {
      const formData = new FormData();
      formData.append("contentFile", this.contentFile);
      formData.append("mappingFile", this.mappingFile);
      formData.append("graph", this.graph);
      formData.append("nested", this.nested);
      return formData;
    }
  }
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
