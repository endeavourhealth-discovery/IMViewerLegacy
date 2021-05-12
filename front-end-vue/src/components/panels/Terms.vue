<template>
  <div
    class="p-d-flex p-flex-row p-jc-center"
    v-if="$store.state.loading.get('mapped')"
  >
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
    :options="$store.state.mapped"
    optionLabel="name"
  >
  </Listbox>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Terms",
  components: {},
  props: {},
  data() {
    return {
      selected: {}
    };
  },
  methods: {
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
