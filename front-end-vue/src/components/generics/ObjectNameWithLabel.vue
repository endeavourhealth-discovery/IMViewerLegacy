<template>
  <p :style="{ width: size }">
    <strong class="label">{{ label }}: </strong>
    <span v-if="isObjectWithName" class="data break-text">
      {{ data.name }}
    </span>
    <span v-else class="data">None</span>
  </p>
</template>

<script lang="ts">
import LoggerService from "@/services/LoggerService";
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextWithLabel",
  props: { label: String, data: Object, size: String },
  computed: {
    isObjectWithName(): boolean {
      if (
        this.data &&
        Object.prototype.toString.call(this.data) === "[object Object]" &&
        Object.prototype.hasOwnProperty.call(this.data, "name")
      ) {
        return true;
      } else {
        LoggerService.error(
          "No data, data is not Object or Object has no property 'name' for use within component ObjectNameWithLabel.vue"
        );
        return false;
      }
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
