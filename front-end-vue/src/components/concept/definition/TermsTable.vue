<template>
  <div id="term-codes-container" :style="{ width: size }">
    <DataTable
      :value="data"
      :paginator="data.length > 5 ? true : false"
      :rows="5"
      id="term-codes-table"
    >
      <template #empty>
        No records found
      </template>
      <template #header>
        {{ label }}
      </template>
      <Column field="name" header="Name" :sortable="true">
        <template #body="slotProps">
          <div>
            {{ slotProps.data.name }}
          </div>
        </template>
      </Column>
      <Column field="code" header="Code" :sortable="true">
        <template #body="slotProps">
          <div>
            {{ slotProps.data.code || "None" }}
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "TermsTable",
  props: {
    label: { type: String },
    data: { type: Array as PropType<Array<unknown>> },
    size: { type: String }
  }
});
</script>

<style></style>
