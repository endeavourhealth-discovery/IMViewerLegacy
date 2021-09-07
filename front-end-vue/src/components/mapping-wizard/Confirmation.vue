<template>
  <div class="panel-content">
    <h2>Preview</h2>
  </div>
  <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
    <Button label="Back" @click="prevPage" />
    <Button label="Submit" @click="submit" />
  </div>
</template>

<script lang="ts">
import { MappingFormObject } from "@/models/mapping/MappingFormObject";
import LoggerService from "@/services/LoggerService";
import MappingService from "@/services/MappingService";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "Confirmation",
  props: {
    formObject: {
      type: Object as PropType<MappingFormObject>,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
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
        })
        .catch((error) => {
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
      formData.append("contentFile", this.formObject.contentFile);
      formData.append("mappingFile", this.formObject.mapDocumentString);
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
