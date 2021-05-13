<template>
  <div class="modulecard-container" id="module-card">
    <Card class="modulecard">
      <template #header>
        <i class="fas fa-map icon-mapping" aria-hidden="true" />
      </template>
      <template #title> Mapping Module </template>
      <template #subtitle> Data model maps </template>
      <template #content>
        Data model maps specify how data is transformed from a data model to a
        particular database.
      </template>
      <template #footer>
        <Button label="Open Mapping Module" :disabled="true" />
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "mappingModule",
  props: []
})
</script>

<style scoped>
.modulecard-container {
  grid-area: mapping;
}

.modulecard {
  height: 100%;
}

.icon-mapping {
  font-size: 6rem;
  color: orange;
  padding: 5px;
}
</style>
