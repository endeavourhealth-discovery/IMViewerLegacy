<template>
  <div class="logic-container" :id="id">
    <div class="label-container">
      <span class="float-text">Logic</span>
      <Dropdown v-model="selected" :options="options" optionLabel="name" placeholder="Select logic" />
    </div>
    <div class="children-container">
      <template v-for="item of logicBuild" :key="item.id">
        <component
          :is="item.component"
          :value="item.value"
          :id="item.id"
          :position="item.position"
          :last="logicBuild.length - 2 <= item.position ? true : false"
          @deleteClicked="deleteItem"
          @addClicked="addItem"
          @updateClicked="updateItem"
          @addNextOptionsClicked="addNextOptions"
        >
        </component>
      </template>
    </div>
    <AddDeleteButtons :last="last" :position="position" @deleteClicked="deleteClicked" @addNextClicked="addNextClicked" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import AddDeleteButtons from "@/components/edit/memberEditor/AddDeleteButtons.vue";
import Member from "@/components/edit/memberEditor/Member.vue";
import Set from "@/components/edit/memberEditor/Set.vue";
import AddNext from "@/components/edit/memberEditor/AddNext.vue";
import { NextComponentSummary } from "@/models/definition/NextComponentSummary";
import { ComponentDetails } from "@/models/definition/ComponentDetails";
import { DefinitionType } from "@/models/definition/DefinitionType";
import { DefinitionComponent } from "@/models/definition/DefinitionComponent";
import { SHACL } from "@/vocabulary/SHACL";
import { isArrayHasLength, isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import { TTIriRef } from "@/models/TripleTree";
import EntityService from "@/services/EntityService";
import { RDF } from "@/vocabulary/RDF";
import { isValueSet } from "@/helpers/ConceptTypeMethods";
import Refinement from "@/components/edit/memberEditor/Refinement.vue";

export default defineComponent({
  name: "Logic",
  props: {
    id: { type: String, required: true },
    position: { type: Number, required: true },
    value: { type: Object as PropType<{ iri: string; children: PropType<Array<any>> | undefined }>, required: false },
    last: { type: Boolean, required: true }
  },
  components: { AddDeleteButtons, AddNext, Member, Set, Refinement },
  emits: {
    addNextOptionsClicked: (payload: NextComponentSummary) => true,
    deleteClicked: (payload: ComponentDetails) => true,
    updateClicked: (payload: ComponentDetails) => true
  },
  watch: {
    selected(): void {
      this.onConfirm();
    },
    logicBuild: {
      handler() {
        this.onConfirm();
      },
      deep: true
    }
  },
  async mounted() {
    if (this.value && isObjectHasKeys(this.value, ["iri", "children"])) {
      const found = this.options.find(option => option.iri === this.value?.iri);
      this.selected = found ? found : this.options[1];
      await this.createBuild();
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
      selected: {} as { iri: string; name: string },
      logicBuild: [] as any[]
    };
  },
  methods: {
    async createBuild() {
      this.logicBuild = [];
      if (!this.hasChildren(this.value)) return;
      let position = 0;
      for (const child of this.value.children) {
        this.logicBuild.push(await this.processChild(child, position));
        position++;
      }
      if (isArrayHasLength(this.logicBuild)) {
        const last = this.logicBuild.length - 1;
        this.logicBuild.push(this.genNextOptions(last, this.logicBuild[last].type, DefinitionType.LOGIC));
      } else {
        this.createDefaultBuild();
      }
    },

    createDefaultBuild() {
      this.logicBuild.push(this.genNextOptions(0, DefinitionType.LOGIC));
    },

    async processChild(child: any, position: number) {
      if (isObjectHasKeys(child, ["@id"])) return await this.processIri(child, position);
      else if (isObjectHasKeys(child, [SHACL.AND]) || isObjectHasKeys(child, [SHACL.OR]) || isObjectHasKeys(child, [SHACL.NOT]))
        return this.processLogic(child, position);
      else return this.processRefinement(child, position);
    },

    processLogic(child: any, position: number) {
      for (const [key, value] of Object.entries(child)) {
        return this.generateNewComponent(DefinitionType.LOGIC, position, { iri: key, children: value });
      }
    },

    async processIri(iri: TTIriRef, position: number) {
      const types = (await EntityService.getPartialEntity(iri["@id"], [RDF.TYPE]))[RDF.TYPE];
      if (isValueSet(types)) return this.generateNewComponent(DefinitionType.SET, position, iri);
      else return this.generateNewComponent(DefinitionType.MEMBER, position, iri);
    },

    processRefinement(child: any, position: number) {
      for (const [key, value] of Object.entries(child)) {
        return this.generateNewComponent(DefinitionType.REFINEMENT, position, { propertyIri: key, children: value });
      }
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
      this.logicBuild.forEach((item: ComponentDetails, index: number) => {
        item.position = index;
      });
    },

    hasChildren(data: any): data is { iri: string; children: any[] } {
      if (isArrayHasLength((data as { iri: string; children: any[] }).children)) return true;
      return false;
    },

    onConfirm(): void {
      this.$emit("updateClicked", {
        id: this.id,
        value: { iri: this.selected.iri, children: this.value?.children },
        position: this.position,
        type: DefinitionType.LOGIC,
        component: DefinitionComponent.LOGIC,
        json: this.createLogicJson()
      });
    },

    createLogicJson() {
      let json = {} as any;
      if (this.selected.iri) json[this.selected.iri] = [];
      if (this.logicBuild.length) {
        for (const item of this.logicBuild) {
          if (item.type !== DefinitionType.ADD_NEXT) json[this.selected.iri].push(item.json);
        }
      }
      return json;
    },

    updateItem(data: ComponentDetails) {
      const index = this.logicBuild.findIndex(item => item.position === data.position);
      this.logicBuild[index] = data;
    },

    addItem(data: { selectedType: DefinitionType; position: number; value: any }): void {
      const newComponent = this.generateNewComponent(data.selectedType, data.position, data.value);
      if (!newComponent) return;
      this.logicBuild[data.position] = newComponent;
      if (this.logicBuild[this.logicBuild.length - 1].type !== DefinitionType.ADD_NEXT) {
        this.logicBuild.push(this.genNextOptions(this.logicBuild.length - 1, this.logicBuild[this.logicBuild.length - 1].type, DefinitionType.LOGIC));
      }
      this.updatePositions();
    },

    async addNextOptions(data: NextComponentSummary): Promise<void> {
      const nextOptionsComponent = this.genNextOptions(data.previousPosition, data.previousComponentType, data.parentGroup);
      if (data.previousPosition !== this.logicBuild.length - 1 && this.logicBuild[data.previousPosition + 1].type === DefinitionType.ADD_NEXT) {
        this.logicBuild[data.previousPosition + 1] = nextOptionsComponent;
      } else {
        this.logicBuild.splice(data.previousPosition + 1, 0, nextOptionsComponent);
      }
      this.updatePositions();
      await this.$nextTick();
      const itemToScrollTo = document.getElementById(nextOptionsComponent.id);
      itemToScrollTo?.scrollIntoView();
    },

    generateNewComponent(type: DefinitionType, position: number, data: any) {
      let result;
      switch (type) {
        case DefinitionType.LOGIC:
          result = {
            id: DefinitionType.LOGIC + "_" + position,
            value: data,
            position: position,
            type: DefinitionType.LOGIC,
            json: {},
            component: DefinitionComponent.LOGIC
          };
          break;
        case DefinitionType.MEMBER:
          result = {
            id: DefinitionType.MEMBER + "_" + position,
            value: data,
            position: position,
            type: DefinitionType.MEMBER,
            json: {},
            component: DefinitionComponent.MEMBER
          };
          break;
        case DefinitionType.SET:
          result = {
            id: DefinitionType.SET + "_" + position,
            value: data,
            position: position,
            type: DefinitionType.SET,
            json: {},
            component: DefinitionComponent.SET
          };
          break;
        case DefinitionType.REFINEMENT:
          result = {
            id: DefinitionType.REFINEMENT + "_" + position,
            value: data,
            position: position,
            type: DefinitionType.REFINEMENT,
            json: {},
            component: DefinitionComponent.REFINEMENT
          };
          break;
        default:
          break;
      }
      return result;
    },

    deleteItem(data: ComponentDetails): void {
      const index = this.logicBuild.findIndex(item => item.position === data.position);
      this.logicBuild.splice(index, 1);
      const length = this.logicBuild.length;
      if (data.position === 0) {
        this.logicBuild.unshift(this.genNextOptions(0, DefinitionType.LOGIC, DefinitionType.LOGIC));
      }
      if (index < length - 1 && this.logicBuild[index].type === DefinitionType.ADD_NEXT) {
        this.logicBuild[index] = this.genNextOptions(index - 1, this.logicBuild[index - 1].type, DefinitionType.LOGIC);
      }
      if (this.logicBuild[length - 1].type !== DefinitionType.ADD_NEXT) {
        this.logicBuild.push(this.genNextOptions(length - 1, this.logicBuild[length - 1].type, DefinitionType.LOGIC));
      } else {
        this.logicBuild[length - 1] = this.genNextOptions(length - 2, this.logicBuild[length - 2].type, DefinitionType.LOGIC);
      }
      this.updatePositions();
    },

    deleteClicked(): void {
      this.$emit("deleteClicked", {
        id: this.id,
        value: this.selected,
        position: this.position,
        type: DefinitionType.LOGIC,
        component: DefinitionComponent.LOGIC,
        json: this.selected.iri
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
  align-items: flex-start;
  margin: 0 1rem 0 0;
  padding: 1rem;
  border: 1px solid #34314c;
  border-radius: 3px;
  position: relative;
  width: fit-content;
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
  position: relative;
}

.children-container {
  margin: 0 1rem 0 0;
  padding: 1rem;
  /* border: 1px solid #34314c;
  border-radius: 3px; */
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
