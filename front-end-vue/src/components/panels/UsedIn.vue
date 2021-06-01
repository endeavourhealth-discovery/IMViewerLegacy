<template>
  <div class="p-d-flex p-flex-row p-jc-center" v-if="loading">
    <div class="spinner">
      <ProgressSpinner />
    </div>
  </div>
  <Listbox
    v-else
    listStyle="height: calc(100vh - 245px)"
    :filter="true"
    emptyMessage="No results found"
    emptyFilterMessage="No results found"
    v-model="selectedUsage"
    @change="onNodeSelect(selectedUsage)"
    :options="usages"
    optionLabel="name"
  ></Listbox>
</template>
<script lang="ts">
import ConceptService from "@/services/ConceptService";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "UsedIn",
  components: {},
  props: {
    conceptIri: String
  },
  watch: {
    async conceptIri(newValue) {
      await this.getUsages(newValue);
    }
  },
  async mounted() {
    if (this.conceptIri) {
      await this.getUsages(this.conceptIri);
    }
  },
  data() {
    return {
      selectedUsage: {},
      usages: [],
      loading: false
    };
  },
  methods: {
    async getUsages(iri: string) {
      this.loading = true;
      this.usages = (await ConceptService.getConceptUsages(iri)).data;
      this.loading = false;
    },

    onNodeSelect(concept: any) {
      this.$router.push({
        name: "Concept",
        params: { selectedIri: concept["@id"] }
      });
    }
  }
});
</script>

<style scoped>
.usage-mapping-container {
  width: 100%;
}

.mapping-container {
  width: 50%;
}

.usage-container {
  width: 50%;
}
</style>
