<template>
  <div class="query-item-container">
      <p class="label">{{ data }}</p>
    <div class="buttons-container">
      <Button icon="fas fa-pencil-alt" class="p-button-rounded p-button-outlined p-button-secondary" />
      <Button icon="fas fa-times" class="p-button-rounded p-button-outlined p-button-danger" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Logic",
  props: { data: { required: true }, id: String }
});
</script>

<style scoped>
.query-item-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.buttons-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

.label {
  padding: 1rem;
  border: 1px solid #dee2e6;
}

.label {
  margin: 0;
}
</style>
