<template>
  <div v-if="value" class="query-item-container">
    <p class="label">{{ value.symbol }} {{ value.name }}</p>
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
      label="Add constraint"
      class="p-button-rounded p-button-outlined p-button-danger add-logic-button"
      @click="showOverlay"
    />
  </div>
  <OverlayPanel ref="addConstraintOP">
    <Dropdown
      v-model="selected"
      :options="options"
      optionLabel="name"
      placeholder="Select constraint"
    >
      <template #value="slotProps">
        <span>{{ slotProps.value.symbol }} </span>
        <span>{{ slotProps.value.name }}</span>
      </template>
      <template #option="slotProps">
        <span>{{ slotProps.option.symbol }} </span>
        <span>{{ slotProps.option.name }}</span>
      </template>
    </Dropdown>
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
  name: "addConstraint",
  props: { id: String, position: Number, value: { required: false } },
  emits: ["addClicked", "deleteClicked", "updateClicked"],
  data() {
    return {
      options: [
        { name: "Descendant of", symbol: "<" },
        { name: "Descendant or self of", symbol: "<<" },
        { name: "Child of", symbol: "<!" },
        { name: "Child or self of", symbol: "<<!" },
        { name: "Ancestor of", symbol: ">" },
        { name: "Ancestor or self of", symbol: ">>" },
        { name: "Parent of", symbol: ">!" },
        { name: "Parent or self of", symbol: ">>!" },
        { name: "Member of", symbol: "^" }
      ],
      selected: { name: "Child of", symbol: "<" },
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
          type: "Constraint",
          label: this.selected.symbol,
          component: "AddConstraint",
          edit: false
        });
      } else {
        this.$emit("addClicked", {
          id: this.id,
          value: this.selected,
          position: this.position,
          type: "Constraint",
          label: this.selected.symbol,
          component: "AddConstraint",
          edit: false
        });
      }
      this.hideOverlay();
    },

    hideOverlay(): void {
      const x = this.$refs.addConstraintOP as any;
      x.hide();
    },

    showOverlay(event: any): void {
      const x = this.$refs.addConstraintOP as any;
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
        type: "Constraint",
        label: this.selected.symbol,
        component: "AddConstraint",
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

.p-dropdown {
  width: 10rem;
}
</style>
