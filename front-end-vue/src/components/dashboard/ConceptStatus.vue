<template>
  <div class="p-col-6 dashcard-container">
    <Card class="dashcard dash-pie">
      <template #title> Ontology Concept Status </template>
      <template #subtitle>
        A brief overview of the status of concepts stored in the Ontology
      </template>
      <template #content>
        <div class="p-d-flex p-flex-row p-jc-center p-ai-center loading-container" v-if="$store.state.loading.get('reportStatus')">
          <ProgressSpinner />
        </div>
        <Chart v-if="!$store.state.loading.get('reportStatus')" type="pie" :data="chartConceptStatus" :options="chartOptions" :height="graphHeight"/>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import store from "@/store/index";

@Options({
  name: "ConceptStatus",
  props: ["chartConceptStatus", "chartOptions", "graphHeight"]
})

export default class ConceptStatus extends Vue {

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
