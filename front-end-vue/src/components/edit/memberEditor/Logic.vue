<template>
  <div class="logic-container" :id="id">
    <div class="label-container">
      <span class="float-text">Logic</span>
      <Dropdown v-model="selected" :options="options" optionLabel="name" placeholder="Select logic" />
    </div>
    <AddDeleteButtons :last="last" :position="position" @deleteClicked="deleteClicked" @addNextClicked="addNextClicked" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import AddDeleteButtons from "@/components/edit/memberEditor/AddDeleteButtons.vue";
import { NextComponentSummary } from "@/models/definition/NextComponentSummary";
import { ComponentDetails } from "@/models/definition/ComponentDetails";
import { DefinitionType } from "@/models/definition/DefinitionType";
import { DefinitionComponent } from "@/models/definition/DefinitionComponent";
import { SHACL } from "@/vocabulary/SHACL";
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";

export default defineComponent({
  name: "Logic",
  props: {
    id: { type: String, required: true },
    position: { type: Number, required: true },
    value: { type: Object as PropType<{ iri: string; children: PropType<Array<any>> | undefined }>, required: false },
    last: { type: Boolean, required: true }
  },
  components: { AddDeleteButtons },
  emits: {
    addNextOptionsClicked: (payload: NextComponentSummary) => true,
    deleteClicked: (payload: ComponentDetails) => true,
    updateClicked: (payload: ComponentDetails) => true
  },
  watch: {
    selected(): void {
      this.onConfirm();
    }
  },
  mounted() {
    if (this.value && isObjectHasKeys(this.value, ["iri", "children"])) {
      const found = this.options.find(option => option.iri === this.value?.iri);
      this.selected = found ? found : this.options[1];
    } else {
      this.selected = this.options[1];
    }
  },
  data() {
    return {
      options: [
        { iri: SHACL.AND, name: "AND" },
        { iri: SHACL.OR, name: "OR" },
        { iri: SHACL.NOT, name: "NOT" }
      ] as { iri: string; name: string }[],
      selected: {} as { iri: string; name: string }
    };
  },
  methods: {
    onConfirm(): void {
      this.$emit("updateClicked", {
        id: this.id,
        value: { iri: this.selected.iri, children: this.value?.children },
        position: this.position,
        type: DefinitionType.LOGIC,
        component: DefinitionComponent.LOGIC,
        JSON: this.selected.iri
      });
    },

    deleteClicked(): void {
      this.$emit("deleteClicked", {
        id: this.id,
        value: this.selected,
        position: this.position,
        type: DefinitionType.LOGIC,
        component: DefinitionComponent.LOGIC,
        JSON: this.selected.iri
      });
    },

    addNextClicked(): void {
      this.$emit("addNextOptionsClicked", {
        previousComponentType: DefinitionType.LOGIC,
        previousPosition: this.position,
        parentGroup: DefinitionType.LOGIC
      });
    }
  }
});
</script>

<style scoped>
.logic-container {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

.p-button-label {
  padding-left: 0.5rem;
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
  border: 1px solid #34314c;
  border-radius: 3px;
  position: relative;
}

.p-dropdown {
  width: 7rem;
}

.float-text {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.75rem;
  color: #6c757d;
}
</style>
