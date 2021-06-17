<template>
  <div
    class="p-d-flex p-flex-row p-jc-center p-ai-center loading -container"
    v-if="loading"
  >
    <ProgressSpinner />
  </div>
  <OrganizationChart v-else :value="graph" :collapsible="true">
    <template #NONE>
      <p class="p-text-centered">None</p>
    </template>
    <template #default="slotProps">
      <span>{{ slotProps.node.name }}</span>
    </template>
    <template #PROPERTY="slotProps">
      <table aria-label="Concept map children">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in slotProps.node.leafNodes" :key="prop">
            <td>{{ prop.name }}</td>
            <td>{{ prop.valueTypeName }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </OrganizationChart>
</template>

<script lang="ts">
import GraphData from "../../models/GraphData";
import { defineComponent } from "@vue/runtime-core";
import ConceptService from "@/services/ConceptService";

export default defineComponent({
  name: "Graph",
  components: {},
  props: {
    conceptIri: String
  },
  watch: {
    async conceptIri(newValue) {
      await this.getGraph(newValue);
    }
  },
  data() {
    return {
      loading: false,
      graph: {} as GraphData
    };
  },
  async mounted() {
    if (this.conceptIri) {
      await this.getGraph(this.conceptIri);
    }
  },
  methods: {
    async getGraph(iri: string) {
      this.loading = true;
      this.graph = (await ConceptService.getConceptGraph(iri)).data;
      this.loading = false;
    }
  }
});
</script>

<style scoped>
td,
th {
  border: 1px solid lightgray;
  padding: 0.5rem;
}

td,
th {
  text-align: left;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}

th[scope="col"] {
  background-color: #f8f9fa;
  color: #495057;
}

table {
  border-collapse: collapse;
  border: 2px solid rgb(200, 200, 200);
}

td,
th {
  overflow-wrap: break-word;
}

.p-organizationchart {
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
