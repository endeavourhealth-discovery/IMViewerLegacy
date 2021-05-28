<template>
  <div class="dashboard-container">
    <report-table
      key="conceptCategory"
      iri="http://endhealth.info/im#ontologyOverview"
    />
    <report-pie-chart
      key="conceptTypes"
      :chartOptions="chartOptions"
      :graphHeight="graphHeight"
      iri="http://endhealth.info/im#ontologyConceptTypes"
    />
    <report-pie-chart
      key="conceptSchemes"
      :chartOptions="chartOptions"
      :graphHeight="graphHeight"
      iri="http://endhealth.info/im#ontologyConceptSchemes"
    />
    <report-pie-chart
      key="conceptStatus"
      :chartOptions="chartOptions"
      :graphHeight="graphHeight"
      iri="http://endhealth.info/im#ontologyConceptStatus"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ReportTable from "@/components/dashboard/ReportTable.vue";
import ReportPieChart from "@/components/dashboard/ReportPieChart.vue";
import { ChartOptions } from "@/models/charts/ChartOptions";

export default defineComponent({
  name: "Dashboard",
  components: {
    "report-table": ReportTable,
    "report-pie-chart": ReportPieChart
  },
  watch: {
    windowWidth(newValue) {
      this.setLegendOptions(newValue);
    }
  },
  data() {
    return {
      chartOptions: {
        legend: {
          position: "right",
          onHover: function(e: any) {
            e.target.style.cursor = "pointer";
          }
        },
        hover: {
          onHover: function(e: any) {
            e.target.style.cursor = "default";
          }
        }
      } as ChartOptions,
      windowHeight: 0,
      windowWidth: 0,
      graphHeight: 200
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });

    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize(): void {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
    },

    setLegendOptions(width: number): void {
      if (width > 1750) {
        this.chartOptions = {
          legend: {
            position: "right",
            labels: {
              boxWidth: 40,
              fontSize: 12
            },
            onHover: function(e: any) {
              e.target.style.cursor = "pointer";
            }
          },
          hover: {
            onHover: function(e: any) {
              e.target.style.cursor = "default";
            }
          }
        };
      } else if (width > 1300) {
        this.chartOptions = {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 20,
              fontSize: 10
            },
            onHover: function(e: any) {
              e.target.style.cursor = "pointer";
            }
          },
          hover: {
            onHover: function(e: any) {
              e.target.style.cursor = "default";
            }
          }
        };
      } else if (width >= 1024) {
        this.chartOptions = {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 10,
              fontSize: 8
            },
            onHover: function(e: any) {
              e.target.style.cursor = "pointer";
            }
          },
          hover: {
            onHover: function(e: any) {
              e.target.style.cursor = "default";
            }
          }
        };
      } else if (width >= 892) {
        this.chartOptions = {
          legend: {
            position: "right",
            labels: {
              boxWidth: 40,
              fontSize: 8
            },
            onHover: function(e: any) {
              e.target.style.cursor = "pointer";
            }
          },
          hover: {
            onHover: function(e: any) {
              e.target.style.cursor = "default";
            }
          }
        };
      } else if (width >= 557) {
        this.chartOptions = {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 20,
              fontSize: 6
            },
            onHover: function(e: any) {
              e.target.style.cursor = "pointer";
            }
          },
          hover: {
            onHover: function(e: any) {
              e.target.style.cursor = "default";
            }
          }
        };
      } else if (width >= 0) {
        this.chartOptions = {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 10,
              fontSize: 4
            },
            onHover: function(e: any) {
              e.target.style.cursor = "pointer";
            }
          },
          hover: {
            onHover: function(e: any) {
              e.target.style.cursor = "default";
            }
          }
        };
      } else {
        this.chartOptions = {
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
.dashboard-container {
  grid-area: content;
  display: grid;
  column-gap: 7px;
  row-gap: 7px;
  width: 100%;
  height: calc(100vh - 2rem);
  overflow-y: auto;
  overflow-x: hidden;
}

@media screen and (min-width: 1024px) {
  .dashboard-container {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
      "overview types"
      "schemes status";
  }
}

@media screen and (max-width: 1023px) {
  .dashboard-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-areas:
      "overview"
      "types"
      "schemes"
      "status";
  }
}
</style>
