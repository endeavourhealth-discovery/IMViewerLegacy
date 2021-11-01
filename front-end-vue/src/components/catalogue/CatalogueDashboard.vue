<template>
  <div class="catalogue-dashboard-container">
    <Card class="dashboard-card" style="height: 100%">
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
              <ResizeablePieChart :inputData="types" id="catalogue-pie-chart" labelKey="label" dataKey="count" />
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
import ResizeablePieChart from "@/components/generics/ResizeablePieChart.vue";

export default defineComponent({
  name: "CatalogueDashboard",
  props: {
    types: {
      type: Array as PropType<Array<unknown>>,
      required: true
    }
  },
  components: {
    ResizeablePieChart
  }
});
</script>

<style scoped></style>
