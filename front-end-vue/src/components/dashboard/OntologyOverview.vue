<template>
  <div class="p-col-6 dashcard-container">
    <Card class="dashcard dash-table">
      <template #title> Ontology Overview </template>
      <template #subtitle>
        A brief overview of the concepts stored in the Ontology
      </template>
      <template #content>
        <DataTable
          v-if="!$store.state.loading.get('reportCategory')"
          :value="tableData"
          class="p-datatable-sm"
          :scrollable="true"
          scrollHeight="250px"
        >
          <template #header>
            Ontology Data
          </template>
          <Column field="label" header="Label"></Column>
          <Column field="count" header="Total"></Column>
        </DataTable>
        <div
          class="p-d-flex p-flex-row p-jc-center p-ai-center loading-container"
          v-if="$store.state.loading.get('reportCategory')"
        >
          <ProgressSpinner />
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import store from "@/store/index";
import ReportService from "@/services/ReportService";

@Options({
  name: "OntologyOverview",
  props: []
})
export default class OntologyOverview extends Vue {
  tableData: any = [];

  mounted() {
    // table data
    store.commit("updateLoading", { key: "reportCategory", value: true });
    ReportService.getConceptCategoryReport()
      .then(res => {
        this.tableData = res.data;
        store.commit("updateLoading", { key: "reportCategory", value: false });
      })
      .catch(err => {
        console.log(err);
        store.commit("updateLoading", { key: "reportCategory", value: false });
        this.$toast.add({severity:'error', summary: 'Error', detail: 'Ontology Overview data failed to load', life: 3000})
      });
  }
}
</script>

<style scoped>
.dashcard {
  height: 100%;
}
</style>
