<template>
  <div class="dashcard-container">
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
          :options="updatedChartOptions"
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
import { PieChartData } from "@/models/charts/PieChartData";
import { setTooltips, rescaleData } from "@/helpers/GraphRescale";

@Options({
  name: "ConceptTypes",
  computed: mapState(["conceptTypes"]),
  props: ["chartOptions", "graphHeight"],
  watch: {
    chartOptions(newValue) {
      this.updatedChartOptions = { ...newValue };
      // set tooltip to use real data
      this.updatedChartOptions["tooltips"] = setTooltips(this.realData);
    }
  }
})
export default class ConceptTypes extends Vue {
  chartOptions!: any;
  updatedChartOptions: any = {};
  realData: any = {};
  chartConceptTypes: PieChartData = new PieChartData(
    [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
        borderRadius: 1
      }
    ],
    []
  );
  conceptTypes!: PieChartData;

  mounted() {
    this.updatedChartOptions = { ...this.chartOptions };
    // chart type
    // remove if statement and commit "updateConceptTypes" when server caching in place
    store.commit("updateLoading", { key: "reportType", value: true });
    if ("datasets" in this.conceptTypes) {
      this.chartConceptTypes = this.conceptTypes;
      store.commit("updateLoading", { key: "reportType", value: false });
    } else {
      ReportService.getConceptTypeReport()
        .then(res => {
          for (const type of res.data) {
            this.chartConceptTypes.labels.push(type.label);
            this.chartConceptTypes.datasets[0].data.push(type.count);
          }
          this.realData = { ...this.chartConceptTypes.datasets[0].data };
          // set tooltip to use real data
          this.updatedChartOptions["tooltips"] = setTooltips(this.realData);
          // refactor data to a minimum graph size (1%) if less than min
          this.chartConceptTypes.datasets[0].data = rescaleData(
            this.chartConceptTypes.datasets[0].data
          );
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
@media screen and (min-width: 1440px) {
  .dashcard-container {
    grid-area: types;
    height: 100%;
    width: 100%;
    max-width: calc(35vw - 57.5px - 21px);
  }
}

@media screen and (min-width: 1024px) and (max-width: 1439px) {
  .dashcard-container {
    grid-area: types;
    height: 100%;
    width: 100%;
    max-width: calc(32vw - 21px);
  }
}

@media screen and (max-width: 1023px) {
  .dashcard-container {
    grid-area: types;
    height: 100%;
    width: 100%;
    max-width: calc(62vw - 21px);
  }
}

.dashcard {
  height: 100%;
  width: 100%;
}

.p-chart {
  height: fit-content;
  width: 100%;
}

.loading-container {
  width: 100%;
  height: 100%;
}
</style>
