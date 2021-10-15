<template>
  <div :id="id" class="dashcard-container">
    <Card class="dashcard dash-pie">
      <template #title>
        <span v-if="name">{{ name }}</span>
      </template>
      <template #subtitle>
        <span v-if="description">{{ description }}</span>
      </template>
      <template #content>
        <div class="p-d-flex p-flex-row p-jc-center p-ai-center loading-container" v-if="loading">
          <ProgressSpinner />
        </div>
        <div v-else class="chart-container">
          <Chart type="pie" :data="chartConceptTypes" :options="chartOptions" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
const palette = require("../../../node_modules/google-palette");
import { PieChartData } from "@/models/charts/PieChartData";
import { setTooltips, rescaleData } from "@/helpers/ChartRescale";
import { ChartOptions } from "@/models/charts/ChartOptions";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "ReportPieChart",
  props: {
    name: { type: String, required: false },
    description: { type: String, required: false },
    inputData: { type: Array as PropType<Array<any>>, required: true },
    id: { type: String, required: true },
    labelKey: { type: String, required: true },
    dataKey: { type: String, required: true }
  },
  data() {
    return {
      loading: true,
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
        },
        maintainAspectRatio: false
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
      )
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
    this.setChartData();
    this.onResize();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.setLegendOptions();
      this.setChartSize();
    },

    setChartData(): void {
      this.loading = true;
      for (const entry of this.inputData) {
        this.chartConceptTypes.labels.push(entry[this.labelKey]);
        this.chartConceptTypes.datasets[0].data.push(entry[this.dataKey]);
      }
      this.realData = { ...this.chartConceptTypes.datasets[0].data };
      // set tooltip to use real data
      this.chartOptions.plugins.tooltip = setTooltips(this.realData);
      // refactor data to a minimum graph size (1%) if less than min
      this.chartConceptTypes.datasets[0].data = rescaleData(this.chartConceptTypes.datasets[0].data);
      this.setChartColours(this.inputData.length);
      // }
      this.loading = false;
    },

    setChartColours(colourCount: number): void {
      const colours = palette("tol-rainbow", colourCount);
      this.chartConceptTypes.datasets[0].backgroundColor = colours.map((color: string) => "#" + color + "BB");
      this.chartConceptTypes.datasets[0].hoverBackgroundColor = colours.map((color: string) => "#" + color);
    },

    setChartSize(): void {
      const container = document.getElementById(this.id) as HTMLElement;
      if (!container) {
        LoggerService.error(undefined, `Failed to set chart size for element id: ${this.id}`);
        return;
      }
      const html = document.documentElement;
      const currentFontSize = parseFloat(window.getComputedStyle(html, null).getPropertyValue("font-size"));
      const title = container.getElementsByClassName("p-card-title")[0] as HTMLElement;
      const subTitle = container.getElementsByClassName("p-card-subtitle")[0] as HTMLElement;
      const content = container.getElementsByClassName("p-card-content")[0] as HTMLElement;
      let height = container.getBoundingClientRect().height;
      if (currentFontSize) {
        height -= currentFontSize * 2;
      }
      if (title) {
        height -= title.getBoundingClientRect().height;
      }
      if (subTitle) {
        height -= subTitle.getBoundingClientRect().height;
      }
      content.style.height = height + "px";
      content.style.maxHeight = height + "px";
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
.dashcard-container ::v-deep(.p-card-body) {
  height: 100%;
  width: 100%;
}

.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.dashcard {
  height: 100%;
  width: 100%;
}

.p-chart {
  height: 100%;
  width: 100%;
}

.loading-container {
  width: 100%;
  height: 100%;
}
</style>
