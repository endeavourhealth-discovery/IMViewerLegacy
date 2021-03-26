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
          <Chart type="pie" :data="chartConceptTypes" height="100" />
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
          <Chart type="pie" :data="chartConceptSchemes" height="100" />
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
          <Chart type="pie" :data="chartConceptStatus" height="100" />
        </template>
      </Card>
    </div>
  </div>


</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ReportService from "@/services/ReportService";

@Options({
  name: "Dashboard"
})
export default class Dashboard extends Vue {
  msg!: string;
  chartConceptTypes: any = {};

  mounted(){
    ReportService.getConceptTypeReport()
    .then(res => {
      this.chartConceptTypes = {
      labels: [],
      datasets: [{data: [
      ],
        backgroundColor: ["#00876c", "#429a71", "#6aac77", "#8fbe7e", "#b4cf87", "#d9e094", "#fff1a3", "#fbd687", "#f7ba70", "#f29d5f", "#eb7f54", "#e15f50", "#d43d51"],
        hoverBackgroundColor: ["#00876c", "#3a966b", "#5da46a", "#7eb269", "#a1bf6a", "#c4ca6d", "#e8d575", "#eabe61", "#eaa653", "#e98d4b", "#e57449", "#de594c", "#d43d51"]}]
      };
      for (const type of res.data){
        this.chartConceptTypes.labels.push(type.label);
        this.chartConceptTypes.datasets[0].data.push(type.count);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  chartConceptSchemes = {
    // labels: ["Barts Cerner code", "CTV3 Code", "Discovery code", "EMIS local code", "Homerton Cerner code", "ICD10 code", "OPCS4 code", "Read 2 code", "Snomed-CT code", "TPP local codes", "Term based code"],
    labels: ["Snomed-CT code", "EMIS local code", "CTV3 Code", "Read 2 code", "TPP local codes", "ICD10 code", "Term based code", "OPCS4 code", "Discovery code", "N/A", "Barts Cerner code"],
    datasets: [
      {
        data: [1029846, 1015779, 276841, 156192, 18902, 17934, 12079, 11251, 1972, 145, 5],
        backgroundColor: ["#00876c", "#429a71", "#6aac77", "#8fbe7e", "#b4cf87", "#d9e094", "#fff1a3", "#fbd687", "#f7ba70", "#f29d5f", "#eb7f54", "#e15f50", "#d43d51"],
        hoverBackgroundColor: ["#00876c", "#3a966b", "#5da46a", "#7eb269", "#a1bf6a", "#c4ca6d", "#e8d575", "#eabe61", "#eaa653", "#e98d4b", "#e57449", "#de594c", "#d43d51"]
      }
    ]
  };

  chartConceptStatus = {
    labels: ["Active", "Draft", "Inactive"],
    datasets: [
      {
        data: [2220887, 129658, 283694],
        backgroundColor: ["#00876c", "#fff1a3","#d43d51"],
        hoverBackgroundColor: ["#00876c", "#e8d575", "#d43d51"]
      }
    ]
  };

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
