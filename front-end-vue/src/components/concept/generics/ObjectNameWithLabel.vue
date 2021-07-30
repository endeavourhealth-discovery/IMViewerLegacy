<template>
  <p :style="{ width: size }">
    <strong>{{ label }}: </strong>
    <span
      v-if="data && Object.prototype.hasOwnProperty.call(data, 'name')"
      class="break-text"
    >
      {{ data.name }}
    </span>
    <span v-else>None</span>
  </p>
</template>

<script lang="ts">
import LoggerService from "@/services/LoggerService";
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextWithLabel",
  props: { label: String, data: Object, size: String },
  mounted() {
    if (this.data && !Object.prototype.hasOwnProperty.call(this.data, "name")) {
      LoggerService.error(
        "Object has no property 'name' for use within component ObjectNameWithLabel.vue"
      );
    }
  }
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
