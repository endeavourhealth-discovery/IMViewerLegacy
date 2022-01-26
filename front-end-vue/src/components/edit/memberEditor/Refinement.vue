<template>
  <div class="refinement-button-container">
    <span class="float-text">Refinement</span>
    <div v-if="refinementBuild && refinementBuild.length" class="refinement-children-container">
      <template v-for="child of refinementBuild" :key="child.id">
        <component
          :is="child.component"
          :value="child.value"
          :id="child.id"
          :position="child.position"
          :last="refinementBuild.length - 2 <= child.position ? true : false"
          @deleteClicked="deleteItem"
          @addClicked="addItem"
          @updateClicked="updateItem"
          @addNextOptionsClicked="addNextOptions"
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
import AddDeleteButtons from "@/components/edit/memberEditor/AddDeleteButtons.vue";
import Property from "@/components/edit/memberEditor/Property.vue";
import Quantifier from "@/components/edit/memberEditor/Quantifier.vue";
import AddNext from "@/components/edit/memberEditor/AddNext.vue";

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
  computed: mapState(["filterOptions", "selectedFilters"]),
  async mounted() {
    this.createBuild();
  },
  data() {
    return {
      refinementBuild: [] as ComponentDetails[]
    };
  },
  methods: {
    async createBuild() {
      this.refinementBuild = [];
      if (!this.hasData(this.value)) this.createDefaultBuild();
      else {
        let position = 0;
        const property = this.generateNewComponent(DefinitionType.PROPERTY, position, this.value.propertyIri);
        if (property) {
          this.refinementBuild.push(property);
          position++;
        }

        for (const child of this.value.children) {
          const quantifier = this.generateNewComponent(DefinitionType.QUANTIFIER, position, { propertyIri: this.value.propertyIri, quantifier: child });
          if (quantifier) {
            this.refinementBuild.push(quantifier);
            position++;
          }
        }
      }
    },

    createDefaultBuild() {
      this.refinementBuild = [];
      const property = this.generateNewComponent(DefinitionType.PROPERTY, 0, undefined);
      if (property) this.refinementBuild.push(property);
      const quantifier = this.generateNewComponent(DefinitionType.QUANTIFIER, 1, undefined);
      if (quantifier) this.refinementBuild.push(quantifier);
    },

    hasData(data: any): data is { propertyIri: string; children: any[] } {
      if (data && (data as { propertyIri: string; children: any[] }).propertyIri) return true;
      return false;
    },

    generateNewComponent(type: DefinitionType, position: number, data: any) {
      let result;
      switch (type) {
        case DefinitionType.PROPERTY:
          result = {
            id: DefinitionType.PROPERTY + "_" + position,
            value: data,
            position: position,
            type: DefinitionType.PROPERTY,
            json: {},
            component: DefinitionComponent.PROPERTY
          };
          break;
        case DefinitionType.QUANTIFIER:
          result = {
            id: DefinitionType.QUANTIFIER + "_" + position,
            value: data,
            position: position,
            type: DefinitionType.QUANTIFIER,
            json: {},
            component: DefinitionComponent.QUANTIFIER
          };
          break;
        default:
          break;
      }
      return result;
    },

    deleteItem(data: ComponentDetails): void {
      const index = this.refinementBuild.findIndex(item => item.position === data.position);
      this.refinementBuild.splice(index, 1);
      const length = this.refinementBuild.length;
      if (data.position === 0) {
        this.refinementBuild.unshift(this.genNextOptions(0, DefinitionType.BUILDER, DefinitionType.BUILDER));
      }
      if (index < length - 1 && this.refinementBuild[index].type === DefinitionType.ADD_NEXT) {
        this.refinementBuild[index] = this.genNextOptions(index - 1, this.refinementBuild[index - 1].type, DefinitionType.BUILDER);
      }
      if (this.refinementBuild[length - 1].type !== DefinitionType.ADD_NEXT) {
        this.refinementBuild.push(this.genNextOptions(length - 1, this.refinementBuild[length - 1].type, DefinitionType.BUILDER));
      } else {
        this.refinementBuild[length - 1] = this.genNextOptions(length - 2, this.refinementBuild[length - 2].type, DefinitionType.BUILDER);
      }
      this.updatePositions();
    },

    updateItem(data: ComponentDetails) {
      const index = this.refinementBuild.findIndex(item => item.position === data.position);
      this.refinementBuild[index] = data;
    },

    async addNextOptions(data: NextComponentSummary): Promise<void> {
      const nextOptionsComponent = this.genNextOptions(data.previousPosition, data.previousComponentType, data.parentGroup);
      if (data.previousPosition !== this.refinementBuild.length - 1 && this.refinementBuild[data.previousPosition + 1].type === DefinitionType.ADD_NEXT) {
        this.refinementBuild[data.previousPosition + 1] = nextOptionsComponent;
      } else {
        this.refinementBuild.splice(data.previousPosition + 1, 0, nextOptionsComponent);
      }
      this.updatePositions();
      await this.$nextTick();
      const itemToScrollTo = document.getElementById(nextOptionsComponent.id);
      itemToScrollTo?.scrollIntoView();
    },

    addItem(data: { selectedType: DefinitionType; position: number; value: any }): void {
      const newComponent = this.generateNewComponent(data.selectedType, data.position, data.value);
      if (!newComponent) return;
      this.refinementBuild[data.position] = newComponent;
      if (this.refinementBuild[this.refinementBuild.length - 1].type !== DefinitionType.ADD_NEXT) {
        this.refinementBuild.push(
          this.genNextOptions(this.refinementBuild.length - 1, this.refinementBuild[this.refinementBuild.length - 1].type, DefinitionType.REFINEMENT)
        );
      }
      this.updatePositions();
    },

    genNextOptions(position: number, previous: DefinitionType, group?: DefinitionType) {
      return {
        id: "addNext_" + (position + 1),
        value: {
          previousPosition: position,
          previousComponentType: previous,
          parentGroup: group
        },
        position: position + 1,
        type: DefinitionType.ADD_NEXT,
        json: {},
        component: DefinitionComponent.ADD_NEXT
      };
    },

    updatePositions(): void {
      this.refinementBuild.forEach((item: ComponentDetails, index: number) => {
        item.position = index;
      });
    },

    deleteClicked(): void {
      this.$emit("deleteClicked", {
        id: this.id,
        value: this.createAsValue(),
        position: this.position,
        type: DefinitionType.SET,
        component: DefinitionComponent.SET,
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
