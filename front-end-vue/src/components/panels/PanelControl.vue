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
    <ConceptDetails v-if="conceptAggregate.concept && !isSet" />

    <ConceptMembers v-if="conceptAggregate.concept && isSet" />

    <ConceptUsageAndMapping />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ConceptSummary from "@/components/panels/ConceptSummary.vue";
import ConceptUsageAndMapping from "@/components/panels/ConceptUsageAndMapping.vue";
import ConceptMembers from "@/components/panels/ConceptMembers.vue";
import ConceptDetails from "./ConceptDetails.vue";
import { isValueSet } from "../../helpers/ConceptTypeMethods";
import { mapState } from "vuex";
import { ConceptAggregate } from "@/models/TTConcept/ConceptAggregate";

@Options({
  name: "PanelControl",
  components: {
    ConceptSummary,
    ConceptUsageAndMapping,
    ConceptMembers,
    ConceptDetails
  },
  computed: mapState(["conceptAggregate"])
})
export default class PanelControl extends Vue {
  conceptAggregate!: ConceptAggregate;
  get isSet() {
    const conceptTypeElements = this.conceptAggregate.concept[
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
