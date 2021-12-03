<template>
  <Card id="container">
    <template #title>
      Data model
    </template>
    <template #content>
      <div v-if="loading" class="loading-container">
        <ProgressSpinner />
      </div>
      <div v-else>
        <vue-json-pretty id="json-viewer" :path="'res'" :data="dataModelUpload"> </vue-json-pretty>
      </div>
    </template>
    <template #footer>
      <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
        <Button label="Back" @click="prevPage" />
        <FileUpload mode="basic" ref="input" name="demo[]" :customUpload="true" :auto="true" @uploader="uploadInput" accept=".json" chooseLabel="Upload" />
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
import TransformService from "@/services/TransformService";

export default defineComponent({
  name: "TransformDataModel",
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
    this.dataModelUpload = this.formObject.dataModelJson;
  },
  data() {
    return {
      pageIndex: 1,
      dataModelUpload: {} as any,
      loading: false
    };
  },
  methods: {
    async uploadInput(event: any) {
      this.loading = true;
      const input = event.files[0];
      const fileString = await (input as Blob).text();
      this.dataModelUpload = input.type !== "application/json" ? await TransformService.getTransformInputUploadFromFile(fileString) : JSON.parse(fileString);
      const x = this.$refs.input as any;
      x.files = [];
      this.loading = false;
    },
    nextPage() {
      this.$emit("next-page", {
        formData: {
          dataModelJson: this.dataModelUpload
        },
        pageIndex: this.pageIndex
      });
    },
    prevPage() {
      this.$emit("prev-page", {
        formData: {
          dataModelJson: this.dataModelUpload
        },
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
  height: calc(100vh - 27rem);
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
