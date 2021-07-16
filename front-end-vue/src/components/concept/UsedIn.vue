<template>
  <div id="usedIn-table-container" class="p-field">
    <DataTable
      :value="usages"
      responsiveLayout="scroll"
      :scrollable="true"
      showGridlines
      class="p-datatable-sm"
      scrollHeight="flex"
      :totalRecords="records"
      :rows="15"
      :paginator="true"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="Displaying {currentPage} of {totalPages} pages"
      :lazy="true"
      @page="getPage($event.originalEvent.page)"
      :loading="loading"
    >
      <template #empty>
        No records found.
      </template>
      <template #loading>
        Loading data. Please wait.
      </template>
      <Column field="name" filter-field="name" header="Name">
        <template #body="slotProps">
          {{ slotProps.data.name }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script lang="ts">
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { defineComponent } from "@vue/runtime-core";
import { FilterMatchMode } from "primevue/api";

export default defineComponent({
  name: "UsedIn",
  components: {},
  props: {
    conceptIri: String as any
  },

  async mounted() {
    if (this.conceptIri) {
      await this.getUsages(this.conceptIri, this.currentPage, this.pageSize);
      await this.getRecordsSize(this.conceptIri);
    }
  },
  data() {
    return {
      selectedUsage: {},
      usages: [],
      loading: false,
      filters1: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
      },
      selected: {} as any,
      records: 0,
      filters: {
        name: { value: "", matchMode: "contains" }
      },
      currentPage: 1,
      pageSize: 15
    };
  },
  methods: {
    async getUsages(iri: string, pageIndex: number, pageSize: number) {
      this.loading = true;
      await EntityService.getEntityUsages(iri, pageIndex, pageSize)
        .then(res => {
          this.usages = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error("Failed to get usages from server", err)
          );
        });
      this.loading = false;
    },

    async getRecordsSize(iri: string) {
      await EntityService.getUsagesTotalRecords(iri).then(res => {
        this.records = res.data;
      });
    },

    async getPage(page: any) {
      this.currentPage = page;
      await this.getUsages(this.conceptIri, this.currentPage, this.pageSize);
    }
  }
});
</script>

<style scoped>
.usage-mapping-container {
  width: 100%;
}

.mapping-container {
  width: 50%;
}

.usage-container {
  width: 50%;
}

#usedIn-table-container {
  flex-grow: 5;
  overflow-y: auto;
}

#usedIn-table-container ::v-deep(.p-datatable) {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

#usedIn-table-container ::v-deep(.p-datatable-wrapper) {
  flex-grow: 6;
}
</style>
