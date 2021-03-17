<template>
  <div>
    <ConceptSummary />

    <Panel
      header="Defintion"
      :toggleable="true"
      v-if="$route.name == 'Ontology'"
    >
      {{ concept }}
    </Panel>

    <Panel header="Graph" :toggleable="true">
      <Graph />
    </Panel>

    <!-- <Panel header="Members" :toggleable="true" v-if="$route.name == 'Valueset'">
      {{ concept }}
    </Panel> -->

    <!-- <div class="p-grid">
      <div class="p-col-4">
        <Panel header="Mapped from" :toggleable="true"
          ><Listbox
            v-model="selectedConcept"
            :options="concepts"
            optionLabel="name"
          ></Listbox
        ></Panel>
      </div>
      <div class="p-col-4">
        <Panel header="Mapped to" :toggleable="true"
          ><Listbox
            v-model="selectedConcept"
            :options="concepts"
            optionLabel="name"
          ></Listbox
        ></Panel>
      </div>
      <div class="p-col-4">
        <Panel header="Used In" :toggleable="true"
          ><Listbox
            v-model="selectedConcept"
            :options="concepts"
            optionLabel="name"
          ></Listbox
        ></Panel>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ConceptSummary from "@/components/panels/ConceptSummary.vue";
import Graph from "../graph/Graph.vue";

@Options({
  components: { ConceptSummary, Graph }
})
export default class PanelControl extends Vue {
  concept = {};
  selectedConcept = null;
  concepts = [
    { name: "Encounter (record type) | :Encounter", code: "Encounter" },
    { name: "Encounter (type) | :1741000252102", code: "Patient" },
    {
      name: "Appointment (slot)  (record type) | :Appointment",
      code: "Appointment"
    },
    { name: "Patient (record type) | :Patient", code: "Patient" },
    { name: "Team  (record type) | :Team", code: "Team" }
  ];

  properties = [
    {
      name: "Encounter (record type)",
      iri: ":Encounter",
      type: "Concept class",
      cardinality: "	1 : *"
    },
    {
      name: "Encounter (type)",
      iri: ":Patient",
      type: "Concept class",
      cardinality: "	1 : *"
    },
    {
      name: "Appointment (slot)  (record type)",
      iri: ":Appointment",
      type: "Concept class",
      cardinality: "	1 : *"
    },
    {
      name: "Patient (record type)",
      iri: ":Patient",
      type: "Concept class",
      cardinality: "	1 : *"
    },
    {
      name: "Team  (record type)",
      iri: ":Team",
      type: "Concept class",
      cardinality: "	1 : *"
    }
  ];

  inheritance = {
    key: "0",
    data: { label: "Health record" },
    children: [
      {
        key: "0_0",
        data: { label: "Child Concept 1" },
        children: []
      },
      {
        key: "0_1",
        data: { label: "Child Concept 2" },
        children: []
      },
      {
        key: "0_2",
        data: { label: "Child Concept 3" },
        children: []
      },
      {
        key: "0_3",
        data: { label: "Child Concept 4" },
        children: []
      }
    ]
  };
}
</script>
