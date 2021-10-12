<template>
  <div class="dashcard-container">
    <Card class="dashcard dash-table">
      <template #title> Ontology overview </template>
      <template #subtitle>
        A brief overview of the concepts stored in the Ontology
      </template>
      <template #content>
        <div class="p-d-flex p-flex-row p-jc-center p-ai-center loading-container" v-if="loading">
          <ProgressSpinner />
        </div>
        <DataTable v-else :value="tableData" class="p-datatable-sm" :scrollable="true" scrollHeight="350px">
          <template #header>
            Ontology data
          </template>
          <Column field="label" header="Label"></Column>
          <Column field="count" header="Total"></Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IM } from "@/vocabulary/IM";
import { RDFS } from "@/vocabulary/RDFS";
import { OWL } from "@/vocabulary/OWL";
import EntityService from "@/services/EntityService";
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";

export default defineComponent({
  name: "ReportTable",
  props: { iri: { type: String, required: true } },
  data() {
    return {
      tableData: [] as { count: number; label: string }[],
      loading: false
    };
  },
  async mounted() {
    await this.getReportTableData();
  },
  methods: {
    async getReportTableData(): Promise<void> {
      this.loading = true;
      const result = await EntityService.getPartialEntity(this.iri, [RDFS.LABEL, RDFS.COMMENT, IM.STATS_REPORT_ENTRY]);
      if (isObjectHasKeys(result, [IM.STATS_REPORT_ENTRY])) {
        this.tableData = [] as { count: number; label: string }[];
        for (const entry of result[IM.STATS_REPORT_ENTRY]) {
          this.tableData.push({
            label: entry[RDFS.LABEL],
            count: +entry[OWL.HAS_VALUE]
          });
        }
      }
      this.loading = false;
    }
  }
});
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
