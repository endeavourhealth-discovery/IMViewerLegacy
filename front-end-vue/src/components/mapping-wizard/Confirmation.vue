<template>
  <Card id="container">
    <template #title> Confirmation </template>
    <template #content>
      <div class="p-field p-col-12">
        <label for="class">Graph: </label>
        <b>{{ formObject.graph ? " " + formObject.graph : " -" }} </b>
      </div>
      <div class="p-field p-col-12">
        <label for="Age">Nested: </label>
        <b>{{ formObject.nested ? " " + formObject.nested : " -" }}</b>
      </div>
      <div class="p-field p-col-12">
        <label for="Age">Content File: </label>
        <b>{{
          formObject.contentFile ? " " + formObject.contentFileName : " -"
        }}</b>
      </div>
      <div class="p-field p-col-12">
        <label for="Age">Map Document: </label>
        <b>{{
          formObject.mapDocument ? " " + formObject.mapDocumentName : " -"
        }}</b>
      </div>
    </template>
  </Card>

  <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
    <Button label="Back" @click="prevPage" />
    <Button
      v-if="!complete"
      label="Submit"
      @click="submit"
      :loading="loading"
    />
    <Button
      v-if="complete"
      label="New"
      @click="this.$router.push('/mapping/wizard')"
    />
  </div>
</template>

<script lang="ts">
import { MappingFormObject } from "@/models/mapping/MappingFormObject";
import LoggerService from "@/services/LoggerService";
import MappingService from "@/services/MappingService";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "Confirmation",
  emits: ["prev-page", "next-page"],
  props: {
    formObject: {
      type: Object as PropType<MappingFormObject>,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      complete: false,
      pageIndex: 4,
    };
  },
  methods: {
    prevPage() {
      this.$emit("prev-page", {
        pageIndex: this.pageIndex,
      });
    },

    async submit() {
      this.loading = true;
      MappingService.getMappedTTDocument(this.getFormData())
        .then((response) => {
          this.loading = false;
          this.download(response);
          this.$toast.add(
            LoggerService.success(
              "Request was successful. Download should begin shortly."
            )
          );
        })
        .catch((error) => {
          this.loading = false;
          this.$toast.add(
            LoggerService.error("Request failed from server", error.message)
          );
        });
      this.complete = true;
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
      formData.append("contentFile", this.formObject.contentFile);
      formData.append("mappingFile", this.formObject.mapDocument);
      formData.append("graph", this.formObject.graph);
      formData.append("nested", this.formObject.nested);
      return formData;
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

.p-card {
  box-shadow: unset;
}

#button-bar {
  padding: 0 2rem 1rem 0;
  gap: 0.5rem;
}
</style>
