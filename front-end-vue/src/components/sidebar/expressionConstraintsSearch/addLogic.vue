<template>
  <Button
    icon="fas fa-plus"
    label="Add logic"
    class="p-button-rounded p-button-outlined p-button-danger add-logic-button"
    @click="showOverlay"
  />

  <OverlayPanel ref="addLogicOP">
    <SelectButton v-model="selected" :options="options" />
    <Button icon="fas fa-check" label="Confirm" class="p-button-success confirm-button" @click="onConfirm" />
  </OverlayPanel>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "addLogic",
  props: { id: String, position: Number },
  emits: ["addLogicClicked"],
  data() {
    return {
      options: ["AND", "OR"],
      selected: "AND"
    }
  },
  methods: {
    onConfirm() {
      this.$emit("addLogicClicked", { id: this.id, value: this.selected, position: this.position });
      this.hideOverlay();
    },

    hideOverlay(): void {
      const x = this.$refs.addLogicOP as any;
      x.hide();
    },

    showOverlay(event: any): void {
      const x = this.$refs.addLogicOP as any;
      x.show(event, event.target);
    },
  }
});
</script>

<style scoped>
.add-logic-button {
  border-style: dashed !important;
}

.p-button-label {
  padding-left: 0.5rem;
}

.confirm-button {
  margin-top: 1rem;
}
</style>
