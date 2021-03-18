<template>
  <div>
    <ConceptSummary />

    <!-- <Panel header="Defintion" :toggleable="true">
      {{ concept }}
    </Panel> -->

    <Panel header="Graph" :toggleable="true" v-if="$store.state.conceptAggregate.concept && $store.state.conceptAggregate.concept.conceptType != 'ValueSet'">
      <Graph />
    </Panel>

    <ConceptMembers  v-if="$store.state.conceptAggregate.concept && $store.state.conceptAggregate.concept.conceptType == 'ValueSet'"/>

    <ConceptUsageAndMapping />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ConceptSummary from "@/components/panels/ConceptSummary.vue";
import Graph from "../graph/Graph.vue";
import ConceptUsageAndMapping from "@/components/panels/ConceptUsageAndMapping.vue";
import ConceptMembers from "@/components/panels/ConceptMembers.vue";

@Options({
  components: { ConceptSummary, Graph, ConceptUsageAndMapping, ConceptMembers }
})
export default class PanelControl extends Vue {}
</script>
