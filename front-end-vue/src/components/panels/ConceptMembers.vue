<template>
  <div class="p-grid">
    <div class="p-col-6">
      <Panel header="Included Members" :toggleable="true"
        ><Listbox listStyle="height:200px" :filter="true" emptyMessage="No results found" emptyFilterMessage="No results found"
          v-model="selectedIncludedMember"
          @click="onNodeSelect(selectedIncludedMember)"
          :options="$store.state.conceptAggregate.members.included"
          optionLabel="concept.name"
        ></Listbox
      ></Panel>
    </div>
    <div class="p-col-6">
      <Panel header="Excluded Members" :toggleable="true"
        ><Listbox listStyle="height:200px" :filter="true" emptyMessage="No results found" emptyFilterMessage="No results found"
          v-model="selectedExcludedMember"
          @click="onNodeSelect(selectedExcludedMember)"
          :options="$store.state.conceptAggregate.members.excluded"
          optionLabel="concept.name"
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
export default class ConceptMembers extends Vue {
  selectedIncludedMember: {} = {};
  selectedExcludedMember: {} = {};

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