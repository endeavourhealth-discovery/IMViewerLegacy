<template>
  <div class="p-d-flex p-flex-row p-jc-center" v-if="loading">
    <div class="spinner">
      <ProgressSpinner />
    </div>
  </div>

  <Listbox
    v-else
    listStyle="height:300px"
    :filter="true"
    emptyMessage="No results found"
    emptyFilterMessage="No results found"
    v-model="selected"
    @change="onNodeSelect(selected)"
    :options="terms"
    optionLabel="name"
  >
  </Listbox>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

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
