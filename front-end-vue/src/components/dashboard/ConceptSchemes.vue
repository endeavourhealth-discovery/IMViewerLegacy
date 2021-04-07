<template>
  <div class="p-col-6 dashcard-container">
    <Card class="dashcard dash-pie">
      <template #title> Ontology Concept Schemes </template>
      <template #subtitle>
        A brief overview of the schemes of data stored in the Ontology
      </template>
      <template #content>
        <div class="p-d-flex p-flex-row p-jc-center p-ai-center loading-container" v-if="$store.state.loading.get('reportScheme')">
          <ProgressSpinner />
        </div>
        <Chart v-if="!$store.state.loading.get('reportScheme')" type="pie" :data="chartConceptSchemes" :options="chartOptions" :height="graphHeight" />
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import store from "@/store/index";

@Options({
  name: "ConceptSchemes",
  props: ["chartConceptSchemes", "chartOptions", "graphHeight"]
})

export default class ConceptSchemes extends Vue {

}
</script>

<style scoped>

.dashcard {
  height: 100%;
}

.p-chart {
  height: fit-content;
}

.loading-container {
  height: 100%;
}

</style>
