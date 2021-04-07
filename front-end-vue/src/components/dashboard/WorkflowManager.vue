<template>
  <div class="p-col-6 modulecard-container">
    <Card class="modulecard">
      <template #header>
        <font-awesome-icon
          :icon="['fas', 'tasks']"
          size="6x"
          style="color: brown; padding: 5px"
        />
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

export default class WorkflowManager extends Vue{

}
</script>

<style scoped>

.modulecard {
  height: 100%;
}

</style>
