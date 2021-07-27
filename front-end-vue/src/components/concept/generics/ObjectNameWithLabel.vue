<template>
  <p :style="{ width: size }">
    <strong>{{ label }}: </strong>
    <span class="break-text">{{ data.name }}</span>
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextWithLabel",
  props: { label: String, data: Object, size: String }
});
</script>

<style scoped>
p {
  margin: 0;
}

.break-text {
  word-break: break-all;
}
</style>
