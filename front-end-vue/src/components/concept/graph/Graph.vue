<template>
  <div class="p-fluid">
    <MultiSelect v-model="selectedPredicates" @change="updatePredicates" :options="predicateOptions" placeholder="Select predicates" />
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
import { PartialBundle } from "@/models/entityServiceTypes/EntityServiceTypes";

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
      predicateOptions: [] as string[],
      bundle: {} as PartialBundle,
      defaultPredicates: [] as string[]
    };
  },
  async mounted() {
    await this.getDefaultPredicates();
    await this.getEntityBundle(this.conceptIri);
  },
  methods: {
    async updatePredicates() {
      this.data = translateFromEntityBundle(this.bundle, this.selectedPredicates);
    },
    async getDefaultPredicates() {
      this.defaultPredicates = [
        "http://endhealth.info/im#isContainedIn",
        "http://www.w3.org/ns/shacl#property",
        "http://endhealth.info/im#code",
        "http://endhealth.info/im#groupNumber",
        "http://www.w3.org/2000/01/rdf-schema#subClassOf",
        "http://endhealth.info/im#hasTermCode",
        "http://endhealth.info/im#hasMap",
        "http://endhealth.info/im#roleGroup"
      ];
    },
    async getEntityBundle(iri: string) {
      this.loading = true;
      this.bundle = await EntityService.getPartialEntityBundle(iri, []);
      this.predicateOptions = Object.keys(this.bundle.entity).filter(value => value !== "@id");
      this.selectedPredicates = this.defaultPredicates.filter(value => this.predicateOptions.includes(value));
      this.data = translateFromEntityBundle(this.bundle, this.selectedPredicates);
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
