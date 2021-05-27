<template>
    <DataTable
      :value="tableData"
      class="p-datatable-sm"
      :paginator="true"
      :scrollable="true"
      scrollHeight="flex"
      :rowsPerPageOptions="[10, 25, 50]"
      :rows="10"
      v-model:expandedRows="expandedRows"
      dataKey="taskId"
      stripedRows
      v-model:filters="filters"
      filterDisplay="menu"
      :globalFilterFields="[
        'taskId',
        'currentStep',
        'status',
        'author',
        'createdDate',
        'updatedDate'
      ]"
    >
      <template #header>
        <div class="p-d-flex p-jc-between p-ai-center">
          <div class="p-d-flex p-ai-center">
            <p id="workflow-table-header-text" >{{ selectedWorkflow.name }}</p>
          </div>
          <div id="button-search-container">
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              class="p-button-outlined"
              @click="clearFilters"
            />
            <span id="workflow-table-search" class="p-input-icon-left">
              <i class="pi pi-search" aria-hidden="true" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </div>
        </div>
      </template>

      <template #loading>
        <!-- add spinner here -->
      </template>

      <!-- <template #header> Ontology Data </template> -->
      <Column :expander="true" headerStyle="width: 3rem" />
      <Column field="taskId" header="Task Id" filterField="taskId">
        <template #filter="{filterModel}">
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Search by task id"
          />
        </template>
      </Column>
      <Column
        field="currentStep"
        header="Current Step"
        filterField="currentStep"
        :showFilterMatchModes="false"
      >
        <template #filter="{filterModel}">
          <div class="p-text-bold">Step picker</div>
          <MultiSelect
            v-model="filterModel.value"
            :options="stepOptions"
            optionLabel="step"
            placeholder="Any"
            class="p-column-filter"
          >
            <template #options="slotProps">
              <div class="p-multiselect-representative-option">
                <span>{{ slotProps.option.step }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column
        field="status"
        header="Status"
        filterField="status"
        :showFilterMatchModes="false"
      >
        <template #filter="{filterModel}">
          <div class="p-text-bold">Status picker</div>
          <MultiSelect
            v-model="filterModel.value"
            :options="statusOptions"
            optionLabel="status"
            placeholder="Any"
            class="p-column-filter"
          >
            <template #options="slotProps">
              <div class="p-multiselect-representative-option">
                <span>{{ slotProps.option.status }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column field="author" header="Author" filterField="author">
        <template #filter="{filterModel}">
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Search by author"
          />
        </template>
      </Column>
      <Column
        field="createdDate"
        header="Created Date"
        dataType="date"
        filterField="createdDate"
      >
        <template #body="{data}">
          {{ formatDate(data.createdDate) }}
        </template>
        <template #filter="{filterModel}">
          <Calendar
            v-model="filterModel.value"
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yyyy"
          />
        </template>
      </Column>
      <Column
        field="updatedDate"
        header="Updated Date"
        filterField="updatedDate"
        dataType="date"
      >
        <template #body="{data}">
          {{ formatDate(data.updatedDate) }}
        </template>
        <template #filter="{filterModel}">
          <Calendar
            v-model="filterModel.value"
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yyyy"
          />
        </template>
      </Column>

      <template #expansion="slotProps">
        <div class="orders-subtable" style="width: 100%">
          <Timeline
            :value="slotProps.data.workflow"
            layout="horizontal"
            align="bottom"
          >
            <template #opposite="slotProps">
              <div v-if="slotProps.item.active">
                Current task: {{ slotProps.item.active }}
              </div>
              <div
                class="p-grid"
                v-if="slotProps.item.step == 3 && slotProps.item.active"
              >
                <div class="p-col-4">
                  <Button label="Approve" />
                </div>
                <div class="p-col-4">
                  <Button label="Deny" class="p-button-secondary" />
                </div>
              </div>
            </template>
            <template #content="slotProps">
              {{ slotProps.item.taskName }}
            </template>
          </Timeline>
        </div>
      </template>
    </DataTable>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { Filters } from "@/models/workflow/Filters";

export default defineComponent({
  name: "WorkflowTablePanel",
  props: ["selectedWorkflow", "workflowProgressOptions", "tableData"],
  data() {
    return {
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        taskId: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        },
        currentStep: {
          value: null,
          matchMode: FilterMatchMode.IN
        },
        status: {
          value: null,
          matchMode: FilterMatchMode.IN
        },
        author: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        createdDate: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
        },
        updatedDate: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
        }
      } as Filters,
      expandedRows: [],
      stepOptions: [
        { step: 1 },
        { step: 2 },
        { step: 3 },
        { step: 4 },
        { step: 5 }
      ] as { step: number }[],
      statusOptions: [{ status: "In Progress" }, { status: "Complete" }] as {
        status: string;
      }[]
    };
  },
  methods: {
    clearFilters() {
      this.initFilters();
    },

    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        taskId: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        },
        currentStep: {
          value: null,
          matchMode: FilterMatchMode.IN
        },
        status: {
          value: null,
          matchMode: FilterMatchMode.IN
        },
        author: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        createdDate: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
        },
        updatedDate: {
          operator: FilterOperator.OR,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
        }
      } as Filters;
    },

    formatDate(value: Date): string {
      return value.toLocaleDateString("en-UK");
    }
  }
});
</script>

<style scoped>
#workflow-table-search {
  margin-left: 1rem;
}

.p-datatable {
  border: solid #dee2e6 1px;
}
</style>
