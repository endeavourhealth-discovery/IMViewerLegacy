<template>
  <div v-if="loading" class="p-d-flex p-flex-row p-jc-center">
    <div class="p-text-center">
      <ProgressSpinner />
    </div>
  </div>
  <div v-else class="refinement-button-container">
    <span class="float-text">Refinement</span>
    <div v-if="refinementBuild && refinementBuild.length" class="refinement-children-container">
      <template v-for="child of refinementBuild" :key="child.id">
        <component
          :is="child.component"
          :value="child.value"
          :id="child.id"
          :position="child.position"
          :last="refinementBuild.length - 2 <= child.position ? true : false"
          @deleteClicked="deleteItemWrapper"
          @addClicked="addItemWrapper"
          @updateClicked="updateItemWrapper"
          @addNextOptionsClicked="addNextOptionsWrapper"
        >
        </component>
      </template>
    </div>
    <div class="refinement-item-container" :id="id">
      <AddDeleteButtons :last="last" :position="position" @deleteClicked="deleteClicked" @addNextClicked="addNextClicked" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { ComponentDetails } from "@/models/definition/ComponentDetails";
import { mapState } from "vuex";
import { DefinitionType } from "@/models/definition/DefinitionType";
import { DefinitionComponent } from "@/models/definition/DefinitionComponent";
import { NextComponentSummary } from "@/models/definition/NextComponentSummary";
import AddDeleteButtons from "@/components/edit/memberEditor/builder/AddDeleteButtons.vue";
import Property from "@/components/edit/memberEditor/builder/Property.vue";
import Quantifier from "@/components/edit/memberEditor/builder/Quantifier.vue";
import AddNext from "@/components/edit/memberEditor/builder/AddNext.vue";
import {
  addItem,
  addNextOptions,
  deleteItem,
  generateNewComponent,
  genNextOptions,
  scrollIntoView,
  updateItem,
  updatePositions
} from "@/helpers/EditorBuilderJsonMethods";

export default defineComponent({
  name: "Refinement",
  props: {
    id: { type: String, required: true },
    position: { type: Number, required: true },
    value: { type: Object as PropType<{ propertyIri: string; children: any[] }>, required: false },
    last: { type: Boolean, required: true }
  },
  emits: {
    updateClicked: (payload: ComponentDetails) => true,
    addNextOptionsClicked: (payload: NextComponentSummary) => true,
    deleteClicked: (payload: ComponentDetails) => true,
    addClicked: (payload: any) => true
  },
  components: { AddDeleteButtons, Property, Quantifier, AddNext },
  watch: {
    refinementBuild: {
      handler() {
        this.onConfirm();
      },
      deep: true
    }
  },
  computed: mapState(["filterOptions", "selectedFilters"]),
  async mounted() {
    this.createBuild();
  },
  data() {
    return {
      refinementBuild: [] as ComponentDetails[],
      loading: true
    };
  },
  methods: {
    async createBuild() {
      this.loading = true;
      this.refinementBuild = [];
      if (!this.hasData(this.value)) this.createDefaultBuild();
      else {
        let position = 0;
        const property = generateNewComponent(DefinitionType.PROPERTY, position, this.value.propertyIri);
        if (property) {
          this.refinementBuild.push(property);
          position++;
        }

        for (const child of this.value.children) {
          const quantifier = generateNewComponent(DefinitionType.QUANTIFIER, position, { propertyIri: this.value.propertyIri, quantifier: child });
          if (quantifier) {
            this.refinementBuild.push(quantifier);
            position++;
          }
        }
      }
      this.loading = false;
    },

    createDefaultBuild() {
      this.refinementBuild = [];
      const property = generateNewComponent(DefinitionType.PROPERTY, 0, undefined);
      if (property) this.refinementBuild.push(property);
      const quantifier = generateNewComponent(DefinitionType.QUANTIFIER, 1, undefined);
      if (quantifier) this.refinementBuild.push(quantifier);
    },

    hasData(data: any): data is { propertyIri: string; children: any[] } {
      if (data && (data as { propertyIri: string; children: any[] }).propertyIri) return true;
      return false;
    },

    deleteItemWrapper(data: ComponentDetails): void {
      deleteItem(data, this.refinementBuild, DefinitionType.REFINEMENT);
    },

    updateItemWrapper(data: ComponentDetails) {
      updateItem(data, this.refinementBuild);
    },

    async addNextOptionsWrapper(data: NextComponentSummary): Promise<void> {
      const nextOptionsComponent = addNextOptions(data, this.refinementBuild);
      await this.$nextTick();
      scrollIntoView(nextOptionsComponent);
    },

    addItemWrapper(data: { selectedType: DefinitionType; position: number; value: any }): void {
      addItem(data, this.refinementBuild, DefinitionType.REFINEMENT);
    },

    onConfirm() {
      this.$emit("updateClicked", {
        id: this.id,
        value: this.createAsValue(),
        position: this.position,
        type: DefinitionType.REFINEMENT,
        component: DefinitionComponent.REFINEMENT,
        json: this.createAsJson()
      });
    },

    deleteClicked(): void {
      this.$emit("deleteClicked", {
        id: this.id,
        value: this.createAsValue(),
        position: this.position,
        type: DefinitionType.REFINEMENT,
        component: DefinitionComponent.REFINEMENT,
        json: this.createAsJson()
      });
    },

    createAsJson() {
      let json = {} as any;
      let propertyIri = "";
      let children = [] as any[];
      for (const item of this.refinementBuild) {
        if (item.type === DefinitionType.PROPERTY) propertyIri = item.value;
        if (item.type === DefinitionType.QUANTIFIER) children.push(item.json);
      }
      json[propertyIri] = children;
      return json;
    },

    createAsValue() {
      const children = [];
      let propertyIri = "";
      for (const child of this.refinementBuild) {
        if (child.type === DefinitionType.PROPERTY) propertyIri = child.value;
        else children.push(child.value);
      }
      return { propertyIri: propertyIri, children: children };
    },

    addNextClicked(): void {
      this.$emit("addNextOptionsClicked", {
        previousComponentType: DefinitionType.REFINEMENT,
        previousPosition: this.position,
        parentGroup: DefinitionType.REFINEMENT
      });
    }
  }
});
</script>

<style scoped>
.refinement-button-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  padding: 1rem;
  border: 1px solid #47b8e0;
  border-radius: 3px;
  margin: 0 1rem 0 0;
}

.refinement-item-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

.label-container {
  margin: 0 1rem 0 0;
  padding: 1rem;
  border: 1px solid #ffc952;
  border-radius: 3px;
  position: relative;
  min-width: 15rem;
}

.label {
  cursor: pointer;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  background-color: #ffffff;
  padding: 0.25rem;
}

.float-text {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.75rem;
  color: #6c757d;
}

.search-input {
  width: 15rem;
}
</style>
