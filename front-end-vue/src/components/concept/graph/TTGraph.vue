<template>
  <div class="p-d-flex p-flex-row p-jc-center p-ai-center loading -container" v-if="loading">
    <ProgressSpinner />
  </div>

  <GraphComponent :data="data" />
</template>

<script lang="ts">
import TTGraphData from "../../../models/TTGraphData";
import { translateFromEntityBundle, translateFromTTDocument } from "../../../helpers/GraphTranslator";
import { defineComponent } from "@vue/runtime-core";
import EntityService from "@/services/EntityService";
import GraphComponent from "./GraphComponent.vue";

export default defineComponent({
  name: "TTGraph",
  components: {
    GraphComponent
  },
  props: {
    conceptIri: { type: String, required: true }
  },
  watch: {
    async conceptIri(newValue) {
      await this.getEntityBundle(this.conceptIri);
    }
  },
  data() {
    return {
      loading: false,
      data: {} as TTGraphData
    };
  },
  async mounted() {
    await this.getEntityBundle(this.conceptIri);
  },
  methods: {
    async getEntityBundle(iri: string) {
      const bundle = await EntityService.getPartialEntityBundle(iri, []);
      this.data = translateFromEntityBundle(bundle);
      // this.data = translateFromTTDocument();
    }
  }
});
</script>
