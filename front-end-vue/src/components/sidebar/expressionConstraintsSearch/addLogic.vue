<template>
  <div v-if="data" class="query-item-container">
    <p class="label">{{ data.label }}</p>
    <div class="buttons-container">
      <Button
        icon="fas fa-pencil-alt"
        class="p-button-rounded p-button-outlined p-button-secondary"
        @click="editClicked"
      />
      <Button
        icon="fas fa-times"
        class="p-button-rounded p-button-outlined p-button-danger"
        @click="deleteClicked"
      />
    </div>
  </div>
  <div v-else>
    <Button
      icon="fas fa-plus"
      label="Add logic"
      class="p-button-rounded p-button-outlined p-button-danger add-logic-button"
      @click="showOverlay"
    />

    <OverlayPanel ref="addLogicOP">
      <SelectButton v-model="selected" :options="options" />
      <Button
        icon="fas fa-check"
        label="Confirm"
        class="p-button-success confirm-button"
        @click="onConfirm"
      />
    </OverlayPanel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "addLogic",
  props: { id: String, position: Number, data: { required: false } },
  emits: ["addClicked", "editClicked", "deleteClicked"],
  data() {
    return {
      options: ["AND", "OR"],
      selected: "AND"
    };
  },
  methods: {
    onConfirm() {
      this.$emit("addClicked", {
        id: this.id,
        value: this.selected,
        position: this.position,
        type: "Logic"
      });
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

    editClicked() {
      this.$emit("editClicked", this.data);
    },

    deleteClicked() {
      this.$emit("deleteClicked", this.data);
    }
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
