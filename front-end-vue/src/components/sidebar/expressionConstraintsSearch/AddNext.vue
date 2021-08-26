<template>
  <div class="add-next-container">
    <template v-for="option in options" :key="option">
      <Button
        icon="fas fa-plus"
        :label="option"
        class="p-button-rounded p-button-outlined p-button-danger add-next-button"
        @click="addItem(option)"
      >
      </Button>
    </template>
  </div>
</template>

<script lang="ts">
import { ECLType } from "@/models/expressionConstraintsLanguage/ECLType";
import { defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
  name: "AddNext",
  props: {
    value: {
      type: Object as PropType<{
        previousComponent: string,
        previousPosition: number
      }>,
      required: true
    }
  },
  emits: ["addClicked"],
  mounted() {
    this.generateOptions();
  },
  data() {
    return {
      options: [] as any[]
    };
  },
  methods: {
    addItem(selectedOption: string) {
      this.$emit("addClicked", { selectedType: selectedOption, position: this.value.previousPosition + 1 });
    },

    generateOptions() {
      switch (this.value?.previousComponent) {
        case ECLType.FOCUS_CONCEPT:
          this.options = [ECLType.LOGIC, ECLType.REFINEMENT];
          break;
        case ECLType.LOGIC:
          this.options = [ECLType.FOCUS_CONCEPT];
          break;
        case ECLType.REFINEMENT:
          this.options = [ECLType.LOGIC];
          break;
        default:
          break;
      }
    }
  }
});
</script>

<style scoped>
.add-next-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
}

.add-next-button {
  border-style: dashed !important;
}
</style>
