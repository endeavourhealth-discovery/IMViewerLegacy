<template>
  <div v-if="value" class="query-item-container" :id="id">
    <div class="label-container">
      <span class="float-text">Operator</span>
      <p class="label">{{ value.longSyntax }}</p>
    </div>
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
      label="Add operator"
      class="p-button-rounded p-button-outlined p-button-danger add-operator-button"
      @click="showOverlay"
    />
  </div>
  <OverlayPanel ref="addOperatorOP">
    <SelectButton
      v-model="selected"
      :options="options"
      optionLabel="longSyntax"
    />
    <Button
      icon="fas fa-check"
      label="Confirm"
      class="p-button-success confirm-button"
      @click="onConfirm"
    />
  </OverlayPanel>
</template>

<script lang="ts">
import { ECLComponent } from "@/models/expressionConstraintsLanguage/ECLComponent";
import { ECLType } from "@/models/expressionConstraintsLanguage/ECLType";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "addOperator",
  props: { id: String, position: Number, value: { required: false } },
  emits: ["addClicked", "deleteClicked", "updateClicked"],
  data() {
    return {
      options: [
        { symbol: "=", longSyntax: "Equals" },
        { symbol: "!=", longSyntax: "Not equals" }
      ],
      selected: { symbol: "=", longSyntax: "Equals" },
      edit: false
    };
  },
  methods: {
    onConfirm() {
      if (this.edit) {
        this.$emit("updateClicked", this.createOperator());
      } else {
        this.$emit("addClicked", this.createOperator());
      }
      this.hideOverlay();
    },

    createOperator() {
      return {
        id: this.id,
        value: this.selected,
        position: this.position,
        type: ECLType.OPERATOR,
        component: ECLComponent.OPERATOR,
        label: this.selected.symbol,
        edit: false
      };
    },

    hideOverlay(): void {
      const x = this.$refs.addOperatorOP as any;
      x.hide();
    },

    showOverlay(event: any): void {
      const x = this.$refs.addOperatorOP as any;
      x.show(event, event.target);
    },

    editClicked(event: any) {
      this.showOverlay(event);
      this.edit = true;
    },

    deleteClicked() {
      this.$emit("deleteClicked", this.createOperator());
    }
  }
});
</script>

<style scoped>
.add-operator-button {
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

.label-container {
  margin: 0 1rem 0 0;
  padding: 1rem;
  border: 1px solid #dee2e6;
  position: relative;
}

.buttons-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

.float-text {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.75rem;
  color: #6c757d;
}
</style>
