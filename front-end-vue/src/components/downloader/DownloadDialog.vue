<template>
  <Dialog
    v-model:visible="showDialog"
    :modal="true"
    :closable="false"
    :maximizable="true"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3>Download Concept:</h3>
    </template>
    <div id="content" class="p-d-flex p-flex-column p-jc-center p-ai-center">
      <h4 v-if="concept['http://www.w3.org/2000/01/rdf-schema#label']">
        {{ concept["http://www.w3.org/2000/01/rdf-schema#label"] }}
      </h4>
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
            :disabled="!$store.state.conceptAggregate.children?.length"
            id="children"
            :binary="true"
            value="Include children"
            v-model="children"
          />
          <label class="label" for="children">Include Children</label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            :disabled="!$store.state.conceptAggregate.properties?.length"
            id="properties"
            :binary="true"
            value="Include properties"
            v-model="properties"
          />
          <label class="label" for="properties">Include properties</label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            :disabled="
              !$store.state.members?.included?.length &&
                !$store.state.members?.excluded?.length
            "
            id="members"
            :binary="true"
            value="Include members"
            v-model="members"
          />
          <label class="label" for="members">Include members</label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            :disabled="!$store.state.conceptAggregate.parents?.length"
            id="parents"
            :binary="true"
            value="Include parents"
            v-model="parents"
          />
          <label class="label" for="parents">Include parents</label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            id="inactive"
            :binary="true"
            value="Include inactive"
            v-model="inactive"
          />
          <label class="label" for="inactive">Include inactive</label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            :disabled="!$store.state.conceptAggregate.roles?.length"
            id="roles"
            :binary="true"
            value="Include roles"
            v-model="roles"
          />
          <label class="label" for="roles">Include roles</label>
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
import LoggerService from "@/services/LoggerService";
import store from "../../store/index";

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
  inactive = false;
  roles = false;
  format = {
    name: "Excel(.xlsx)",
    value: "excel",
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  };
  formatOptions = [
    { name: "JSON", value: "json", mime: "application/json" },
    {
      name: "Excel(.xlsx)",
      value: "excel",
      mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
  ];

  updated() {
    this.parents = !!store.state.conceptAggregate.parents?.length;
    this.children = !!store.state.conceptAggregate.children?.length;
    this.properties = !!store.state.conceptAggregate.properties?.length;
    this.roles = !!store.state.conceptAggregate.roles?.length;
    this.members =
      !!store.state.members?.included?.length ||
      !!store.state.members?.excluded?.length;
  }

  closeDownloadDialog() {
    this.$emit("closeDownloadDialog");
  }

  downloadConcept() {
    const modIri = this.concept["@id"]
      .replace(/\//gi, "%2F")
      .replace(/#/gi, "%23");

    const url =
      process.env.VUE_APP_API +
      "api/concept/download?iri=" +
      modIri +
      "&format=" +
      this.format.value +
      "&children=" +
      this.children +
      "&properties=" +
      this.properties +
      "&members=" +
      this.members +
      "&parents=" +
      this.parents +
      "&roles=" +
      this.roles +
      "&inactive=" +
      this.inactive;
    const popup = window.open(url);
    if (!popup) {
      this.$toast.add(LoggerService.error("Download failed from server"));
    } else {
      this.$toast.add(LoggerService.success("Download will begin shortly"));
    }
    this.closeDownloadDialog();
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
h4 {
  margin-bottom: 1em;
}
</style>
