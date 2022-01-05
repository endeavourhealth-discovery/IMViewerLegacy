<template>
  <div class="p-fluid">
    <MultiSelect v-model="selectedPredicates" :options="predicates" placeholder="Select predicates" />
  </div>
  <div class="loading-container" v-if="loading">
    <ProgressSpinner />
  </div>
  <GraphComponent v-else :data="data" />
</template>

<script lang="ts">
import TTGraphData from "../../../models/TTGraphData";
import { translateFromEntityBundle } from "../../../helpers/GraphTranslator";
import { defineComponent } from "@vue/runtime-core";
import EntityService from "@/services/EntityService";
import GraphComponent from "./GraphComponent.vue";

export default defineComponent({
  name: "Graph",
  components: {
    GraphComponent
  },
  props: {
    conceptIri: { type: String, required: true }
  },
  watch: {
    async conceptIri(newValue) {
      await this.getEntityBundle(newValue);
    }
  },
  data() {
    return {
      loading: false,
      data: {} as TTGraphData,
      selectedPredicates: [] as string[],
      predicates: [] as string[]
    };
  },
  async mounted() {
    await this.getEntityBundle(this.conceptIri);
  },
  methods: {
    async getEntityBundle(iri: string) {
      this.loading = true;
      const bundle = await EntityService.getPartialEntityBundle(iri, []);
      this.predicates = Object.keys(bundle.predicates);
      this.data = translateFromEntityBundle(bundle);
      this.loading = false;
    }
  }
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
