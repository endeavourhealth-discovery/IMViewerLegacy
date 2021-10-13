<template>
  <div class="dashcard-container">
    <Card class="dashcard dash-table">
      <template #title>
        <span v-if="name">{{ name }}</span>
      </template>
      <template #subtitle>
        <span v-if="description">{{ description }}</span>
      </template>
      <template #content>
        <DataTable :value="tableData" class="p-datatable-sm" :scrollable="true" scrollHeight="350px">
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
import { defineComponent, PropType } from "vue";
import { RDFS } from "@/vocabulary/RDFS";
import { OWL } from "@/vocabulary/OWL";

export default defineComponent({
  name: "ReportTable",
  props: {
    name: { type: String, required: false },
    description: { type: String, required: false },
    inputData: { type: Array as PropType<Array<any>>, required: true }
  },
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
      for (const entry of this.inputData) {
        this.tableData.push({
          label: entry[RDFS.LABEL],
          count: +entry[OWL.HAS_VALUE]
        });
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
