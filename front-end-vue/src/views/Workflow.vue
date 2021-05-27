<template>
  <SideNav />
  <div class="layout-main">
    <Panel id="sidebar-table-container" header="Workflow manager">
      <div class="main-grid">
        <SidebarWorkflow @workflow-selected="onWorkflowSelected" />
        <WorkflowManager :selectedWorkflow="selectedWorkflow" :containerHeight="containerHeight" />
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import SidebarWorkflow from "@/components/workflow/SidebarWorkflow.vue";
import WorkflowManager from "@/components/workflow/WorkflowManager.vue";
import LoggerService from "@/services/LoggerService";

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
        name: "All workflow items",
        value: "allItems"
      },
      containerHeight: 0
    };
  },
  mounted() {
    window.addEventListener("resize", this.setContentHeight);

    this.setContentHeight();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setContentHeight);
  },
  methods: {
      setContentHeight(): void {
      const container = document.getElementById(
        "sidebar-table-container"
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
          header.getBoundingClientRect().height;
        content.style.maxHeight = calcHeight + "px";
        this.containerHeight = calcHeight;
      } else {
        LoggerService.error(
          "Content sizing error",
          "failed to get element(s) for concept content resizing"
        );
      }
    },

    onWorkflowSelected(workflow: { name: string; value: string }): void {
      this.selectedWorkflow = workflow;
    },


  }
});
</script>

<style scoped>
.main-grid {
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

#sidebar-table-container {
  height: 100%;
  overflow-y: auto;
}
</style>
