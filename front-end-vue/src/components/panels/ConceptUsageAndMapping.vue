<template>
  <div class="p-grid">
    <div class="p-col-4">
      <Panel header="Mapped from" :toggleable="true"
        ><Listbox
          v-model="selectedMappedFrom"
          @click="onNodeSelect(selectedMappedFrom)"
          :options="$store.state.conceptAggregate.mappedFrom"
          optionLabel="name"
        ></Listbox
      ></Panel>
    </div>
    <div class="p-col-4">
      <Panel header="Mapped to" :toggleable="true"
        ><Listbox
          v-model="selectedMappedTo"
          @click="onNodeSelect(selectedMappedTo)"
          :options="$store.state.conceptAggregate.mappedTo"
          optionLabel="name"
        ></Listbox
      ></Panel>
    </div>
    <div class="p-col-4">
      <Panel header="Used In" :toggleable="true"
        ><Listbox
          v-model="selectedUsage"
          @click="onNodeSelect(selectedUsage)"
          :options="$store.state.conceptAggregate.usages"
          optionLabel="name"
        ></Listbox
      ></Panel>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  components: {},
  prop: {}
})
export default class ConceptUsageAndMapping extends Vue {
    selectedMappedFrom: {} = {};
    selectedMappedTo: {} = {};
    selectedUsage: {} = {};

  onNodeSelect(concept: any) {
    this.$router.push({
      name: "Concept",
      params: { selectedIri: concept.iri }
    });
  }
}
</script>

<style>
</style>