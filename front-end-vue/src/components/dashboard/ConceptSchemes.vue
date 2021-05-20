<template>
  <div class="dashcard-container">
    <Card class="dashcard dash-pie">
      <template #title> Ontology concept schemes </template>
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
import { defineComponent } from "vue";
import ReportService from "@/services/ReportService";
import { colorLighter } from "@/helpers/ColorMethods";
const palette = require("../../../node_modules/google-palette");
import LoggerService from "@/services/LoggerService";
import { PieChartData } from "@/models/charts/PieChartData";
import { setTooltips, rescaleData } from "@/helpers/ChartRescale";
import { ChartOptions } from "@/models/charts/ChartOptions";

export default defineComponent({
  name: "ConceptSchemes",
  props: ["chartOptions", "graphHeight"],
  data() {
    return {
      updatedChartOptions: {} as ChartOptions,
      realData: {} as number[],
      chartConceptSchemes: new PieChartData(
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
    // chart scheme
    this.$store.commit("updateLoading", { key: "reportScheme", value: true });
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
        // set chart background and hover colours
        this.setChartColours(res.data);
        this.$store.commit("updateLoading", {
          key: "reportScheme",
          value: false
        });
      })
      .catch(err => {
        this.$store.commit("updateLoading", {
          key: "reportScheme",
          value: false
        });
        this.$toast.add(
          LoggerService.error("Concept schemes server request failed", err)
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
      this.chartConceptSchemes.datasets[0].backgroundColor = backgroundColoursWithHash;
      this.chartConceptSchemes.datasets[0].hoverBackgroundColor = hoverColoursLightened;
    }
  }
});
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
