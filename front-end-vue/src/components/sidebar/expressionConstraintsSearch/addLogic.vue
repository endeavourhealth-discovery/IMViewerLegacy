<template>
  <div v-if="value" class="query-item-container">
    <p class="label">{{ value }}</p>
    <div class="buttons-container">
      <Button
        icon="fas fa-times"
        class="p-button-rounded p-button-outlined p-button-danger"
        @click="deleteClicked"
      />
      <Button
        icon="fas fa-pencil-alt"
        class="p-button-rounded p-button-outlined p-button-secondary"
        @click="editClicked"
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
  </div>
  <OverlayPanel ref="addLogicOP">
    <SelectButton v-model="selected" :options="options" />
    <Button
      icon="fas fa-check"
      label="Confirm"
      class="p-button-success confirm-button"
      @click="onConfirm"
    />
  </OverlayPanel>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "addLogic",
  props: { id: String, position: Number, value: { required: false } },
  emits: ["addClicked", "deleteClicked", "updateClicked"],
  data() {
    return {
      options: ["AND", "OR"],
      selected: "AND",
      edit: false
    };
  },
  methods: {
    onConfirm() {
      if (this.edit) {
        this.$emit("updateClicked", {
          id: this.id,
          value: this.selected,
          position: this.position,
          type: "Logic",
          component: "AddLogic",
          label: this.selected,
          edit: false
        });
      } else {
        this.$emit("addClicked", {
          id: this.id,
          value: this.selected,
          position: this.position,
          type: "Logic",
          component: "AddLogic",
          label: this.selected,
          edit: false
        });
      }
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

    editClicked(event: any) {
      this.showOverlay(event);
      this.edit = true;
    },

    deleteClicked() {
      this.$emit("deleteClicked", {
        id: this.id,
        value: this.selected,
        position: this.position,
        type: "Logic",
        component: "AddLogic",
        label: this.selected,
        edit: false
      });
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

.query-item-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}

.label {
  margin: 0 1rem 0 0;
  padding: 1rem;
  border: 1px solid #dee2e6;
}

.buttons-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
</style>
