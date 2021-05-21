<template>
  <div class="dashcard-container">
    <Card class="dashcard dash-pie">
      <template #title> Ontology concept types </template>
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
import { defineComponent } from "vue";
import ReportService from "@/services/ReportService";
import { colorLighter } from "@/helpers/ColorMethods";
const palette = require("../../../node_modules/google-palette");
import LoggerService from "@/services/LoggerService";
import { PieChartData } from "@/models/charts/PieChartData";
import { setTooltips, rescaleData } from "@/helpers/ChartRescale";
import { toSentenceCase } from "@/helpers/TextConverters";
import { ChartOptions } from "@/models/charts/ChartOptions";

export default defineComponent({
  name: "ConceptTypes",
  props: ["chartOptions", "graphHeight"],
  data() {
    return {
      updatedChartOptions: {} as ChartOptions,
      realData: {} as number[],
      chartConceptTypes: new PieChartData(
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
    // chart type
    this.$store.commit("updateLoading", { key: "reportType", value: true });
    ReportService.getConceptTypeReport()
      .then(res => {
        for (const type of res.data) {
          this.chartConceptTypes.labels.push(type.label);
          this.chartConceptTypes.datasets[0].data.push(type.count);
        }
        this.chartConceptTypes.labels = this.chartConceptTypes.labels.map(
          label => toSentenceCase(label)
        );
        this.realData = { ...this.chartConceptTypes.datasets[0].data };
        // set tooltip to use real data
        this.updatedChartOptions["tooltips"] = setTooltips(this.realData);
        // refactor data to a minimum graph size (1%) if less than min
        this.chartConceptTypes.datasets[0].data = rescaleData(
          this.chartConceptTypes.datasets[0].data
        );
        this.setChartColours(res.data);
        this.$store.commit("updateLoading", {
          key: "reportType",
          value: false
        });
      })
      .catch(err => {
        this.$store.commit("updateLoading", {
          key: "reportType",
          value: false
        });
        this.$toast.add(
          LoggerService.error("Concept types server request failed", err)
        );
      });
  }, // mounted end
  methods: {
    setChartColours(
      data: { count: number; iri: string; label: string }[]
    ): void {
      const colourCount = Object.keys(data).length;
      const backgroundColours = palette("tol-rainbow", colourCount);
      const backgroundColoursWithHash = backgroundColours.map(
        (color: string) => "#" + color
      );
      const hoverColours = palette("tol-rainbow", colourCount);
      const hoverColoursWithHash = hoverColours.map(
        (color: string) => "#" + color
      );
      const hoverColoursLightened = hoverColoursWithHash.map((color: string) =>
        colorLighter(color)
      );
      this.chartConceptTypes.datasets[0].backgroundColor = backgroundColoursWithHash;
      this.chartConceptTypes.datasets[0].hoverBackgroundColor = hoverColoursLightened;
    }
  }
});
</script>

<style scoped>
.dashcard-container {
  grid-area: types;
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

.p-chart {
  height: fit-content;
  width: 100%;
}

.loading-container {
  width: 100%;
  height: 100%;
}
</style>
