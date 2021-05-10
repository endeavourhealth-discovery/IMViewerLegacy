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
      <TabPanel header="Terms">
        <Mappings />
      </TabPanel>
      <TabPanel header="Used In">
        <UsedIn />
      </TabPanel>
    </TabView>
  </Panel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import PropertiesTable from "./PropertiesTable.vue";
import RolesTable from "./RolesTable.vue";
import Graph from "./Graph.vue";
import Mappings from "./Terms.vue";
import UsedIn from "./UsedIn.vue";

@Options({
  name: "ConceptDetails",
  components: { PropertiesTable, Graph, RolesTable, Mappings, UsedIn }
})
export default class DetailsSummary extends Vue {}
</script>
