<template>
  <div class="p-grid">
    <div class="p-col-6">
      <Panel header="Mapped" :toggleable="true">
        <div
          class="p-grid p-jc-center"
          v-if="$store.state.loading.get('mapped')"
        >
          <div class="p-col-6">
            <ProgressSpinner />
          </div>
        </div>

        <Listbox
          v-else
          listStyle="height:300px"
          :filter="true"
          emptyMessage="No results found"
          emptyFilterMessage="No results found"
          v-model="selectedMappedFrom"
          @change="onNodeSelect(selectedMappedFrom)"
          :options="$store.state.mapped"
          optionLabel="name"
        >
        </Listbox>
      </Panel>
    </div>
    <!-- <div class="p-col-4">
      <Panel header="Mapped to" :toggleable="true"
        ><Listbox
          listStyle="height:200px"
          :filter="true"
          emptyMessage="No results found"
          emptyFilterMessage="No results found"
          v-model="selectedMappedTo"
          @click="onNodeSelect(selectedMappedTo)"
          :options="$store.state.conceptAggregate.mappedTo"
          optionLabel="name"
        ></Listbox
      ></Panel>
    </div> -->
    <div class="p-col-6">
      <Panel header="Used In" :toggleable="true"
        ><div
          class="p-grid p-jc-center"
          v-if="$store.state.loading.get('usages')"
        >
          <div class="p-col-6">
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

<style></style>
