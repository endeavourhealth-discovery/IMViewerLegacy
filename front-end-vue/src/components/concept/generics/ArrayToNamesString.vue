<template>
  <p :style="{ width: size }">
    <strong>{{ label }}: </strong>
    <span>{{ arrayToString ? arrayToString : "None" }}</span>
  </p>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "ArrayToNamesString",
  props: {
    label: { type: String },
    data: { type: Array as PropType<Array<string>> },
    size: { type: String }
  },
  computed: {
    arrayToString(): string | undefined {
      if (Array.isArray(this.data)) {
        return this.data
          .map(function(item: any) {
            return item.name;
          })
          .join(", ");
      } else {
        return undefined;
      }
    }
  }
});
</script>

<style scoped></style>
