<template>
  <Dialog header="Join on properties" :visible="jpathDialog" :breakpoints="{ '960px': '75vw' }" :style="{ width: '75vw' }">
    <!-- {{ jsonPathOptions }} -->
    <!-- <TreeSelect v-model="selectedNodeKey" :options="nodes" placeholder="Select Item" /> -->
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-col">
        <span class="p-float-label">
          <InputText id="jsonpath" type="text" v-model="jsonpath" @input="getInputFromJpath" />
          <label for="jsonpath">Json Path</label>
        </span>
      </div>
    </div>
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-col-6 p-md-6">
        <h6>Before</h6>
        <vue-json-pretty id="json-viewer-jsonpath-before" :path="'res'" :data="input.inputDisplayJson"> </vue-json-pretty>
      </div>
      <div class="p-col-6 p-md-6">
        <h6>After</h6>
        <div v-if="loading" class="loading-container">
          <ProgressSpinner />
        </div>
        <div v-else class="loading-container">
          <vue-json-pretty id="json-viewer-jsonpath-after" :path="'res'" :data="inputAfter.inputDisplayJson"> </vue-json-pretty>
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" class="p-button-text" icon="pi pi-times" @click="closeJpathDialog" />
      <Button label="Update" icon="pi pi-check" @click="updateInput" />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { TransformInputUpload } from "@/models/transform/TransformInputUpload";
import TransformService from "@/services/TransformService";
import VueJsonPretty from "vue-json-pretty";

export default defineComponent({
  name: "JsonPathSelectionDialog",
  components: {
    VueJsonPretty
  },
  emits: ["updateInputFromJpath", "closeJpathDialog"],
  props: {
    input: {
      type: Object as PropType<TransformInputUpload>,
      required: true
    },
    jpathDialog: {
      type: Boolean,
      required: true
    }
  },
  computed: {},
  async mounted() {
    if (this.input) {
      this.jsonPathOptions = await TransformService.getJpaths(this.input);
    }
  },
  data() {
    return {
      loading: false,
      pathSelected: [] as any[],
      jsonpath: "",
      inputAfter: {} as TransformInputUpload,
      jsonPathOptions: {} as any
    };
  },
  methods: {
    async getInputFromJpath() {
      this.loading = true;
      this.inputAfter = await TransformService.getInputFromJpath(this.input, this.jsonpath);
      this.inputAfter.inputFile = this.input.inputFile;
      this.loading = false;
    },
    closeJpathDialog() {
      this.$emit("closeJpathDialog", {});
    },
    updateInput() {
      this.$emit("updateInputFromJpath", this.inputAfter);
      this.$emit("closeJpathDialog", {});
    }
  }
});
</script>
