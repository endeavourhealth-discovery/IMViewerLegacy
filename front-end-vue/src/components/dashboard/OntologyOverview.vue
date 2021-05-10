<template>
  <div class="dashcard-container">
    <Card class="dashcard dash-table">
      <template #title> Ontology overview </template>
      <template #subtitle>
        A brief overview of the concepts stored in the Ontology
      </template>
      <template #content>
        <DataTable
          v-if="!$store.state.loading.get('reportCategory')"
          :value="tableData"
          class="p-datatable-sm"
          :scrollable="true"
          scrollHeight="350px"
        >
          <template #header>
            Ontology data
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
import { mapState } from "vuex";
import ReportService from "@/services/ReportService";
import LoggerService from "@/services/LoggerService";
import { toSentenceCase } from "@/helpers/TextConverters";

@Options({
  name: "OntologyOverview",
  computed: mapState(["ontologyOverview"]),
  props: []
})
export default class OntologyOverview extends Vue {
  tableData: any = [];
  ontologyOverview!: [];

  mounted() {
    // table data
    store.commit("updateLoading", { key: "reportCategory", value: true });
    ReportService.getConceptCategoryReport()
      .then(res => {
        this.tableData = res.data;
        this.tableData.map((row: { count: number; label: string }) => {
          row.label = toSentenceCase(row.label);
        });
        store.commit("updateLoading", {
          key: "reportCategory",
          value: false
        });
      })
      .catch(err => {
        store.commit("updateLoading", {
          key: "reportCategory",
          value: false
        });
        this.$toast.add(
          LoggerService.error("Ontology Overview server request failed", err)
        );
      });
  } // mounted end
}
</script>

<style scoped>
.dashcard-container {
  grid-area: overview;
  height: 100%;
  width: 100%;
}

@media screen and (min-width: 1440px) {
  .dashcard-container {
    max-width: calc(35vw - 57.5px - 21px);
  }
}

@media screen and (min-width: 1024px) and (max-width: 1439px) {
  .dashcard-container {
    max-width: calc(32vw - 21px);
  }
}

@media screen and (max-width: 1023px) {
  .dashcard-container {
    max-width: calc(62vw - 21px);
  }
}
.dashcard {
  height: 100%;
  width: 100%;
}
</style>
