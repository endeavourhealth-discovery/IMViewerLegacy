<template>
  <div class="p-grid dashboard-container">
    <div class="p-col-6 modulecard-container" id="module-card">
      <Card class="modulecard">
        <template #header>
          <font-awesome-icon
            :icon="['fas', 'map']"
            size="6x"
            style="color: orange; padding: 5px"
          />
        </template>
        <template #title> Mapping Module </template>
        <template #subtitle> Data model maps </template>
        <template #content>
          Data model maps specify how data is transformed from a data model to a
          particular database.
        </template>
        <template #footer>
          <Button label="Open Mapping Module" :disabled="true" />
      </template>
      </Card>
    </div>
    <div class="p-col-6 modulecard-container">
      <Card class="modulecard">
        <template #header>
          <font-awesome-icon
            :icon="['fas', 'tasks']"
            size="6x"
            style="color: brown; padding: 5px"
          />
        </template>
        <template #title> Workflow Manager </template>
        <template #subtitle> Helps to manage the workflow </template>
        <template #content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </template>
        <template #footer>
          <Button label="Open Workflow Manager Module" :disabled="true" />
      </template>
      </Card>
    </div>

    <div class="p-col-6 dashcard-container">
      <Card class="dashcard">
        <template #title> Ontology Overview </template>
        <template #subtitle>
          A brief overview of the concepts stored in the Ontology
        </template>
        <template #content>
          <DataTable :value="tableData" class="p-datatable-sm" :scrollable="true" scrollHeight="250px">
            <template #header>
                Ontology Data
            </template>
            <Column field="label" header="Label"></Column>
            <Column field="count" header="Total"></Column>
        </DataTable>
        </template>
      </Card>
    </div>

    <div class="p-col-6 dashcard-container">
      <Card class="dashcard">
        <template #title> Ontology Concept Types </template>
        <template #subtitle>
          A brief overview of the types of data stored in the Ontology
        </template>
        <template #content>
          <Chart type="pie" :data="chartConceptTypes" :options="chartOptions" :height="graphHeight" />
        </template>
      </Card>
    </div>

    <div class="p-col-6 dashcard-container">
      <Card class="dashcard">
        <template #title> Ontology Concept Schemes </template>
        <template #subtitle>
          A brief overview of the schemes of data stored in the Ontology
        </template>
        <template #content>
          <Chart type="pie" :data="chartConceptSchemes" :options="chartOptions" :height="graphHeight" />
        </template>
      </Card>
    </div>

    <div class="p-col-6 dashcard-container">
      <Card class="dashcard">
        <template #title> Ontology Concept Status </template>
        <template #subtitle>
          A brief overview of the status of concepts stored in the Ontology
        </template>
        <template #content>
          <Chart type="pie" :data="chartConceptStatus" :options="chartOptions" :height="graphHeight"/>
        </template>
      </Card>
    </div>
  </div>


</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ReportService from "@/services/ReportService";
const palette = require("../../../node_modules/google-palette");

@Options({
  name: "Dashboard",
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
    })
    .catch(err => {
      console.log(err);
    })

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
    })
    .catch(err => {
      console.log(err);
    })

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
    })

    ReportService.getConceptCategoryReport()
    .then(res => {
      this.tableData = res.data
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
    const header = document.getElementById('header-home');
    const card = document.getElementById('module-card');
    if (header && card){
      this.graphHeight = Math.floor((windowHeight - header.clientHeight - card.clientHeight)/16)
      if (this.graphHeight < 38){
        this.graphHeight = 38 //minimum height for graph to render
      }
    } else {
      this.graphHeight = 100;
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
    if (width < 1364){
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.dashboard-container {
  height: 100%;
}

.dashcard {
  height: 100%;
}

.modulecard {
  height: 100%;
}

.p-chart {
  height: fit-content;
}
/* @media (min-width: 1000px){
  .dashcard-container {
    max-height: 30vh;
}
} */

</style>
