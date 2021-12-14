<template>
  <Card id="container">
    <template #title> Confirmation </template>
    <template #content>
      <div class="p-fluid p-formgrid p-grid nested-grid">
        <div class="p-col-6">
          <DataTable :value="formObject.instructions" responsiveLayout="scroll">
            <Column field="destinationPaths" header="Destination Paths"></Column>
            <Column field="transformType" header="Transform Type"></Column>
            <Column field="transformValue" header="Transform Value"></Column>
            <Column field="transformFunctions" header="Transform Functions"></Column>
          </DataTable>
        </div>
        <div class="p-col-6">
          <TabView>
            <TabPanel header="File display">
              <vue-json-pretty class="json-viewer" :path="'res'" :data="formObject.inputDisplayJson"> </vue-json-pretty>
            </TabPanel>
            <TabPanel header="Data model">
              <vue-json-pretty class="json-viewer" :path="'res'" :data="formObject.dataModelJson"> </vue-json-pretty>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
        <Button label="Back" @click="prevPage" />
        <Button label="Download" @click="downloadTransformed" />
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import TransformFormObject from "../../models/transform/TransformFormObject";
import { defineComponent, PropType } from "vue";
import VueJsonPretty from "vue-json-pretty";
import TransformService from "@/services/TransformService";

export default defineComponent({
  name: "Confirmation",
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
  mounted() {
    console.log(this.formObject);
  },
  data() {
    return {
      pageIndex: 3,
      loading: false
    };
  },
  methods: {
    async downloadTransformed(event: any) {
      this.loading = true;
      const transformed = await TransformService.getTransformed(this.formObject.inputJson, this.formObject.dataModelJson, this.formObject.instructions);
      const url = window.URL.createObjectURL(new Blob([JSON.stringify(transformed)]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Transformed-" + Date.now() + ".json");
      document.body.appendChild(link);
      link.click();
      this.loading = false;
    },
    nextPage() {
      this.$emit("next-page", {
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

.json-viewer {
  height: calc(100vh - 32rem);
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
