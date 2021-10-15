<template>
  <div class="catalogue-dashboard-container">
    <Card class="dashboard-card">
      <template #title> Catalogue instance types overview </template>
      <template #subtitle>
        A brief overview of the types of data stored in the Catalogue
      </template>
      <template #content>
        <div class="p-grid">
          <div class="p-col-6">
            <p style="margin-bottom: 1em; margin-top: 2em; text-align: center">
              <strong>Data Table</strong>
            </p>
            <DataTable :value="types" class="p-datatable-sm" :scrollable="true" scrollHeight="350px">
              <template #header>
                Types data
              </template>
              <Column field="label" header="Label"></Column>
              <Column field="count" header="Total"></Column>
            </DataTable>
          </div>
          <div class="p-col-6">
            <p style="margin-bottom: 1em; margin-top: 2em; text-align: center">
              <strong>Pie Chart</strong>
            </p>
            <div class="pie-chart-container">
              <ReportPieChart name="Pie chart" description="Description" :inputData="types" id="catalogue-pie-chart" labelKey="label" dataKey="count" />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PropType } from "@vue/runtime-core";
import ReportPieChart from "@/components/dashboard/ReportPieChart.vue";

export default defineComponent({
  name: "CatalogueDashboard",
  props: {
    types: {
      type: Array as PropType<Array<unknown>>,
      required: true
    }
  },
  components: {
    ReportPieChart
  }
});
</script>

<style scoped>
@media screen and (min-width: 1024px) {
  .pie-chart-container ::v-deep(.dashcard-container) {
    height: 100%;
    width: 100%;
  }
}

@media screen and (max-width: 1023px) {
  .pie-chart-container ::v-deep(.dashcard-container) {
    height: 100%;
    width: 100%;
  }
}
</style>
