<template>
  <div class="add-next-container">
    <template v-for="option of options" :key="option">
      <Button icon="fas fa-plus" :label="option" class="p-button-rounded p-button-outlined p-button-danger add-next-button" @click="addItem(option)"> </Button>
    </template>
    <Button v-if="!last" icon="fas fa-minus" class="p-button-rounded p-button-outlined p-button-danger add-next-delete-button" @click="deleteClicked" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { ComponentDetails } from "@/models/definition/ComponentDetails";
import { NextComponentSummary } from "@/models/definition/NextComponentSummary";
import { DefinitionType } from "@/models/definition/DefinitionType";
import { DefinitionComponent } from "@/models/definition/DefinitionComponent";

export default defineComponent({
  name: "AddNext",
  props: {
    id: { type: String, required: true },
    position: { type: Number, required: true },
    last: Boolean,
    value: {
      type: Object as PropType<NextComponentSummary>,
      required: true
    }
  },
  emits: {
    addClicked: (payload: { selectedType: DefinitionType; position: number }) => true,
    deleteClicked: (payload: ComponentDetails) => true
  },
  watch: {
    options: {
      handler() {
        this.options.sort();
      },
      deep: true
    }
  },
  mounted() {
    this.generateOptions(this.value);
  },
  data() {
    return {
      options: [] as DefinitionType[]
    };
  },
  methods: {
    addItem(selectedOption: DefinitionType) {
      this.$emit("addClicked", {
        selectedType: selectedOption,
        position: this.value.previousPosition + 1
      });
    },

    deleteClicked() {
      this.$emit("deleteClicked", {
        id: this.id,
        position: this.position,
        value: null,
        type: DefinitionType.ADD_NEXT,
        component: DefinitionComponent.ADD_NEXT,
        json: null
      });
    },

    generateOptions(value: NextComponentSummary) {
      switch (value.previousComponentType) {
        case DefinitionType.MEMBER:
          this.options = [DefinitionType.LOGIC, DefinitionType.MEMBER, DefinitionType.SET, DefinitionType.REFINEMENT];
          break;
        case DefinitionType.LOGIC:
          this.options = [DefinitionType.MEMBER, DefinitionType.SET, DefinitionType.LOGIC, DefinitionType.REFINEMENT];

          break;
        case DefinitionType.SET:
          this.options = [DefinitionType.LOGIC, DefinitionType.MEMBER, DefinitionType.SET, DefinitionType.REFINEMENT];
          break;
        case DefinitionType.REFINEMENT:
          this.options = [DefinitionType.MEMBER, DefinitionType.SET, DefinitionType.LOGIC, DefinitionType.REFINEMENT];
          break;
        default:
          console.error("Unhandled component type within member editor AddNext generateOptions switch");
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
