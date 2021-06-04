<template>
  <div class="dashcard-container">
    <Card class="dashcard dash-pie">
      <template #title> {{ name }} </template>
      <template #subtitle>
        {{ description }}
      </template>
      <template #content>
        <div
          class="p-d-flex p-flex-row p-jc-center p-ai-center loading-container"
          v-if="$store.state.loading.get('reportPie_' + iri)"
        >
          <ProgressSpinner />
        </div>
        <Chart
          :key="'pie' + iri"
          v-if="!$store.state.loading.get('reportPie_' + iri)"
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
import IndividualService from "@/services/IndividualService";
const palette = require("../../../node_modules/google-palette");
import LoggerService from "@/services/LoggerService";
import { PieChartData } from "@/models/charts/PieChartData";
import { setTooltips, rescaleData } from "@/helpers/ChartRescale";
import { toSentenceCase } from "@/helpers/TextConverters";
import { ChartOptions } from "@/models/charts/ChartOptions";
import { IM } from "@/vocabulary/IM";
import { RDFS } from "@/vocabulary/RDFS";
import { OWL } from "@/vocabulary/OWL";

export default defineComponent({
  name: "ReportPieChart",
  props: ["chartOptions", "graphHeight", "iri"],
  data: () => {
    return {
      name: "" as string,
      description: "" as string,
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
  beforeCreate() {
    this.$store.commit("updateLoading", {
      key: "reportPie_" + this.iri,
      value: true
    });
  },
  mounted() {
    this.updatedChartOptions = { ...this.chartOptions };
    // chart type

    IndividualService.getIndividual(this.iri)
      .then(res => {
        this.name = res.data[RDFS.LABEL]["@value"];
        this.description = res.data[RDFS.COMMENT]["@value"];
        for (const entry of res.data[IM.STATS_REPORT_ENTRY]) {
          this.chartConceptTypes.labels.push(entry[RDFS.LABEL]["@value"]);
          this.chartConceptTypes.datasets[0].data.push(
            +entry[OWL.HAS_VALUE]["@value"]
          );
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
        this.setChartColours(res.data[IM.STATS_REPORT_ENTRY].length);
        this.$store.commit("updateLoading", {
          key: "reportPie_" + this.iri,
          value: false
        });
      })
      .catch(err => {
        this.$store.commit("updateLoading", {
          key: "reportPie_" + this.iri,
          value: false
        });
        this.$toast.add(
          LoggerService.error("Concept types server request failed", err)
        );
      });
  }, // mounted end
  methods: {
    setChartColours(colourCount: number): void {
      const colours = palette("tol-rainbow", colourCount);
      this.chartConceptTypes.datasets[0].backgroundColor = colours.map(
        (color: string) => "#" + color + "BB"
      );
      this.chartConceptTypes.datasets[0].hoverBackgroundColor = colours.map(
        (color: string) => "#" + color
      );
    }
  }
});
</script>

<style scoped>
.dashcard-container {
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
