<template>
  <div id="workflow-manager-container">
    <CreateConceptWorkflow
      v-if="selectedWorkflow.value == 'createWorkflow'"
      :selectedWorkflow="selectedWorkflow"
      :workflows="workflows"
    />
    <UpdateConceptWorkflow
      v-if="selectedWorkflow.value == 'updateWorkflow'"
      :selectedWorkflow="selectedWorkflow"
      :workflows="workflows"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoggerService from "@/services/LoggerService";
import CreateConceptWorkflow from "@/components/workflow/CreateConceptWorkflow.vue";
import UpdateConceptWorkflow from "@/components/workflow/UpdateConceptWorkflow.vue";

export default defineComponent({
  name: "WorkflowManager",
  props: ["selectedWorkflow", "workflows"],
  components: { CreateConceptWorkflow, UpdateConceptWorkflow },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.setContentHeight);
    });

    this.setContentHeight();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setContentHeight);
  },
  methods: {
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
    }
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
