<template>
  <div class="p-lg-6 p-md-12 dashcard-container">
    <Card class="dashcard dash-pie">
      <template #title> Ontology Concept Status </template>
      <template #subtitle>
        A brief overview of the status of concepts stored in the Ontology
      </template>
      <template #content>
        <div
          class="p-d-flex p-flex-row p-jc-center p-ai-center loading-container"
          v-if="$store.state.loading.get('reportStatus')"
        >
          <ProgressSpinner />
        </div>
        <Chart
          v-if="!$store.state.loading.get('reportStatus')"
          type="pie"
          :data="chartConceptStatus"
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
  name: "ConceptStatus",
  computed: mapState(["conceptStatus"]),
  props: ["chartOptions", "graphHeight"]
})
export default class ConceptStatus extends Vue {
  chartConceptStatus: any = {};
  conceptStatus!: {};

  mounted() {
    // chart status
    // strip out if statement and commit "updateConceptStatus" when server caching is implemented
    store.commit("updateLoading", { key: "reportStatus", value: true });
    if ("datasets" in this.conceptStatus){
      this.chartConceptStatus = this.conceptStatus;
      store.commit("updateLoading", { key: "reportStatus", value: false });
    } else {
      ReportService.getConceptStatusReport()
        .then(res => {
          this.chartConceptStatus = {
            labels: [],
            datasets: [
              {
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: []
              }
            ]
          };
          for (const status of res.data) {
            this.chartConceptStatus.labels.push(status.label);
            this.chartConceptStatus.datasets[0].data.push(status.count);
          }
          store.commit("updateConceptStatus", this.chartConceptStatus);
          const length = Object.keys(res.data).length;
          const bgs = palette("tol-rainbow", length);
          const bgsFixed = bgs.map((color: string) => "#" + color);
          const hovers = palette("tol-rainbow", length);
          const hoversFixed = hovers.map((color: string) => "#" + color);
          const hoversLighter = hoversFixed.map((color: string) =>
            colorLighter(color)
          );
          this.chartConceptStatus.datasets[0].backgroundColor = bgsFixed;
          this.chartConceptStatus.datasets[0].hoverBackgroundColor = hoversLighter;
          store.commit("updateLoading", { key: "reportStatus", value: false });
        })
        .catch(err => {
          store.commit("updateLoading", { key: "reportStatus", value: false });
          this.$toast.add(
            LoggerService.error("Concept status server request failed", err)
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
