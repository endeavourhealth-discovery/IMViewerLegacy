<template>
  <div v-if="selectedWorkflow" id="workflow-manager-container">
    <CreateConceptWorkflow
      v-if="selectedWorkflow.value == 'createWorkflow'"
      :selectedWorkflow="selectedWorkflow"
    />
    <UpdateConceptWorkflow
      v-if="selectedWorkflow.value == 'updateWorkflow'"
      :selectedWorkflow="selectedWorkflow"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import CreateConceptWorkflow from "@/components/workflow/CreateConceptWorkflow.vue";
import UpdateConceptWorkflow from "@/components/workflow/UpdateConceptWorkflow.vue";

export default defineComponent({
  name: "WorkflowManager",
  props: ["selectedWorkflow"],
  components: { CreateConceptWorkflow, UpdateConceptWorkflow }
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
