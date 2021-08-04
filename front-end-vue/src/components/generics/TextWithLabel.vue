<template>
  <div class="text-with-label-container" :style="{ width: size }">
    <strong class="label">{{ label }}: </strong>
    <span class="data break-text">{{ data ? data : "None" }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextWithLabel",
  props: { label: String, data: String, size: String }
});
</script>

<style scoped>
.break-text {
  word-break: break-all;
}
</style>
