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
import Parent from "@/components/edit/parentsEditor/builder/Parent.vue";
import AddNext from "@/components/edit/parentsEditor/builder/AddNext.vue";
import { NextComponentSummary } from "@/models/definition/NextComponentSummary";
import { ComponentDetails } from "@/models/definition/ComponentDetails";
import { DefinitionType } from "@/models/definition/DefinitionType";
import { DefinitionComponent } from "@/models/definition/DefinitionComponent";
import { isArrayHasLength, isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import { TTIriRef } from "@/models/TripleTree";
import { IM } from "@/vocabulary/IM";
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
  name: "Logic",
  props: {
    id: { type: String, required: true },
    position: { type: Number, required: true },
    value: { type: Object as PropType<{ iri: string; children: PropType<Array<any>> | undefined }>, required: false },
    last: { type: Boolean, required: true }
  },
  components: { AddDeleteButtons, AddNext, Parent },
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
    this.loading = true;
    if (this.value && isObjectHasKeys(this.value, ["iri", "children"])) {
      const found = this.options.find(option => option.iri === this.value?.iri);
      this.selected = found ? found : this.options[0];
      await this.createBuild();
    } else {
      this.selected = this.options[0];
    }
    this.loading = false;
  },
  data() {
    return {
      options: [{ iri: IM.IS_CONTAINED_IN, name: "Contained in" }] as { iri: string; name: string }[],
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
        this.logicBuild.push(genNextOptions(last, this.logicBuild[last].type, DefinitionType.LOGIC));
      } else {
        this.createDefaultBuild();
      }
    },

    createDefaultBuild() {
      this.logicBuild.push(genNextOptions(0, DefinitionType.LOGIC));
    },

    async processChild(child: any, position: number) {
      if (isObjectHasKeys(child, ["@id"])) return this.processIri(child, position);
    },

    processIri(iri: TTIriRef, position: number) {
      return generateNewComponent(DefinitionType.PARENT, position, iri);
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

    updateItemWrapper(data: ComponentDetails) {
      updateItem(data, this.logicBuild);
    },

    addItemWrapper(data: { selectedType: DefinitionType; position: number; value: any }): void {
      addItem(data, this.logicBuild, DefinitionType.LOGIC);
    },

    async addNextOptionsWrapper(data: NextComponentSummary): Promise<void> {
      const nextOptionsComponent = addNextOptions(data, this.logicBuild);
      await this.$nextTick();
      scrollIntoView(nextOptionsComponent);
    },

    deleteItemWrapper(data: ComponentDetails): void {
      deleteItem(data, this.logicBuild, DefinitionType.LOGIC);
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
  width: 12rem;
}

.float-text {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.75rem;
  color: #6c757d;
}
</style>
