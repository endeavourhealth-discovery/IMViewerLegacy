<template>
  <div v-if="loading" class="p-d-flex p-flex-row p-jc-center">
    <div class="p-text-center">
      <ProgressSpinner />
    </div>
  </div>
  <div v-else class="logic-container" :id="id">
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
          @deleteClicked="deleteItemWrapper"
          @addClicked="addItemWrapper"
          @updateClicked="updateItemWrapper"
          @addNextOptionsClicked="addNextOptionsWrapper"
        >
        </component>
      </template>
    </div>
    <AddDeleteButtons :last="last" :position="position" @deleteClicked="deleteClicked" @addNextClicked="addNextClicked" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import AddDeleteButtons from "@/components/edit/memberEditor/builder/AddDeleteButtons.vue";
import Entity from "@/components/edit/memberEditor/builder/Entity.vue";
import AddNext from "@/components/edit/memberEditor/builder/AddNext.vue";
import { NextComponentSummary } from "@/models/definition/NextComponentSummary";
import { ComponentDetails } from "@/models/definition/ComponentDetails";
import { ComponentType } from "@/models/definition/ComponentType";
import { SHACL } from "@/vocabulary/SHACL";
import { isArrayHasLength, isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import { TTIriRef } from "@/models/TripleTree";
import EntityService from "@/services/EntityService";
import { RDF } from "@/vocabulary/RDF";
import { isValueSet } from "@/helpers/ConceptTypeMethods";
import Refinement from "@/components/edit/memberEditor/builder/Refinement.vue";
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
import { mapState } from "vuex";
import { IM } from "@/vocabulary/IM";
import { EntityReferenceNode } from "@/models/EntityReferenceNode";

export default defineComponent({
  name: "Logic",
  props: {
    id: { type: String, required: true },
    position: { type: Number, required: true },
    value: { type: Object as PropType<{ iri: string; children: PropType<Array<any>> | undefined }>, required: false },
    last: { type: Boolean, required: true }
  },
  components: { AddDeleteButtons, AddNext, Entity, Refinement },
  emits: {
    addNextOptionsClicked: (payload: NextComponentSummary) => true,
    deleteClicked: (payload: ComponentDetails) => true,
    updateClicked: (payload: ComponentDetails) => true
  },
  computed: mapState(["filterOptions"]),
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
    this.loading = true;
    if (this.value && isObjectHasKeys(this.value, ["iri", "children"])) {
      const found = this.options.find(option => option.iri === this.value?.iri);
      this.selected = found ? found : this.options[1];
      await this.createBuild();
    } else {
      this.selected = this.options[1];
      this.logicBuild.push(genNextOptions(-1, ComponentType.LOGIC, ComponentType.LOGIC));
    }
    this.loading = false;
  },
  data() {
    return {
      options: [
        { iri: SHACL.AND, name: "AND" },
        { iri: SHACL.OR, name: "OR" },
        { iri: SHACL.NOT, name: "NOT" }
      ] as { iri: string; name: string }[],
      selected: {} as { iri: string; name: string },
      logicBuild: [] as any[],
      loading: true
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
        this.logicBuild.push(genNextOptions(last, this.logicBuild[last].type, ComponentType.LOGIC));
      } else {
        this.createDefaultBuild();
      }
    },

    createDefaultBuild() {
      this.logicBuild.push(genNextOptions(0, ComponentType.LOGIC));
    },

    async processChild(child: any, position: number) {
      if (isObjectHasKeys(child, ["@id"])) return await this.processIri(child, position);
      else if (isObjectHasKeys(child, [SHACL.AND]) || isObjectHasKeys(child, [SHACL.OR]) || isObjectHasKeys(child, [SHACL.NOT]))
        return this.processLogic(child, position);
      else return this.processRefinement(child, position);
    },

    processLogic(child: any, position: number) {
      for (const [key, value] of Object.entries(child)) {
        return generateNewComponent(ComponentType.LOGIC, position, { iri: key, children: value });
      }
    },

    async processIri(iri: TTIriRef, position: number) {
      const types = (await EntityService.getPartialEntity(iri["@id"], [RDF.TYPE]))[RDF.TYPE];
      if (isValueSet(types)) {
        const typeOptions = this.filterOptions.types.filter(
          (type: EntityReferenceNode) => type["@id"] === IM.VALUE_SET || type["@id"] === IM.CONCEPT_SET || type["@id"] === IM.CONCEPT_SET_GROUP
        );
        const options = { status: this.filterOptions.status, schemes: this.filterOptions.schemes, types: typeOptions };
        return generateNewComponent(ComponentType.ENTITY, position, { filterOptions: options, entity: iri, type: ComponentType.ENTITY });
      } else {
        const typeOptions = this.filterOptions.types.filter((type: EntityReferenceNode) => type["@id"] === IM.CONCEPT);
        const options = { status: this.filterOptions.status, schemes: this.filterOptions.schemes, types: typeOptions };
        return generateNewComponent(ComponentType.ENTITY, position, { filterOptions: options, entity: iri, type: ComponentType.ENTITY });
      }
    },

    processRefinement(child: any, position: number) {
      for (const [key, value] of Object.entries(child)) {
        return generateNewComponent(ComponentType.REFINEMENT, position, { propertyIri: key, children: value });
      }
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
        type: ComponentType.LOGIC,
        component: ComponentType.LOGIC,
        json: this.createLogicJson()
      });
    },

    createLogicJson() {
      let json = {} as any;
      if (this.selected.iri) json[this.selected.iri] = [];
      if (this.logicBuild.length) {
        for (const item of this.logicBuild) {
          if (item.type !== ComponentType.ADD_NEXT) json[this.selected.iri].push(item.json);
        }
      }
      return json;
    },

    updateItemWrapper(data: ComponentDetails) {
      updateItem(data, this.logicBuild);
    },

    addItemWrapper(data: { selectedType: ComponentType; position: number; value: any }): void {
      addItem(data, this.logicBuild, ComponentType.LOGIC);
    },

    async addNextOptionsWrapper(data: NextComponentSummary): Promise<void> {
      const nextOptionsComponent = addNextOptions(data, this.logicBuild);
      await this.$nextTick();
      scrollIntoView(nextOptionsComponent);
    },

    deleteItemWrapper(data: ComponentDetails): void {
      deleteItem(data, this.logicBuild, ComponentType.LOGIC);
    },

    deleteClicked(): void {
      this.$emit("deleteClicked", {
        id: this.id,
        value: this.selected,
        position: this.position,
        type: ComponentType.LOGIC,
        component: ComponentType.LOGIC,
        json: this.selected.iri
      });
    },

    addNextClicked(): void {
      this.$emit("addNextOptionsClicked", {
        previousComponentType: ComponentType.LOGIC,
        previousPosition: this.position,
        parentGroup: ComponentType.LOGIC
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
