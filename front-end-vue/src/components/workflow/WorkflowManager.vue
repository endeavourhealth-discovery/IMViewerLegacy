<template>
  <div v-if="selectedWorkflow" id="workflow-manager-container">
    <WorkflowTablePanel
      v-if="selectedWorkflow.value == 'allItems'"
      :selectedWorkflow="selectedWorkflow"
      :workflowProgressOptions="allItemsProgressOptions"
      :tableData="tableData"
    />
    <WorkflowTablePanel
      v-if="selectedWorkflow.value == 'conceptNew'"
      :selectedWorkflow="selectedWorkflow"
      :workflowProgressOptions="conceptNewProgressOptions"
      :tableData="tableData"
    />
    <WorkflowTablePanel
      v-if="selectedWorkflow.value == 'conceptUpdated'"
      :selectedWorkflow="selectedWorkflow"
      :workflowProgressOptions="conceptUpdatedProgressOptions"
      :tableData="tableData"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WorkflowTablePanel from "@/components/workflow/WorkflowTablePanel.vue";
import { WorkflowItem } from "@/models/workflow/WorkFlowItem";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "WorkflowManager",
  props: ["selectedWorkflow", "containerHeight"],
  components: { WorkflowTablePanel },
  watch: {
    selectedWorkflow(newValue) {
      // these will be API calls
      if (newValue.value === "allItems") {
        this.generateTable(this.allItemsProgressOptions);
      } else if (newValue.value === "conceptNew") {
        this.generateTable(this.conceptNewProgressOptions);
      } else if (newValue.value === "conceptUpdated") {
        this.generateTable(this.conceptUpdatedProgressOptions);
      }
    },
    containerHeight() {
      this.setContentHeight();
    }
  },
  mounted() {
    this.setContentHeight();
    // these will be API calls
    if (this.selectedWorkflow.value === "allItems") {
      this.generateTable(this.allItemsProgressOptions);
    } else if (this.selectedWorkflow.value === "conceptNew") {
      this.generateTable(this.conceptNewProgressOptions);
    } else if (this.selectedWorkflow.value === "conceptUpdated") {
      this.generateTable(this.conceptUpdatedProgressOptions);
    }
  },
  data() {
    return {
      tableData: [] as any,
      allItemsProgressOptions: [
        {
          taskName: "Request to create/update item",
          step: 1,
          automated: false,
          active: false
        },
        {
          taskName: "Create definition for updated item as Draft",
          step: 2,
          automated: false,
          active: false
        },
        {
          taskName: "Approve/Deny new definition for item",
          step: 3,
          automated: false,
          active: false
        },
        {
          taskName: "Replace item definition and archive old concept",
          step: 4,
          automated: true,
          active: false
        }
      ],
      conceptUpdatedProgressOptions: [
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
      conceptNewProgressOptions: [
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
      if (this.selectedWorkflow.value === "allItems") {
        prefix = "Item ";
      } else if (this.selectedWorkflow.value === "conceptNew") {
        prefix = "Define concept ";
      } else if (this.selectedWorkflow.value === "conceptUpdated") {
        prefix = "Update concept ";
      } else {
        prefix = "Other "
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
    setContentHeight(): void {
      const managerContainer = document.getElementById(
        "workflow-manager-container"
      ) as HTMLElement;
      const html = document.documentElement;
      const currentFontSize = parseFloat(
        window.getComputedStyle(html, null).getPropertyValue("font-size")
      );
      if (managerContainer && currentFontSize) {
        const calcHeight =
          this.containerHeight -
          2 * currentFontSize +
          "px";
        managerContainer.style.maxHeight = calcHeight;
      } else {
        LoggerService.error(
          "Content sizing error",
          "failed to get element(s) for concept content resizing"
        );
      }
    },
  }
});
</script>

<style scoped>
#workflow-manager-container {
  grid-area: workflow-content;
  /* height: calc(100vh - 2rem); */
  width: 100%;
  overflow-y: auto;
}

.p-panel {
  min-height: 100%;
}
</style>
