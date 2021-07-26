<template>
  <p>
    <strong>{{label}}: </strong>
    <span>{{ arrayToString ? arrayToString : "None" }}</span>
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ArrayToNamesString",
  props: ["label", "array"],
  computed: {
    arrayToString(): string | undefined {
      try {
        return this.array
          .map(function(item: any) {
            return item.name;
          })
          .join(", ");
      } catch {
        return undefined;
      }
    }
  }

});
</script>

<style scoped>

</style>
