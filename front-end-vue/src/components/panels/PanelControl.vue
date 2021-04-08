<template>
  <div>
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

    <ConceptDetails
      v-if="$store.state.conceptAggregate.concept && !isValueSet"
    />

    <ConceptMembers
      v-if="$store.state.conceptAggregate.concept && isValueSet"
    />

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
  get isValueSet() {
    return !store.state.conceptAggregate.concept[
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
    ].some((e: any) => e.name !== "Value set" && e.name !== "Set");
  }
}
</script>
