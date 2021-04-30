<template>
  <div class="dashboard-container">
    <!-- <mapping-module />
    <workflow-manager /> -->
    <ontology-overview />
    <concept-types :chartOptions="chartOptions" :graphHeight="graphHeight" />
    <concept-schemes :chartOptions="chartOptions" :graphHeight="graphHeight" />
    <concept-status :chartOptions="chartOptions" :graphHeight="graphHeight" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import MappingModule from "@/components/dashboard/MappingModule.vue";
import WorkflowManager from "@/components/dashboard/WorkflowManager.vue";
import OntologyOverview from "@/components/dashboard/OntologyOverview.vue";
import ConceptTypes from "@/components/dashboard/ConceptTypes.vue";
import ConceptSchemes from "@/components/dashboard/ConceptSchemes.vue";
import ConceptStatus from "@/components/dashboard/ConceptStatus.vue";

@Options({
  name: "Dashboard",
  components: {
    "mapping-module": MappingModule,
    "workflow-manager": WorkflowManager,
    "ontology-overview": OntologyOverview,
    "concept-types": ConceptTypes,
    "concept-schemes": ConceptSchemes,
    "concept-status": ConceptStatus
  },
  watch: {
    windowWidth: {
      immediate: true,
      handler(newValue) {
        this.setLegendOptions(newValue);
      }
    }
  }
})
export default class Dashboard extends Vue {
  msg!: string;
  chartOptions: any = {
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
  };
  windowHeight = 0;
  windowWidth = 0;
  graphHeight = 200;

  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });

    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  } // mounted end

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }

  onResize() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }

  setLegendOptions(width: number) {
    if (width > 1588) {
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
    } else if (width > 954) {
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
    } else if (width > 742) {
      this.chartOptions = {
        legend: {
          position: "right",
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
    } else {
      this.chartOptions = {
        legend: {
          display: false
        }
      };
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  grid-area: content;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "overview types"
    "schemes status";
  column-gap: 7px;
  row-gap: 7px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
