<template>
  <div v-if="selectedWorkflow" id="workflow-manager-container">
    <WorkflowTablePanel
      v-if="selectedWorkflow.value == 'createWorkflow'"
      :selectedWorkflow="selectedWorkflow"
      :workflowProgressOptions="createWorkflowProgressOptions"
      :tableData="tableData"
    />
    <WorkflowTablePanel
      v-if="selectedWorkflow.value == 'updateWorkflow'"
      :selectedWorkflow="selectedWorkflow"
      :workflowProgressOptions="updateWorkflowProgressOptions"
      :tableData="tableData"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WorkflowTablePanel from "@/components/workflow/WorkflowTablePanel.vue";
import { WorkflowItem } from "@/models/workflow/WorkFlowItem";

export default defineComponent({
  name: "WorkflowManager",
  props: ["selectedWorkflow"],
  components: { WorkflowTablePanel },
  watch: {
    selectedWorkflow(newValue) {
      if (newValue.value === "createWorkflow") {
        this.generateTable(this.createWorkflowProgressOptions);
      } else if (newValue.value === "updateWorkflow") {
        this.generateTable(this.updateWorkflowProgressOptions);
      }
    }
  },
  mounted() {
      if (this.selectedWorkflow.value === "createWorkflow") {
        this.generateTable(this.createWorkflowProgressOptions);
      } else if (this.selectedWorkflow.value === "updateWorkflow") {
        this.generateTable(this.updateWorkflowProgressOptions);
      }
  },
  data() {
    return {
      tableData: [] as any,
      updateWorkflowProgressOptions: [
        {
          taskName: "Request to change existing Concept",
          step: 1,
          automated: false,
          active: false
        },
        {
          taskName: "Create definition for updated Concept as Draft",
          step: 2,
          automated: false,
          active: false
        },
        {
          taskName: "Approve/Deny new definition for Concept",
          step: 3,
          automated: false,
          active: false
        },
        {
          taskName: "Replace concept definition and archive old concept",
          step: 4,
          automated: true,
          active: false
        }
      ] as WorkflowItem[],
      createWorkflowProgressOptions: [
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
    }
  },
  methods: {
    generateTable(progressOptions: WorkflowItem[]): void {
      this.tableData = [];
      let x = 100;
      let prefix = "";
      if (this.selectedWorkflow.value === "createWorkflow") {
        prefix = "Define concept ";
      } else if (this.selectedWorkflow.value === "updateWorkflow") {
        prefix = "Update concept ";
      }

      while (x > 0) {
        const currentStep = Math.floor(Math.random() * 4) + 1;
        this.tableData.push({
          taskId: prefix + Math.floor(Math.random() * 100) + 1,
          currentStep: currentStep,
          status: currentStep == 4 ? "Complete" : "In Progress",
          workflow: this.generateWorkflow(progressOptions, currentStep),
          author: "user " + Math.floor(Math.random() * 100) + 1,
          createdDate: new Date(),
          updatedDate: new Date()
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

<style scoped>
#workflow-manager-container {
  grid-area: workflow-content;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
}

.p-panel {
  min-height: 100%;
}
</style>
