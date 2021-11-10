<template>
  <div id="catalogue-search-results-container">
    <DataTable
      v-model:selection="selected"
      :value="searchResults"
      @row-select="setSelectedInstance()"
      selectionMode="single"
      class="p-datatable-sm"
      :scrollable="true"
      :paginator="true"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
      :rowsPerPageOptions="[15, 25, 50]"
      currentPageReportTemplate="Displaying {first} to {last} of {totalRecords}"
      :rows="15"
      @page="scrollToTop"
      :loading="loading"
    >
      <template #empty>None</template>
      <template #loading>Loading...</template>
      <Column field="name" header="Results">
        <template #body="slotProps">
          <div v-if="slotProps.data.name">
            <span>{{ slotProps.data.name }}</span>
          </div>
          <div v-else>
            <span>{{ slotProps.data["@id"] }}</span>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import { defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
  name: "CatalogueSearchResults",
  props: { searchResults: { type: Array as PropType<any[]> }, loading: { type: Boolean, required: true } },
  data() {
    return {
      selected: {} as any,
      currentSelected: ""
    };
  },
  methods: {
    setSelectedInstance() {
      if (!isObjectHasKeys(this.selected, ["@id"])) {
        this.selected = this.currentSelected;
      }
      this.$router.push({
        name: "Individual",
        params: { selectedIri: this.selected["@id"] }
      });
      this.currentSelected = this.selected;
    },

    scrollToTop(): void {
      const resultsContainer = document.getElementById("catalogue-search-results-container") as HTMLElement;
      const scrollBox = resultsContainer?.getElementsByClassName("p-datatable-wrapper")[0] as HTMLElement;
      if (scrollBox) {
        scrollBox.scrollTop = 0;
      }
    }
  }
});
</script>

<style scoped></style>
