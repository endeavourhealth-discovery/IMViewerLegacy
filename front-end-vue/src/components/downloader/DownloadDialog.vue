<template>
  <Dialog
    v-model:visible="showDialog"
    :modal="true"
    :closable="false"
    :maximizable="true"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3>Download Concept</h3>
    </template>
    <div id="content" class="p-d-flex p-flex-column p-jc-center p-ai-center">
      <SelectButton
        class="format-container"
        v-model="format"
        :options="formatOptions"
        datakey="value"
        optionLabel="name"
      />
      <div
        class="options-container p-d-flex p-flex-row p-flex-wrap p-jc-around"
      >
        <div class="checkbox-label">
          <Checkbox
            id="children"
            :binary="true"
            value="Include children"
            v-model="children"
          />
          <label class="label" for="children">Include Children</label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            id="properties"
            :binary="true"
            value="Include properties"
            v-model="properties"
          />
          <label class="label" for="properties">Include properties</label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            id="members"
            :binary="true"
            value="Include members"
            v-model="members"
          />
          <label class="label" for="members">Include members</label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            id="parents"
            :binary="true"
            value="Include parents"
            v-model="parents"
          />
          <label class="label" for="parents">Include parents</label>
        </div>
      </div>
      <div class="download-button-container p-d-flex p-flex-row p-jc-around">
        <Button
          label="Download Concept"
          icon="pi pi-download"
          class="p-button-primary button-download button-left"
          @click="downloadConcept"
        />
      </div>
    </div>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="p-button-secondary"
        @click="closeDownloadDialog"
      />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ConceptService from "@/services/ConceptService";
import LoggerService from "@/services/LoggerService";

@Options({
  name: "DownloadDialog",
  props: ["concept", "showDialog"]
})
export default class DownloadDialog extends Vue {
  concept!: any;
  children = true;
  properties = true;
  members = true;
  parents = true;
  format = { name: "JSON", value: "json", mime: "application/json" };
  formatOptions = [
    { name: "JSON", value: "json", mime: "application/json" },
    {
      name: "Excel(.xlsx)",
      value: "excel",
      mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
  ];

  closeDownloadDialog() {
    this.$emit("closeDownloadDialog");
  }

  downloadConcept() {
    ConceptService.getConceptDownload(
      this.concept["@id"],
      this.format.value,
      this.children,
      this.properties,
      this.members,
      this.parents
    )
      .then(res => {
        let fileType;
        switch (this.format.value) {
          case "json":
            fileType = ".json";
            break;
          case "excel":
            fileType = ".xlsx";
            break;
        }
        const filename = this.concept.name + fileType;
        this.downloadFile(res.data, filename);
      })
      .catch(err => {
        this.$toast.add(
          LoggerService.error("Concept download server request failed", err)
        );
      });
  }

  downloadFile(data: any, filename: string) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    const blob = new Blob([data], { type: this.format.mime });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
</script>

<style scoped>
.button-left {
  margin-right: 1rem;
}
.options-container {
  width: 60%;
  margin-bottom: 2rem;
}
.checkbox-label {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: 0.5em;
}
.label {
  margin-left: 0.5em;
}
.format-container {
  margin-bottom: 1rem;
}
</style>
