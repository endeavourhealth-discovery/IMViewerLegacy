<template>
  <Panel header="Details" :toggleable="true">
    <TabView>
      <TabPanel header="Graph">
        <Graph />
      </TabPanel>
      <TabPanel header="Properties">
        <ConceptTable />
      </TabPanel>
    </TabView>
  </Panel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ConceptTable from "./ConceptTable.vue";
import Graph from "./Graph.vue";

@Options({
  components: { ConceptTable, Graph }
})
export default class DetailsSummary extends Vue {}
</script>
