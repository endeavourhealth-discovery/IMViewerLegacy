<template>
  <div class="button-bar">
    <Button v-if="pageIndex > 0" label="Previous" icon="fas fa-chevron-circle-left" class="" @click="handlePrevious" />
    <Button label="Clear" icon="fas fa-undo-alt" class="p-button-warning" @click="handleClear" />
    <Button label="Next" icon="fas fa-chevron-circle-right" class="" @click="handleNext" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "StepsButtonBar",
  props: { pageIndex: { type: Number } },
  emits: ["nextPage", "clearForm", "previousPage"],
  methods: {
    handlePrevious() {
      this.$emit("previousPage");
    },

    handleNext() {
      this.$emit("nextPage");
    },

    handleClear() {
      this.$emit("clearForm");
    }
  }
});
</script>

<style scoped>
.button-bar {
  display: flex;
  flex-flow: row nowrap;
  gap: 7px;
  justify-content: flex-end;
  align-items: center;
}
</style>
