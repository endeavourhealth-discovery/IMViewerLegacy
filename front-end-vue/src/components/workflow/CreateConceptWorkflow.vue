<template>
  <Panel
    v-if="selectedWorkflow.value == 'createWorkflow'"
    header="Create Concept Workflow"
    :toggleable="true"
  >
    <DataTable
      :value="createTable"
      class="p-datatable-sm"
      :paginator="true"
      :rows="10"
      v-model:expandedRows="expandedRows"
      dataKey="taskId"
      stripedRows
      v-model:filters="filters"
    >
      <template #header>
        <div class="p-d-flex p-jc-between">
          <span>
            All tasks currently in the Create Concept Workflow
          </span>
          <span class="p-input-icon-left">
            <i class="pi pi-search" aria-hidden="true" />
            <InputText
              v-model="filters['global'].value"
              placeholder="Keyword Search"
            />
          </span>
        </div>
      </template>

      <!-- <template #header> Ontology Data </template> -->
      <Column :expander="true" headerStyle="width: 3rem" />
      <Column field="taskId" header="Task Id"></Column>
      <Column field="currentStep" header="Current Step"></Column>
      <Column field="status" header="Status"></Column>
      <Column field="author" header="Author"></Column>
      <Column field="createdDate" header="Created Date"></Column>
      <Column field="updatedDate" header="Updated Date"></Column>

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

export default defineComponent({
  name: "CreateConceptWorkflow",
  props: ["selectedWorkflow", "workflows"],
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
        name: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        "country.name": {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
        },
        balance: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        status: {
          operator: FilterOperator.OR,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
      } as Filters,
      expandedRows: [],
    };
  },
  mounted() {
    this.generateCreateTable();
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
  }
});
</script>

<style>

</style>
