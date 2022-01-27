<template>
  <div id="members-builder-container">
    <h3>Members builder</h3>
    <div id="members-build">
      <template v-for="item of membersBuild" :key="item.id">
        <component
          :is="item.component"
          :value="item.value"
          :id="item.id"
          :position="item.position"
          :last="membersBuild.length - 2 <= item.position ? true : false"
          @deleteClicked="deleteItem"
          @addClicked="addItem"
          @updateClicked="updateItem"
          @addNextOptionsClicked="addNextOptions"
        >
        </component>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { isArrayHasLength, isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import { TTIriRef } from "@/models/TripleTree";
import { SHACL } from "@/vocabulary/SHACL";
import { defineComponent, PropType } from "@vue/runtime-core";
import { DefinitionType } from "@/models/definition/DefinitionType";
import { DefinitionComponent } from "@/models/definition/DefinitionComponent";
import { ComponentDetails } from "@/models/definition/ComponentDetails";
import EntityService from "@/services/EntityService";
import { RDF } from "@/vocabulary/RDF";
import { isValueSet } from "@/helpers/ConceptTypeMethods";
import AddDeleteButtons from "@/components/edit/memberEditor/AddDeleteButtons.vue";
import AddNext from "@/components/edit/memberEditor/AddNext.vue";
import Logic from "@/components/edit/memberEditor/Logic.vue";
import Member from "@/components/edit/memberEditor/Member.vue";
import Set from "@/components/edit/memberEditor/Set.vue";
import { NextComponentSummary } from "@/models/definition/NextComponentSummary";
import Refinement from "@/components/edit/memberEditor/Refinement.vue";

export default defineComponent({
  name: "Builder",
  props: { included: { type: Array as PropType<Array<any>>, required: true } },
  components: { AddDeleteButtons, AddNext, Logic, Member, Set, Refinement },
  emits: {
    "concept-updated": (payload: any) => true
  },
  watch: {
    membersBuild: {
      handler() {
        this.onConfirm();
      },
      deep: true
    }
  },
  mounted() {
    this.createBuild();
  },
  data() {
    return {
      membersBuild: [] as any[],
      membersAsNode: {} as any
    };
  },
  methods: {
    async createBuild() {
      this.membersBuild = [];
      if (!isArrayHasLength(this.included)) {
        return;
      }
      let position = 0;
      for (const item of this.included) {
        this.membersBuild.push(await this.processAny(item, position));
        position++;
      }
      if (isArrayHasLength(this.membersBuild)) {
        const last = this.membersBuild.length - 1;
        this.membersBuild.push(this.genNextOptions(last, this.membersBuild[last].type, DefinitionType.BUILDER));
      } else {
        this.createDefaultBuild();
      }
    },

    createDefaultBuild() {
      this.membersBuild.push(this.generateNewComponent(DefinitionType.LOGIC, 0, undefined));
      this.membersBuild.push(this.genNextOptions(1, DefinitionType.LOGIC, DefinitionType.BUILDER));
    },

    generateMembersAsNode() {
      let json = [];
      if (this.membersBuild.length) {
        for (const item of this.membersBuild) {
          if (item.type !== DefinitionType.ADD_NEXT) json.push(item.json);
        }
      }
      return json;
    },

    onConfirm() {
      this.$emit("concept-updated", { "http://endhealth.info/im#definition": this.generateMembersAsNode() });
    },

    async processAny(item: any, position: number): Promise<any> {
      if (isObjectHasKeys(item, ["@id"])) return await this.processIri(item, position);
      else if (isArrayHasLength(item)) return this.processArray(item, position);
      else return this.processObject(item, position);
    },

    async processIri(iri: TTIriRef, position: number): Promise<any> {
      const types = await EntityService.getPartialEntity(iri["@id"], [RDF.TYPE]);
      if (isValueSet(types)) return this.generateNewComponent(DefinitionType.SET, position, iri);
      else return this.generateNewComponent(DefinitionType.MEMBER, position, iri);
    },

    processObject(item: any, position: number): any {
      for (const [key, value] of Object.entries(item)) {
        if (key === SHACL.AND || key === SHACL.OR) {
          return this.generateNewComponent(DefinitionType.LOGIC, position, { iri: key, children: value });
        } else {
          return this.generateNewComponent(DefinitionType.REFINEMENT, position, { propertyIri: key, children: value });
        }
      }
    },

    async processArray(items: any[], position: number): Promise<any> {
      let arrayPosition = position;
      const result = [] as any[];
      for (const item of items) {
        result.push(await this.processAny(item, arrayPosition));
        arrayPosition++;
      }
      return result;
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
      const index = this.membersBuild.findIndex(item => item.position === data.position);
      this.membersBuild.splice(index, 1);
      const length = this.membersBuild.length;
      if (data.position === 0) {
        this.membersBuild.unshift(this.genNextOptions(0, DefinitionType.BUILDER, DefinitionType.BUILDER));
      }
      if (index < length - 1 && this.membersBuild[index].type === DefinitionType.ADD_NEXT) {
        this.membersBuild[index] = this.genNextOptions(index - 1, this.membersBuild[index - 1].type, DefinitionType.BUILDER);
      }
      if (this.membersBuild[length - 1].type !== DefinitionType.ADD_NEXT) {
        this.membersBuild.push(this.genNextOptions(length - 1, this.membersBuild[length - 1].type, DefinitionType.BUILDER));
      } else {
        this.membersBuild[length - 1] = this.genNextOptions(length - 2, this.membersBuild[length - 2].type, DefinitionType.BUILDER);
      }
      this.updatePositions();
    },

    updateItem(data: ComponentDetails) {
      const index = this.membersBuild.findIndex(item => item.position === data.position);
      this.membersBuild[index] = data;
    },

    async addNextOptions(data: NextComponentSummary): Promise<void> {
      const nextOptionsComponent = this.genNextOptions(data.previousPosition, data.previousComponentType, data.parentGroup);
      if (data.previousPosition !== this.membersBuild.length - 1 && this.membersBuild[data.previousPosition + 1].type === DefinitionType.ADD_NEXT) {
        this.membersBuild[data.previousPosition + 1] = nextOptionsComponent;
      } else {
        this.membersBuild.splice(data.previousPosition + 1, 0, nextOptionsComponent);
      }
      this.updatePositions();
      await this.$nextTick();
      const itemToScrollTo = document.getElementById(nextOptionsComponent.id);
      itemToScrollTo?.scrollIntoView();
    },

    addItem(data: { selectedType: DefinitionType; position: number; value: any }): void {
      const newComponent = this.generateNewComponent(data.selectedType, data.position, data.value);
      if (!newComponent) return;
      this.membersBuild[data.position] = newComponent;
      if (this.membersBuild[this.membersBuild.length - 1].type !== DefinitionType.ADD_NEXT) {
        this.membersBuild.push(this.genNextOptions(this.membersBuild.length - 1, this.membersBuild[this.membersBuild.length - 1].type, DefinitionType.BUILDER));
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
      this.membersBuild.forEach((item: ComponentDetails, index: number) => {
        item.position = index;
      });
    }
  }
});
</script>

<style scoped>
#members-builder-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

#members-build {
  flex-grow: 100;
  width: 100%;
  overflow: auto;
  border: 1px solid black;
  border-radius: 3px;
  padding: 1rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
}
</style>
