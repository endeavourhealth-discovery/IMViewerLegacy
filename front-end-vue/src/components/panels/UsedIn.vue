<template>
  <div
    class="p-d-flex p-flex-row p-jc-center"
    v-if="$store.state.loading.get('usages')"
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
    v-model="selectedUsage"
    @change="onNodeSelect(selectedUsage)"
    :options="$store.state.usages"
    optionLabel="name"
  ></Listbox>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "UsedIn",
  components: {},
  prop: {}
})
export default class UsedIn extends Vue {
  selectedMappedFrom: {} = {};
  selectedMappedTo: {} = {};
  selectedUsage: {} = {};

  onNodeSelect(concept: any) {
    this.$router.push({
      name: "Concept",
      params: { selectedIri: concept["@id"] }
    });
  }
}
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
