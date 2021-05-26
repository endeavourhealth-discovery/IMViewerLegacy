<template>
  <SideNav />
  <div class="layout-main">
    <div class="main-grid">
      <SidebarWorkflow @workflow-selected="onWorkflowSelected" />
      <WorkflowManager :selectedWorkflow="selectedWorkflow" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import SidebarWorkflow from "@/components/workflow/SidebarWorkflow.vue";
import WorkflowManager from "@/components/workflow/WorkflowManager.vue";

export default defineComponent({
  name: "Workflow",
  components: {
    SideNav,
    SidebarWorkflow,
    WorkflowManager
  },
  data() {
    return {
      selectedWorkflow: {
        name: "Create New Concept Workflow",
        value: "createWorkflow"
      }
    };
  },
  methods: {
    onWorkflowSelected(workflow: { name: string; value: string }): void {
      this.selectedWorkflow = workflow;
    }
  }
});
</script>

<style>
.main-grid {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: "sidebar-workflow workflow-content";
  column-gap: 7px;
}
.p-timeline-event {
  min-width: 200px;
}
.p-timeline-event-content {
  min-height: 88px;
}
.p-selectbutton .p-button {
  width: auto;
}
</style>
