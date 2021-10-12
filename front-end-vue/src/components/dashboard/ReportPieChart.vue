<template>
  <div class="dashcard-container">
    <Card class="dashcard dash-pie">
      <template #title> {{ name }} </template>
      <template #subtitle>
        {{ description }}
      </template>
      <template #content>
        <div class="p-d-flex p-flex-row p-jc-center p-ai-center loading-container" v-if="loading">
          <ProgressSpinner />
        </div>
        <Chart v-if="!loading" :key="'pie' + iri" type="pie" :data="chartConceptTypes" :options="chartOptions" :height="graphHeight" />
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
const palette = require("../../../node_modules/google-palette");
import { PieChartData } from "@/models/charts/PieChartData";
import { setTooltips, rescaleData } from "@/helpers/ChartRescale";
import { ChartOptions } from "@/models/charts/ChartOptions";
import { IM } from "@/vocabulary/IM";
import { RDFS } from "@/vocabulary/RDFS";
import { OWL } from "@/vocabulary/OWL";
import EntityService from "@/services/EntityService";
import { isArrayHasLength, isObject } from "@/helpers/DataTypeCheckers";

export default defineComponent({
  name: "ReportPieChart",
  props: ["iri"],
  data() {
    return {
      name: "",
      loading: true,
      description: "",
      chartOptions: {
        plugins: {
          legend: {
            position: "right",
            onHover: function(e: any) {
              e.native.target.style.cursor = "pointer";
            },
            onLeave: function(e: any) {
              e.native.target.style.cursor = "default";
            }
          }
        }
      } as ChartOptions,
      realData: [] as number[],
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
      ),
      graphHeight: 200
    };
  },
  async mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.setLegendOptions);
    });
    await this.setChartData();
    this.setLegendOptions();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setLegendOptions);
  },
  methods: {
    async setChartData(): Promise<void> {
      this.loading = true;
      const result = await EntityService.getPartialEntity(this.iri, [RDFS.LABEL, RDFS.COMMENT, IM.STATS_REPORT_ENTRY]);
      if (isObject(result) && isArrayHasLength(Object.keys(result))) {
        this.name = result[RDFS.LABEL];
        this.description = result[RDFS.COMMENT];
        for (const entry of result[IM.STATS_REPORT_ENTRY]) {
          this.chartConceptTypes.labels.push(entry[RDFS.LABEL]);
          this.chartConceptTypes.datasets[0].data.push(entry[OWL.HAS_VALUE]);
        }
        this.realData = { ...this.chartConceptTypes.datasets[0].data };
        // set tooltip to use real data
        this.chartOptions.plugins.tooltip = setTooltips(this.realData);
        // refactor data to a minimum graph size (1%) if less than min
        this.chartConceptTypes.datasets[0].data = rescaleData(this.chartConceptTypes.datasets[0].data);
        this.setChartColours(result[IM.STATS_REPORT_ENTRY].length);
      }
      this.loading = false;
    },

    setChartColours(colourCount: number): void {
      const colours = palette("tol-rainbow", colourCount);
      this.chartConceptTypes.datasets[0].backgroundColor = colours.map((color: string) => "#" + color + "BB");
      this.chartConceptTypes.datasets[0].hoverBackgroundColor = colours.map((color: string) => "#" + color);
    },

    setLegendOptions(): void {
      const width = window.innerWidth;
      if (width > 1750) {
        this.chartOptions.plugins.legend = {
          position: "right",
          labels: {
            boxWidth: 40,
            fontSize: 12
          },
          onHover: function(e: any) {
            e.native.target.style.cursor = "pointer";
          },
          onLeave: function(e: any) {
            e.native.target.style.cursor = "default";
          }
        };
      } else if (width > 1300) {
        this.chartOptions.plugins.legend = {
          position: "bottom",
          labels: {
            boxWidth: 20,
            fontSize: 10
          },
          onHover: function(e: any) {
            e.native.target.style.cursor = "pointer";
          },
          onLeave: function(e: any) {
            e.native.target.style.cursor = "default";
          }
        };
      } else if (width >= 1024) {
        this.chartOptions.plugins.legend = {
          position: "bottom",
          labels: {
            boxWidth: 10,
            fontSize: 8
          },
          onHover: function(e: any) {
            e.native.target.style.cursor = "pointer";
          },
          onLeave: function(e: any) {
            e.native.target.style.cursor = "default";
          }
        };
      } else if (width >= 892) {
        this.chartOptions.plugins.legend = {
          position: "right",
          labels: {
            boxWidth: 40,
            fontSize: 8
          },
          onHover: function(e: any) {
            e.native.target.style.cursor = "pointer";
          },
          onLeave: function(e: any) {
            e.native.target.style.cursor = "default";
          }
        };
      } else if (width >= 557) {
        this.chartOptions.plugins.legend = {
          position: "bottom",
          labels: {
            boxWidth: 20,
            fontSize: 6
          },
          onHover: function(e: any) {
            e.native.target.style.cursor = "pointer";
          },
          onLeave: function(e: any) {
            e.native.target.style.cursor = "default";
          }
        };
      } else if (width >= 0) {
        this.chartOptions.plugins.legend = {
          position: "bottom",
          labels: {
            boxWidth: 10,
            fontSize: 4
          },
          onHover: function(e: any) {
            e.native.target.style.cursor = "pointer";
          },
          onLeave: function(e: any) {
            e.native.target.style.cursor = "default";
          }
        };
      } else {
        this.chartOptions.plugins.legend = {
          display: false
        };
      }
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
