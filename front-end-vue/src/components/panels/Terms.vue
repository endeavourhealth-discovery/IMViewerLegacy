<template>
  <DataTable
    :value="terms"
    :rowsPerPageOptions="[10, 25, 50]"
    :paginator="terms.length > 10 ? true : false"
    :rows="10"
    rowGroupMode="subheader"
    groupRowsBy="scheme.name"
    sortMode="single"
    sortField="scheme.name"
    :sortOrder="1"
    scrollable
    showGridlines
    scrollHeight="600px"
    class="p-datatable-sm"
  >
    <Column field="scheme.name" header="Scheme" ></Column>
    <Column field="term" header="Term" style="flex:0 0 75%"></Column>
    <Column field="code" header="Code" ></Column>
    <template #groupheader="slotProps" >
      <span style="font-weight: 700; color:rgba(51,153,255,0.8)">Scheme : {{ slotProps.data.scheme.name }}</span>
    </template>
  </DataTable>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import ConceptService from "@/services/ConceptService";

export default defineComponent({
  name: "Terms",
  components: {},
  props: {
    conceptIri: String
  },
  watch: {
    async conceptIri(newValue) {
      await this.getTerms(newValue);
    }
  },
  async mounted() {
    await this.getTerms(this.conceptIri!);
  },
  data() {
    return {
      selected: {},
      loading: false,
      terms: []
    };
  },
  methods: {
    async getTerms(iri: string) {
      this.loading = true;
      // TODO call to get the terms
      this.terms = (await ConceptService.getConceptTermCodes(iri)).data;
      this.loading = false;
    },
    onNodeSelect(concept: any) {
      if (concept?.["@id"])
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
