<template>
  <div class="dashcard-container">
    <Card class="dashcard dash-pie">
      <template #title> Ontology Concept Schemes </template>
      <template #subtitle>
        A brief overview of the schemes of data stored in the Ontology
      </template>
      <template #content>
        <div
          class="p-d-flex p-flex-row p-jc-center p-ai-center loading-container"
          v-if="$store.state.loading.get('reportScheme')"
        >
          <ProgressSpinner />
        </div>
        <Chart
          v-if="!$store.state.loading.get('reportScheme')"
          type="pie"
          :data="chartConceptSchemes"
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
  name: "ConceptSchemes",
  computed: mapState(["conceptSchemes"]),
  props: ["chartOptions", "graphHeight"]
})
export default class ConceptSchemes extends Vue {
  chartConceptSchemes: any = {};
  conceptSchemes!: {};

  mounted() {
    // chart scheme
    // strip out if statement and commit "updateConceptScheme" when server caching is implemented
    store.commit("updateLoading", { key: "reportScheme", value: true });
    if ("datasets" in this.conceptSchemes) {
      this.chartConceptSchemes = this.conceptSchemes;
      store.commit("updateLoading", { key: "reportScheme", value: false });
    } else {
      ReportService.getConceptSchemeReport()
        .then(res => {
          this.chartConceptSchemes = {
            labels: [],
            datasets: [
              {
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: []
              }
            ]
          };
          for (const schema of res.data) {
            this.chartConceptSchemes.labels.push(schema.label);
            this.chartConceptSchemes.datasets[0].data.push(schema.count);
          }
          store.commit("updateConceptSchemes", this.chartConceptSchemes);
          const length = Object.keys(res.data).length;
          const bgs = palette("tol-rainbow", length);
          const bgsFixed = bgs.map((color: string) => "#" + color);
          const hovers = palette("tol-rainbow", length);
          const hoversFixed = hovers.map((color: string) => "#" + color);
          const hoversLighter = hoversFixed.map((color: string) =>
            colorLighter(color)
          );
          this.chartConceptSchemes.datasets[0].backgroundColor = bgsFixed;
          this.chartConceptSchemes.datasets[0].hoverBackgroundColor = hoversLighter;
          store.commit("updateLoading", { key: "reportScheme", value: false });
        })
        .catch(err => {
          store.commit("updateLoading", { key: "reportScheme", value: false });
          this.$toast.add(
            LoggerService.error("Concept schemes server request failed", err)
          );
        });
    }
  }
}
</script>

<style scoped>
.dashcard-container {
  grid-area: schemes;
  height: 100%;
  width: calc(35vw - 72px);
}

.dashcard {
  height: 100%;
  width: 100%;
}

/* .p-chart {
  height: fit-content;
} */

.loading-container {
  height: 100%;
}
</style>
