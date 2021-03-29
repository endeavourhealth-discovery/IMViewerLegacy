<template>
  <div class="p-grid">
    <div class="p-col-6">
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
    <div class="p-col-6">
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

    <div class="p-col-6">
      <Card class="dashcard">
        <template #title> Ontology Overview </template>
        <template #subtitle>
          A brief overview of the concepts stored in the Ontology
        </template>
        <template #content>
          <DataTable :value="tabledata" class="p-datatable-sm" :scrollable="true" scrollHeight="250px">
            <template #header>
                Ontology Data
            </template>
            <Column field="label" header="Label"></Column>
            <Column field="total" header="Total"></Column>
        </DataTable>
        </template>
      </Card>
    </div>

    <div class="p-col-6">
      <Card class="dashcard">
        <template #title> Ontology Concept Types </template>
        <template #subtitle>
          A brief overview of the types of data stored in the Ontology
        </template>
        <template #content>
          <Chart type="pie" :data="chartConceptTypes" :height="100" />
        </template>
      </Card>
    </div>

    <div class="p-col-6">
      <Card class="dashcard">
        <template #title> Ontology Concept Schemes </template>
        <template #subtitle>
          A brief overview of the schemes of data stored in the Ontology
        </template>
        <template #content>
          <Chart type="pie" :data="chartConceptSchemes" :height="100" />
        </template>
      </Card>
    </div>

    <div class="p-col-6">
      <Card class="dashcard">
        <template #title> Ontology Concept Status </template>
        <template #subtitle>
          A brief overview of the status of concepts stored in the Ontology
        </template>
        <template #content>
          <Chart type="pie" :data="chartConceptStatus" :height="100" />
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
  name: "Dashboard"
})
export default class Dashboard extends Vue {
  msg!: string;
  chartConceptTypes: any = {};
  chartConceptSchemes: any = {};
  chartConceptStatus: any = {};

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
      const bgsFixed = bgs.map(function(color:string){return '#' + color} )
      const hovers = palette('tol-dv', length);
      const hoversFixed = hovers.map(function(color:string){return '#' + color})
      this.chartConceptTypes.datasets[0].backgroundColor = bgsFixed;
      this.chartConceptTypes.datasets[0].hoverBackgroundColor = hoversFixed;
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
      const bgsFixed = bgs.map(function(color:string){return '#' + color} )
      const hovers = palette('tol-dv', length);
      const hoversFixed = hovers.map(function(color:string){return '#' + color})
      this.chartConceptSchemes.datasets[0].backgroundColor = bgsFixed;
      this.chartConceptSchemes.datasets[0].hoverBackgroundColor = hoversFixed;
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
      const bgsFixed = bgs.map(function(color:string){return '#' + color} )
      const hovers = palette('tol-dv', length);
      const hoversFixed = hovers.map(function(color:string){return '#' + color})
      this.chartConceptStatus.datasets[0].backgroundColor = bgsFixed;
      this.chartConceptStatus.datasets[0].hoverBackgroundColor = hoversFixed;
    })
  }

  tabledata = [
    {label: "Snomed-CT code", total: 1029846},
    {label: "EMIS local code", total: 1015779},
    {label: "CTV3 Code", total: 276841},
    {label: "Read 2 code", total: 156192},
    {label: "TPP local codes", total: 18902},
    {label: "ICD10 code", total: 17934},
    {label: "Term based code", total: 12079},
    {label: "OPCS4 code", total: 11251},
    {label: "Discovery code", total: 1972},
    {label: "N/A", total: 145},
    {label: "Barts Cerner code", total: 5},
  ]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.dashcard {
  height: 400px;
}

.modulecard {
  height: 300px;
}

</style>
