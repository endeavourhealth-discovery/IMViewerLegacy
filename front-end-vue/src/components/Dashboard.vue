<template>
  <div class="p-grid">
    <div class="p-col-6">
      <Card>
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
          <Button label="Open Mapping Module" />
      </template>
      </Card>
    </div>
    <div class="p-col-6">
      <Card>
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
          <Button label="Open Workflow Manager Module" />
      </template>
      </Card>
    </div>

    <div class="p-col-6">
      <Card>
        <template #title> Ontology Overview </template>
        <template #subtitle>
          A brief overview of the concepts stored in the Ontology
        </template>
        <template #content>
          <DataTable :value="tabledata" class="p-datatable-sm">
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
      <Card>
        <template #title> Ontology Concept Types </template>
        <template #subtitle>
          A brief overview of the types of data stored in the Ontology
        </template>
        <template #content>
          <Chart type="pie" :data="chartConceptTypes" height="100"/>
        </template>
      </Card>
    </div>

    <div class="p-col-6">
      <Card>
        <template #title> Ontology Concept Schemes </template>
        <template #subtitle>
          A brief overview of the schemes of data stored in the Ontology
        </template>
        <template #content>
          <Chart type="pie" :data="chartConceptSchemes" height="100"/>
        </template>
      </Card>
    </div>

    <div class="p-col-6">
      <Card>
        <template #title> Ontology Concept Status </template>
        <template #subtitle>
          A brief overview of the status of concepts stored in the Ontology
        </template>
        <template #content>
          <Chart type="pie" :data="chartConceptStatus" height="100"/>
        </template>
      </Card>
    </div>
  </div>

  
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class Dashboard extends Vue {
  msg!: string;

  chartConceptTypes = {
    labels: ["Class", "ObjectProperty", "DataProperty", "DataType", "Annotation", "Individual", "Record", "ValueSet", "Folder", "Term", "Legacy", "CategoryGroup"],
    datasets: [
      {
        data: [300, 50, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        backgroundColor: ["#00876c", "#429a71", "#6aac77", "#8fbe7e", "#b4cf87", "#d9e094", "#fff1a3", "#fbd687", "#f7ba70", "#f29d5f", "#eb7f54", "#e15f50", "#d43d51"],
        hoverBackgroundColor: ["#00876c", "#3a966b", "#5da46a", "#7eb269", "#a1bf6a", "#c4ca6d", "#e8d575", "#eabe61", "#eaa653", "#e98d4b", "#e57449", "#de594c", "#d43d51"]
      }
    ]
  };

  chartConceptSchemes = {
    labels: ["Barts Cerner code", "CTV3 Code", "Discovery code", "EMIS local code", "Homerton Cerner code", "ICD10 code", "OPCS4 code", "Read 2 code", "Snomed-CT code", "TPP local codes", "Term based code"],
    datasets: [
      {
        data: [300, 50, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        backgroundColor: ["#00876c", "#429a71", "#6aac77", "#8fbe7e", "#b4cf87", "#d9e094", "#fff1a3", "#fbd687", "#f7ba70", "#f29d5f", "#eb7f54", "#e15f50", "#d43d51"],
        hoverBackgroundColor: ["#00876c", "#3a966b", "#5da46a", "#7eb269", "#a1bf6a", "#c4ca6d", "#e8d575", "#eabe61", "#eaa653", "#e98d4b", "#e57449", "#de594c", "#d43d51"]
      }
    ]
  };

  chartConceptStatus = {
    labels: ["Active", "Draft", "Inactive"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#00876c", "#fff1a3","#d43d51"],
        hoverBackgroundColor: ["#00876c", "#e8d575", "#d43d51"]
      }
    ]
  };

  tabledata = [
    {label: "Semantic Concepts", total: 1000},
    {label: "Datamodels", total: 1000},
    {label: "Valuesets", total: 1000},
    {label: "type4", total: 1000},
    {label: "type5", total: 1000},
    {label: "type6", total: 1000},
  ]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
