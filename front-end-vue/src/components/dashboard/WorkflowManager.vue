<template>
  <div class="modulecard-container">
    <Card class="modulecard">
      <template #header>
        <i class="fas fa-tasks icon-workflow" aria-hidden="true" />
      </template>
      <template #title> Workflow Manager </template>
      <template #subtitle> Helps to manage the workflow </template>
      <template #content>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </template>
      <template #footer>
        <Button label="Open Workflow Manager Module" :disabled="true" />
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "WorkflowManager"
})
export default class WorkflowManager extends Vue {}
</script>

<style scoped>
.modulecard-container {
  grid-area: workflow;
}

.modulecard {
  height: 100%;
}

.icon-workflow {
  font-size: 6rem;
  color: orange;
  padding: 5px;
}
</style>
