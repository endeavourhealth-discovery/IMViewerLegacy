<template>
  <div id="members-builder-container">
    <h3>Members builder</h3>
    <div v-if="loading" class="p-d-flex p-flex-row p-jc-center">
      <div class="p-text-center">
        <ProgressSpinner />
      </div>
    </div>
    <div v-else id="members-build">
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
import AddDeleteButtons from "@/components/edit/memberEditor/builder/AddDeleteButtons.vue";
import AddNext from "@/components/edit/memberEditor/builder/AddNext.vue";
import Logic from "@/components/edit/memberEditor/builder/Logic.vue";
import Member from "@/components/edit/memberEditor/builder/Member.vue";
import Set from "@/components/edit/memberEditor/builder/Set.vue";
import { NextComponentSummary } from "@/models/definition/NextComponentSummary";
import Refinement from "@/components/edit/memberEditor/builder/Refinement.vue";
import { generateNewComponent, genNextOptions } from "@/helpers/BuilderJsonMethods";

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
      membersAsNode: {} as any,
      loading: true
    };
  },
  methods: {
    async createBuild() {
      this.loading = true;
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
        this.membersBuild.push(genNextOptions(last, this.membersBuild[last].type, DefinitionType.BUILDER));
      } else {
        this.createDefaultBuild();
      }
      this.loading = false;
    },

    createDefaultBuild() {
      this.membersBuild.push(generateNewComponent(DefinitionType.LOGIC, 0, undefined));
      this.membersBuild.push(genNextOptions(1, DefinitionType.LOGIC, DefinitionType.BUILDER));
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
      if (isValueSet(types)) return generateNewComponent(DefinitionType.SET, position, iri);
      else return generateNewComponent(DefinitionType.MEMBER, position, iri);
    },

    processObject(item: any, position: number): any {
      for (const [key, value] of Object.entries(item)) {
        if (key === SHACL.AND || key === SHACL.OR) {
          return generateNewComponent(DefinitionType.LOGIC, position, { iri: key, children: value });
        } else {
          return generateNewComponent(DefinitionType.REFINEMENT, position, { propertyIri: key, children: value });
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

    deleteItem(data: ComponentDetails): void {
      const index = this.membersBuild.findIndex(item => item.position === data.position);
      this.membersBuild.splice(index, 1);
      const length = this.membersBuild.length;
      if (data.position === 0) {
        this.membersBuild.unshift(genNextOptions(0, DefinitionType.BUILDER, DefinitionType.BUILDER));
      }
      if (index < length - 1 && this.membersBuild[index].type === DefinitionType.ADD_NEXT) {
        this.membersBuild[index] = genNextOptions(index - 1, this.membersBuild[index - 1].type, DefinitionType.BUILDER);
      }
      if (this.membersBuild[length - 1].type !== DefinitionType.ADD_NEXT) {
        this.membersBuild.push(genNextOptions(length - 1, this.membersBuild[length - 1].type, DefinitionType.BUILDER));
      } else {
        this.membersBuild[length - 1] = genNextOptions(length - 2, this.membersBuild[length - 2].type, DefinitionType.BUILDER);
      }
      this.updatePositions();
    },

    updateItem(data: ComponentDetails) {
      const index = this.membersBuild.findIndex(item => item.position === data.position);
      this.membersBuild[index] = data;
    },

    async addNextOptions(data: NextComponentSummary): Promise<void> {
      const nextOptionsComponent = genNextOptions(data.previousPosition, data.previousComponentType, data.parentGroup);
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
      const newComponent = generateNewComponent(data.selectedType, data.position, data.value);
      if (!newComponent) return;
      this.membersBuild[data.position] = newComponent;
      if (this.membersBuild[this.membersBuild.length - 1].type !== DefinitionType.ADD_NEXT) {
        this.membersBuild.push(genNextOptions(this.membersBuild.length - 1, this.membersBuild[this.membersBuild.length - 1].type, DefinitionType.BUILDER));
      }
      this.updatePositions();
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
