<template>
  <div class="p-lg-6 p-md-12 dashcard-container">
    <Card class="dashcard dash-pie">
      <template #title> Ontology Concept Types </template>
      <template #subtitle>
        A brief overview of the types of data stored in the Ontology
      </template>
      <template #content>
        <div
          class="p-d-flex p-flex-row p-jc-center p-ai-center loading-container"
          v-if="$store.state.loading.get('reportType')"
        >
          <ProgressSpinner />
        </div>
        <Chart
          v-if="!$store.state.loading.get('reportType')"
          type="pie"
          :data="chartConceptTypes"
          :options="chartOptions"
          :height="graphHeight"
        />
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import store from "@/store/index";
import { mapState } from "vuex";
import ReportService from "@/services/ReportService";
import { colorLighter } from "@/helpers/ColorMethods";
const palette = require("../../../node_modules/google-palette");
import LoggerService from "@/services/LoggerService";

@Options({
  name: "ConceptTypes",
  computed: mapState(["conceptTypes"]),
  props: ["chartOptions", "graphHeight"]
})
export default class ConceptTypes extends Vue {
  chartConceptTypes: any = {};
  conceptTypes!: {};

  mounted() {
    // chart type
    // remove if statement and commit "updateConceptTypes" when server caching in place
    store.commit("updateLoading", { key: "reportType", value: true });
    if ("datasets" in this.conceptTypes) {
      this.chartConceptTypes = this.conceptTypes;
      store.commit("updateLoading", { key: "reportType", value: false });
    } else {
      ReportService.getConceptTypeReport()
        .then(res => {
          this.chartConceptTypes = {
            labels: [],
            datasets: [
              {
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: []
              }
            ]
          };
          for (const type of res.data) {
            this.chartConceptTypes.labels.push(type.label);
            this.chartConceptTypes.datasets[0].data.push(type.count);
          }
          store.commit("updateConceptTypes", this.chartConceptTypes);
          const length = Object.keys(res.data).length;
          const bgs = palette("tol-rainbow", length);
          const bgsFixed = bgs.map((color: string) => "#" + color);
          const hovers = palette("tol-rainbow", length);
          const hoversFixed = hovers.map((color: string) => "#" + color);
          const hoversLighter = hoversFixed.map((color: string) =>
            colorLighter(color)
          );
          this.chartConceptTypes.datasets[0].backgroundColor = bgsFixed;
          this.chartConceptTypes.datasets[0].hoverBackgroundColor = hoversLighter;
          store.commit("updateLoading", { key: "reportType", value: false });
        })
        .catch(err => {
          store.commit("updateLoading", { key: "reportType", value: false });
          this.$toast.add(
            LoggerService.error("Concept types server request failed", err)
          );
        });
    }
  }
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
