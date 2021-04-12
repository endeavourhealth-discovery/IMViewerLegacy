<template>
  <Panel header="Details" :toggleable="true">
    <TabView>
      <TabPanel header="Graph">
        <Graph />
      </TabPanel>
      <TabPanel header="Properties">
        <PropertiesTable />
      </TabPanel>
      <TabPanel header="Roles">
        <RolesTable />
      </TabPanel>
    </TabView>
  </Panel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import PropertiesTable from "./PropertiesTable.vue";
import RolesTable from "./RolesTable.vue";
import Graph from "./Graph.vue";

@Options({
  name: "ConceptDetails",
  components: { PropertiesTable, Graph, RolesTable }
})
export default class DetailsSummary extends Vue {}
</script>
