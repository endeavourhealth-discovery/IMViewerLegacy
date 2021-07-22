<template>
  <DataTable
    :value="members"
    v-model:selection="selectedMember"
    selectionMode="multiple"
    dataKey="code"
    :metaKeySelection="false"
    filterDisplay="menu"
    :globalFilterFields="['entity.name']"
    :paginator="members.length > 25 ? true : false"
    :scrollable="true"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
    :rowsPerPageOptions="[25, 50, 100]"
    currentPageReportTemplate="Displaying {first} to {last} of {totalRecords} results"
    :rows="25"
  >
    <template #header>
      <div class="p-d-flex p-jc-between p-ai-center">
        <h5 class="p-m-0">{{ memberType }}</h5>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="filters['global'].value"
            placeholder="Keyword Search"
          />
        </span>
      </div>
    </template>
    <template #empty>
      No members selected
    </template>
    <Column selectionMode="multiple" headerStyle="width: 3rem" />
    <Column field="entity.name" header="Name" :sortable="true">
      <!-- <template #filter="{ filterModel }">
        <InputText
          type="text"
          v-model="filterModel.name"
          class="p-column-filter"
          placeholder="Search by name"
        />
      </template> -->
    </Column>
    <Column
      header="Remove"
      headerStyle="width: 4rem; text-align: center"
      bodyStyle="text-align: center; overflow: visible"
    >
      <template #body>
        <Button type="button" icon="pi pi-minus" class="p-button-danger" />
      </template>
    </Column>
  </DataTable>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FilterMatchMode } from "primevue/api";

export default defineComponent({
  name: "MemberPickerTable",
  props: ["members", "memberType"],
  data() {
    return {
      selectedMember: {} as any,
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
      }
    };
  }
});
</script>

<style scoped></style>
