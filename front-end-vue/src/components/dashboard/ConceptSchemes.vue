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
  name: "ConceptSchemes",
  computed: mapState(["conceptSchemes"]),
  props: ["chartOptions", "graphHeight"],
  watch: {
    chartOptions(newValue) {
      this.updatedChartOptions = { ...newValue };
      // set tooltip to use real data
      this.updatedChartOptions["tooltips"] = setTooltips(this.realData);
    }
  }
})
export default class ConceptSchemes extends Vue {
  chartOptions!: any;
  updatedChartOptions: any = {};
  realData: any = {};
  chartConceptSchemes: PieChartData = new PieChartData(
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
  conceptSchemes!: PieChartData;

  mounted() {
    this.updatedChartOptions = { ...this.chartOptions };
    // chart scheme
    // strip out if statement and commit "updateConceptScheme" when server caching is implemented
    store.commit("updateLoading", { key: "reportScheme", value: true });
    if ("datasets" in this.conceptSchemes) {
      this.chartConceptSchemes = this.conceptSchemes;
      store.commit("updateLoading", { key: "reportScheme", value: false });
    } else {
      ReportService.getConceptSchemeReport()
        .then(res => {
          for (const schema of res.data) {
            this.chartConceptSchemes.labels.push(schema.label);
            this.chartConceptSchemes.datasets[0].data.push(schema.count);
          }
          this.realData = { ...this.chartConceptSchemes.datasets[0].data };
          // set tooltip to use real data
          this.updatedChartOptions["tooltips"] = setTooltips(this.realData);
          // refactor data to a minimum graph size (1%) if less than min
          this.chartConceptSchemes.datasets[0].data = rescaleData(
            this.chartConceptSchemes.datasets[0].data
          );
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
  } // mounted end
}
</script>

<style scoped>
.dashcard-container {
  grid-area: schemes;
  height: 100%;
  width: 100%;
}

@media screen and (min-width: 1440px) {
  .dashcard-container {
    max-width: calc(35vw - 57.5px - 21px);
  }
}

@media screen and (min-width: 1024px) and (max-width: 1439px) {
  .dashcard-container {
    max-width: calc(32vw - 21px);
  }
}

@media screen and (max-width: 1023px) {
  .dashcard-container {
    max-width: calc(62vw - 21px);
  }
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
