<template>
  <div class="p-col-9" style="height: calc(100vh - 123px); overflow: auto;">
    <div class="p-grid dashboard-container">
      <mapping-module />
      <workflow-manager />
      <ontology-overview :tableData="tableData" />
      <concept-types :chartConceptTypes="chartConceptTypes" :chartOptions="chartOptions" :graphHeight="graphHeight" />
      <concept-schemes :chartConceptSchemes="chartConceptSchemes" :chartOptions="chartOptions" :graphHeight="graphHeight" />
      <concept-status :chartConceptStatus="chartConceptStatus" :chartOptions="chartOptions" :graphHeight="graphHeight" />
    </div>
  </div>

</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ReportService from "@/services/ReportService";
import store from "@/store/index";
const palette = require("../../node_modules/google-palette");
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
    windowHeight: {
      immediate: true,
      handler(newValue, oldValue){
        this.setGraphHeight(newValue);
      }
    },
    windowWidth: {
      immediate: true,
      handler(newValue, oldValue){
        this.setLegendOptions(newValue);
      }
    }
  }
})
export default class Dashboard extends Vue {
  msg!: string;
  chartConceptTypes: any = {};
  chartConceptSchemes: any = {};
  chartConceptStatus: any = {};
  tableData: any = [];
  chartOptions: any = {
    legend: {
      position: 'right'
    }
  };
  windowHeight = 0;
  windowWidth = 0;
  graphHeight = 200;

  mounted(){

    // table data
    store.commit("updateLoading", {key: "reportCategory", value: true})
    ReportService.getConceptCategoryReport()
    .then(res => {
      this.tableData = res.data
      store.commit("updateLoading", {key: "reportCategory", value: false})
    })
    .catch(err => {
      console.log(err);
      store.commit("updateLoading", {key: "reportCategory", value: false})
    })

    // chart type
    store.commit("updateLoading", {key: "reportType", value: true})
    ReportService.getConceptTypeReport()
    .then(res => {
      this.chartConceptTypes = {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: []
          }]
      };
      for (const type of res.data){
        this.chartConceptTypes.labels.push(type.label);
        this.chartConceptTypes.datasets[0].data.push(type.count);
      }
      const length = Object.keys(res.data).length;
      const bgs = palette('tol-rainbow', length);
      const bgsFixed = bgs.map((color:string) => '#' + color)
      const hovers = palette('tol-rainbow', length);
      const hoversFixed = hovers.map((color:string) => '#' + color)
      const hoversLighter = hoversFixed.map((color: string) => this.colorLighter(color))
      this.chartConceptTypes.datasets[0].backgroundColor = bgsFixed;
      this.chartConceptTypes.datasets[0].hoverBackgroundColor = hoversLighter;
      store.commit("updateLoading", {key: "reportType", value: false})
    })
    .catch(err => {
      store.commit("updateLoading", {key: "reportType", value: false})
      console.log(err);
    })

    // chart scheme
    store.commit("updateLoading", {key: "reportScheme", value: true})
    ReportService.getConceptSchemeReport()
    .then(res => {
      this.chartConceptSchemes = {
        labels: [],
        datasets: [{
          data:[],
          backgroundColor: [],
          hoverBackgroundColor: []
        }]
      }
      for (const schema of res.data){
        this.chartConceptSchemes.labels.push(schema.label);
        this.chartConceptSchemes.datasets[0].data.push(schema.count);
      }
      const length = Object.keys(res.data).length;
      const bgs = palette('tol-rainbow', length);
      const bgsFixed = bgs.map((color:string) => '#' + color)
      const hovers = palette('tol-rainbow', length);
      const hoversFixed = hovers.map((color:string) => '#' + color);
      const hoversLighter = hoversFixed.map((color: string) => this.colorLighter(color))
      this.chartConceptSchemes.datasets[0].backgroundColor = bgsFixed;
      this.chartConceptSchemes.datasets[0].hoverBackgroundColor = hoversLighter;
      store.commit("updateLoading", {key: "reportScheme", value: false})
    })
    .catch(err => {
      store.commit("updateLoading", {key: "reportScheme", value: false})
      console.log(err);
    })

    // chart status
    store.commit("updateLoading", {key: "reportStatus", value: true})
    ReportService.getConceptStatusReport()
    .then(res => {
      this.chartConceptStatus = {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: []
        }]
      }
      for (const status of res.data){
        this.chartConceptStatus.labels.push(status.label);
        this.chartConceptStatus.datasets[0].data.push(status.count)
      }
      const length = Object.keys(res.data).length;
      const bgs = palette('tol-rainbow', length);
      const bgsFixed = bgs.map((color:string) => '#' + color)
      const hovers = palette('tol-rainbow', length);
      const hoversFixed = hovers.map((color:string) => '#' + color);
      const hoversLighter = hoversFixed.map((color: string) => this.colorLighter(color))
      this.chartConceptStatus.datasets[0].backgroundColor = bgsFixed;
      this.chartConceptStatus.datasets[0].hoverBackgroundColor = hoversLighter;
      store.commit("updateLoading", {key: "reportStatus", value: false})
    })
    .catch(err => {
      store.commit("updateLoading", {key: "reportStatus", value: false})
      console.log(err);
    })

    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })

    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;

  }

  beforeDestroy(){
    window.removeEventListener('resize', this.onResize);
  }

  onResize(){
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }

  setGraphHeight(windowHeight: number){
    // const header = document.getElementById('header-home');
    // const card = document.getElementById('module-card');
    // if (header && card){
    //   this.graphHeight = Math.floor((windowHeight - header.clientHeight - card.clientHeight)/16)
    //   if (this.graphHeight < 38){
    //     this.graphHeight = 38 //minimum height for graph to render
    //   }
    // } else {
    //   this.graphHeight = 100;
    // }
    if (this.windowHeight > 1000) {
      this.graphHeight = 200;
    } else if (this.windowHeight > 900) {
      this.graphHeight = 100;
    } else if (this.windowHeight > 800) {
      this.graphHeight = 750;
    } else {
      this.graphHeight = 50;
    }
  }

  colorLighter(color: string){
    const rgbColor = this.hexToRgb(color);
    if (rgbColor){
      const rDiff = (255 - rgbColor.r) * 0.5; //0.5 = 50% lighter than original colour
      const gDiff = (255 - rgbColor.g) * 0.5;
      const bDiff = (255 - rgbColor.b) * 0.5;
      const newHex = this.rgbToHex(Math.round(rgbColor.r + rDiff), Math.round(rgbColor.g + gDiff), Math.round(rgbColor.b + bDiff))
      return newHex
    }
  }

  hexToRgb(hex:string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  componentToHex(c:number) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  rgbToHex(r:number, g:number, b:number) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }

  setLegendOptions(width: number){
    if (width < 2041){
      this.chartOptions = {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 20,
            fontSize: 10
          }
        }
      }
    } else {
      this.chartOptions = {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 40,
            fontSize: 12
          }
        }
      }
    }
  }
}
</script>

<style scoped>

.dashboard-container {
  height: 100%;
}

</style>
