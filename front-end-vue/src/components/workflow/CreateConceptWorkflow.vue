<template>
  <Panel header="Create Concept Workflow" :toggleable="true">
    <DataTable
      :value="createTable"
      class="p-datatable-sm"
      :paginator="true"
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
        <div class="p-d-flex p-jc-between">
          <span>
            All tasks currently in the Create Concept Workflow
          </span>
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
  </Panel>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { WorkflowItem } from "@/models/workflow/WorkFlowItem";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { Filters } from "@/models/workflow/Filters";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "CreateConceptWorkflow",
  props: ["selectedWorkflow"],
  data() {
    return {
      createTable: [] as any,
      createWorkflow: [
        {
          taskName: "Request to create new Concept",
          step: 1,
          automated: false,
          active: false
        },
        {
          taskName: "Create definition for new Draft Concept",
          step: 2,
          automated: false,
          active: false
        },
        {
          taskName: "Approve/Deny definition for Concept",
          step: 3,
          automated: false,
          active: false
        },
        {
          taskName: "Change concept status to Active",
          step: 4,
          automated: true,
          active: false
        }
      ] as WorkflowItem[],
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
  mounted() {
    window.addEventListener("resize", this.setContentHeight);

    this.setContentHeight();
    this.generateCreateTable();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setContentHeight);
  },
  methods: {
    generateCreateTable(): void {
      let x = 100;

      while (x > 0) {
        const currentStep = Math.floor(Math.random() * 4) + 1;
        this.createTable.push({
          taskId: "Define concept " + Math.floor(Math.random() * 100) + 1,
          currentStep: currentStep,
          status: currentStep == 4 ? "Complete" : "In Progress",
          workflow: this.generateWorkflow(this.createWorkflow, currentStep),
          author: "user " + Math.floor(Math.random() * 100) + 1,
          createdDate: new Date().toDateString(),
          updatedDate: new Date().toDateString()
        });
        x--;
      }
    },

    generateWorkflow(workflow: WorkflowItem[], step: number): WorkflowItem[] {
      const customWorkFlow: WorkflowItem[] = [];
      // console.log(workflow);

      workflow.forEach((item: WorkflowItem) => {
        if (item.step == step) {
          customWorkFlow.push({
            taskName: item.taskName,
            step: item.step,
            automated: item.automated,
            active: true
          });
        } else {
          customWorkFlow.push(item);
        }
      });

      return customWorkFlow;
    },

    setContentHeight(): void {
      const container = document.getElementById(
        "workflow-manager-container"
      ) as HTMLElement;
      const header = container.getElementsByClassName(
        "p-panel-header"
      )[0] as HTMLElement;
      const content = container.getElementsByClassName(
        "p-panel-content"
      )[0] as HTMLElement;
      if (content && header && container) {
        const calcHeight =
          container.getBoundingClientRect().height -
          header.getBoundingClientRect().height +
          "px";
        content.style.minHeight = calcHeight;
      } else {
        LoggerService.error(
          "Content sizing error",
          "failed to get element(s) for concept content resizing"
        );
      }
    },

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
    }
  }
});
</script>

<style scoped>
#workflow-table-search {
  margin-left: 1rem;
}
</style>
