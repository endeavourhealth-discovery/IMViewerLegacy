<template>
  <div id="members-builder-container">
    <h3>Members builder</h3>
    <div id="members-build">
      <template v-for="item in membersBuild" :key="item.id">
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
import EntityService from "@/services/EntityService";
import { RDF } from "@/vocabulary/RDF";
import { isValueSet } from "@/helpers/ConceptTypeMethods";

export default defineComponent({
  name: "Builder",
  props: { included: { type: Array as PropType<Array<any>>, required: true } },
  components: {},
  emits: {
    definitionUpdated: (payload: any) => true
  },
  mounted() {
    this.createBuild();
  },
  data() {
    return {
      membersBuild: [] as any[]
    };
  },
  methods: {
    createBuild() {
      this.membersBuild = [];
      if (!isArrayHasLength(this.included)) {
        return;
      }
      let position = 0;
      this.included.forEach((item: any) => {
        this.membersBuild.push(this.processAny(item, position));
        position++;
      });
    },

    processAny(item: any, position: number): any {
      if (isObjectHasKeys(item, ["@id"])) return this.processIri(item, position);
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
          return this.generateNewComponent(DefinitionType.LOGIC, position, key);
        } else {
          console.log("unexpected key in processObject: " + key);
        }
      }
    },

    processArray(items: any[], position: number): any {
      let arrayPosition = 0;
      const result = [] as any[];
      items.forEach((item: any) => result.push(this.processAny(item, arrayPosition)));
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
        default:
          break;
      }
      return result;
    },

    genNextOptions(position: number, previous: DefinitionType) {
      return {
        id: "addNext_" + (position + 1),
        value: {
          previousPosition: position,
          previousType: previous
        },
        position: position + 1,
        type: DefinitionType.ADD_NEXT,
        JSON: {},
        component: DefinitionComponent.ADD_NEXT
      };
    }
  }
});
</script>

<style scoped></style>
