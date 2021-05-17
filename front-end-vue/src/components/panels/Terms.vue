<template>
  <DataTable class="p-datatable-sm"
      :value="terms"
      :rowsPerPageOptions="[10, 25, 50]"
      :paginator="terms.length > 10 ? true : false"
      :rows="10"
      :scrollable="true"
      scrollHeight="flex"
      id="terms-table"
    >
      <template #empty>
        No records found
      </template>
      <Column field="term" header="Term">
        <template #body="slotProps">
          <div class="link" @click="navigate(slotProps.data.term)">
            {{ slotProps.data.term }}
          </div>
        </template>
      </Column>
      <Column field="code" header="Code"  >
        <template #body="slotProps">
          <div class="link" @click="navigate(slotProps.data.code)">
            {{ slotProps.data.code }}
          </div>
        </template>
      </Column>
      <Column field="scheme" header="Scheme"  >
        <template #body="slotProps">
          <div class="link" @click="navigate(slotProps.data.scheme.name)">
            {{ slotProps.data.scheme.name }}
          </div>
        </template>
      </Column>
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
