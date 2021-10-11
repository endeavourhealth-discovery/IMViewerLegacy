<template>
  <div class="dashcard-container">
    <Card class="dashcard dash-pie">
      <template #title> Catalogue instance types overview </template>
      <template #subtitle>
        A brief overview of the types of data stored in the Catalogue
      </template>
      <template #content>
        <div class="p-grid">
          <div class="p-col-6">
            <p style="margin-bottom: 1em; margin-top: 2em; text-align: center">
              <strong>Data Table</strong>
            </p>
            <DataTable :value="types" class="p-datatable-sm" :scrollable="true" scrollHeight="350px">
              <template #header>
                Types data
              </template>
              <Column field="label" header="Label"></Column>
              <Column field="count" header="Total"></Column>
            </DataTable>
          </div>
          <div class="p-col-6">
            <p style="margin-bottom: 1em; margin-top: 2em; text-align: center">
              <strong>Pie Chart</strong>
            </p>
            <Chart type="pie" :data="chartInstanceTypes" :options="chartOptions" :height="graphHeight" style="margin-left: 1em" class="p-chart" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ChartOptions } from "@/models/charts/ChartOptions";
import { PieChartData } from "@/models/charts/PieChartData";
import { rescaleData, setTooltips } from "@/helpers/ChartRescale";
import { PropType } from "@vue/runtime-core";
const palette = require("../../../node_modules/google-palette");

export default defineComponent({
  name: "TypesPieChart",
  props: {
    types: {
      type: Array as PropType<Array<unknown>>,
      required: true
    }
  },
  // watch: {
  //   types: {
  //   async  handler(newValue, oldValue) {
  //     if(newValue !== oldValue){
  //       await this.setChartData();
  //     }
  //     },
  //   deep: true
  //   }
  // },
  data() {
    return {
      chartInstanceTypes: new PieChartData(
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
      realData: {} as number[],
      graphHeight: 200
    };
  },
  mounted() {
    this.setChartData();
    this.setLegendOptions();
  },
  methods: {
    async setChartData() {
      this.types.forEach((type: any) => {
        this.chartInstanceTypes.labels.push(type.iri);
        this.chartInstanceTypes.datasets[0].data.push(type.count);
      });
      this.realData = { ...this.chartInstanceTypes.datasets[0].data };
      this.chartOptions["tooltips"] = setTooltips(this.realData);
      this.chartInstanceTypes.datasets[0].data = rescaleData(this.chartInstanceTypes.datasets[0].data);
      this.setChartColours(this.types.length);
    },
    setChartColours(colourCount: number): void {
      const colours = palette("tol-rainbow", colourCount);
      this.chartInstanceTypes.datasets[0].backgroundColor = colours.map((color: string) => "#" + color + "BB");
      this.chartInstanceTypes.datasets[0].hoverBackgroundColor = colours.map((color: string) => "#" + color);
    },
    setLegendOptions(): void {
      const width = window.innerWidth;
      if (width > 1750) {
        this.chartOptions.plugins = {
          legend: {
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
          }
        };
      } else if (width > 1300) {
        this.chartOptions.plugins = {
          legend: {
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
          }
        };
      } else if (width >= 1024) {
        this.chartOptions.plugins = {
          legend: {
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
          }
        };
      } else if (width >= 892) {
        this.chartOptions.plugins = {
          legend: {
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
          }
        };
      } else if (width >= 557) {
        this.chartOptions.plugins = {
          legend: {
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
          }
        };
      } else if (width >= 0) {
        this.chartOptions.plugins = {
          legend: {
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
          }
        };
      } else {
        this.chartOptions.plugins = {
          legend: {
            display: false
          }
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
    max-width: calc((35vw - 57.5px - 21px) * 2 + 10em);
  }
}

@media screen and (min-width: 1024px) and (max-width: 1439px) {
  .dashcard-container {
    max-width: calc((32vw - 21px) * 2 + 10em);
  }
}

@media screen and (max-width: 1023px) {
  .dashcard-container {
    max-width: calc((62vw - 21px) * 2 + 10em);
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
