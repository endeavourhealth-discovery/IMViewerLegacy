<template>
  <div class="dashcard-container">
    <Card class="dashcard dash-pie">
      <template #title> Ontology concept status </template>
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
          :options="updatedChartOptions"
          :height="graphHeight"
        />
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import { mapState } from "vuex";
import ReportService from "@/services/ReportService";
import { colorLighter } from "@/helpers/ColorMethods";
const palette = require("../../../node_modules/google-palette");
import LoggerService from "@/services/LoggerService";
import { PieChartData } from "@/models/charts/PieChartData";
import { setTooltips, rescaleData } from "@/helpers/ChartRescale";
import { ChartOptions } from "@/models/charts/ChartOptions";

export default defineComponent({
  name: "ConceptStatus",
  computed: mapState(["conceptStatus"]),
  props: ["chartOptions", "graphHeight"],
  watch: {
    chartOptions(newValue) {
      this.updatedChartOptions = { ...newValue };
      // set tooltip to use real data
      this.updatedChartOptions["tooltips"] = setTooltips(this.realData);
    }
  },
  data() {
    return {
      updatedChartOptions: {} as ChartOptions,
      realData: {} as number[],
      chartConceptStatus: new PieChartData(
        [
          {
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: [],
            borderRadius: 1
          }
        ],
        []
      ) as PieChartData
    };
  },
  mounted() {
    this.updatedChartOptions = { ...this.chartOptions };
    // chart status
    store.commit("updateLoading", { key: "reportStatus", value: true });
    ReportService.getConceptStatusReport()
      .then(res => {
        for (const status of res.data) {
          this.chartConceptStatus.labels.push(status.label);
          this.chartConceptStatus.datasets[0].data.push(status.count);
        }
        this.realData = { ...this.chartConceptStatus.datasets[0].data };
        // set tooltip to use real data
        this.updatedChartOptions["tooltips"] = setTooltips(this.realData);
        // refactor data to a minimum graph size (1%) if less than min
        this.chartConceptStatus.datasets[0].data = rescaleData(
          this.chartConceptStatus.datasets[0].data
        );
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
});
</script>

<style scoped>
.dashcard-container {
  grid-area: status;
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
}

.p-chart {
  height: fit-content;
}

.loading-container {
  height: 100%;
}
</style>
