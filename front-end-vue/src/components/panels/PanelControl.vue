<template>
  <div id="panel-control">
    <ConceptSummary />

    <!-- <Panel header="Defintion" :toggleable="true">
    </Panel> -->

    <!-- <Panel
      header="Graph"
      :toggleable="true"
      v-if="
        $store.state.conceptAggregate.concept &&
          $store.state.conceptAggregate.concept.conceptType != 'ValueSet'
      "
    >
      <Graph />
    </Panel>

    <ConceptTable
      v-if="
        $store.state.conceptAggregate.concept &&
          $store.state.conceptAggregate.concept.conceptType != 'ValueSet'
      "
    /> -->
    <ConceptDetails v-if="$store.state.conceptAggregate.concept && !isSet" />

    <ConceptMembers v-if="$store.state.conceptAggregate.concept && isSet" />

    <ConceptUsageAndMapping />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ConceptSummary from "@/components/panels/ConceptSummary.vue";
import ConceptUsageAndMapping from "@/components/panels/ConceptUsageAndMapping.vue";
import ConceptMembers from "@/components/panels/ConceptMembers.vue";
import ConceptDetails from "./ConceptDetails.vue";
import store from "@/store";
import { isValueSet } from "../../helpers/ConceptTypeMethods";

@Options({
  name: "PanelControl",
  components: {
    ConceptSummary,
    ConceptUsageAndMapping,
    ConceptMembers,
    ConceptDetails
  }
})
export default class PanelControl extends Vue {
  get isSet() {
    const conceptTypeElements =
      store.state.conceptAggregate.concept[
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
      ];
    return isValueSet(conceptTypeElements);
  }
}
</script>
<style scoped>
#panel-control {
  width: 100%;
  height: 100%;
}
</style>
