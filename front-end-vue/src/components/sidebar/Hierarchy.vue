<template>
  <div class="p-d-flex p-flex-column p-jc-start" id="hierarchy-tree-bar-container">
    <div class="p-d-flex p-flex-row p-jc-start p-ai-center" id="hierarchy-selected-bar">
      <Button :label="parentLabel" :disabled="parentLabel === ''" icon="pi pi-chevron-up" @click="expandParents" class="p-button-text p-button-plain" />
      <Button icon="pi pi-home" @click="resetConcept" class="p-button-rounded p-button-text p-button-plain">
        <i class="fas fa-home" aria-hidden="true"></i>
      </Button>
      <Button
        v-if="$store.state.treeLocked"
        class="p-button-rounded p-button-text p-button-plain"
        @click="toggleTreeLocked(false)"
        v-tooltip.right="'Toggle hierarchy tree to update on concept search'"
      >
        <i class="fas fa-link" aria-hidden="true"></i>
      </Button>
      <Button
        v-else
        class="p-button-rounded p-button-text p-button-plain"
        @click="toggleTreeLocked(true)"
        v-tooltip.right="'Toggle hierarchy tree to update on concept search'"
      >
        <i class="fas fa-unlink" aria-hidden="true"></i>
      </Button>
    </div>

    <Tree
      :value="root"
      selectionMode="single"
      v-model:selectionKeys="selectedKey"
      :expandedKeys="expandedKeys"
      @node-select="onNodeSelect"
      @node-expand="expandChildren"
      class="tree-root"
    >
      <template #default="slotProps">
        <div class="tree-row">
          <span v-if="!slotProps.node.loading">
            <i :class="'fas fa-fw ' + slotProps.node.typeIcon" :style="'color:' + slotProps.node.color" aria-hidden="true" />
          </span>
          <ProgressSpinner v-if="slotProps.node.loading" />
          <span>{{ slotProps.node.label }}</span>
        </div>
      </template>
    </Tree>
  </div>
</template>

<script lang="ts">
import { HistoryItem } from "@/models/HistoryItem";
import { defineComponent } from "vue";
import { mapState } from "vuex";
import EntityService from "@/services/EntityService";
import { RDFS } from "@/vocabulary/RDFS";
import { RDF } from "@/vocabulary/RDF";
import { IM } from "@/vocabulary/IM";
import { getColourFromType, getIconFromType } from "@/helpers/ConceptTypeMethods";
import { TreeNode } from "@/models/TreeNode";
import { MODULE_IRIS } from "@/helpers/ModuleIris";
import { ConceptAggregate } from "@/models/ConceptAggregate";
import { EntityReferenceNode } from "@/models/EntityReferenceNode";
import { TTIriRef } from "@/models/TripleTree";
import { isArrayHasLength } from "@/helpers/DataTypeCheckers";

export default defineComponent({
  name: "Hierarchy",
  props: { active: { type: Number, required: true } },
  emits: ["showTree"],
  computed: mapState(["conceptIri", "focusTree", "treeLocked", "sideNavHierarchyFocus", "history"]),
  watch: {
    async conceptIri(newValue) {
      await this.getConceptAggregate(newValue);
      if (!this.treeLocked) {
        this.selectedKey = {};
        this.refreshTree();
      }
      this.updateHistory();
    },
    async sideNavHierarchyFocus(newValue, oldValue) {
      if (newValue.iri !== oldValue.iri) {
        this.selectedKey = {};
        await this.getConceptAggregate(this.conceptIri);
        this.refreshTree();
        this.updateHistory();
      }
    },
    async focusTree(newValue) {
      if (newValue === true) {
        await this.getConceptAggregate(this.conceptIri);
        this.refreshTree();
        this.$store.commit("updateFocusTree", false);
        this.$emit("showTree");
      }
    },
    active(newValue, oldValue) {
      if (!this.treeLocked && newValue === 0 && oldValue !== 0) {
        this.refreshTree();
      }
    },
    async treeLocked(newValue) {
      if (!newValue) {
        await this.getConceptAggregate(this.conceptIri);
        this.refreshTree();
      }
    }
  },
  data() {
    return {
      searchResult: "",
      conceptAggregate: {} as ConceptAggregate,
      root: [] as TreeNode[],
      expandedKeys: {} as any,
      selectedKey: {} as any,
      parentLabel: ""
    };
  },
  async mounted() {
    await this.getConceptAggregate(this.conceptIri);
    this.refreshTree();
    this.updateHistory();
  },
  methods: {
    updateHistory(): void {
      if (!MODULE_IRIS.includes(this.conceptIri)) {
        this.$store.commit("updateHistory", {
          url: this.$route.fullPath,
          conceptName: this.conceptAggregate.concept[RDFS.LABEL],
          view: this.$route.name
        } as HistoryItem);
      }
    },
    async getConceptAggregate(iri: string): Promise<void> {
      this.conceptAggregate.concept = await EntityService.getPartialEntity(iri, [RDFS.LABEL, RDFS.COMMENT, RDF.TYPE]);

      this.conceptAggregate.parents = await EntityService.getEntityParents(iri);

      this.conceptAggregate.children = await EntityService.getEntityChildren(iri);
    },

    refreshTree(): void {
      const concept = this.conceptAggregate.concept;
      const parentHierarchy = this.conceptAggregate.parents;
      const children = this.conceptAggregate.children;
      this.expandedKeys = {};
      const selectedConcept = this.createTreeNode(concept[RDFS.LABEL], concept[IM.IRI], concept[RDF.TYPE], concept.hasChildren);

      children.forEach((child: EntityReferenceNode) => {
        selectedConcept.children.push(this.createTreeNode(child.name, child["@id"], child.type, child.hasChildren));
      });
      this.root = [] as TreeNode[];

      this.parentLabel = isArrayHasLength(parentHierarchy) ? parentHierarchy[0].name : "";

      this.root.push(selectedConcept);
      this.expandedKeys[selectedConcept.key] = true;
      this.selectedKey[selectedConcept.key] = true;
    },

    createTreeNode(conceptName: string, conceptIri: string, conceptTypes: TTIriRef[], hasChildren: boolean): TreeNode {
      return {
        key: conceptName,
        label: conceptName,
        typeIcon: getIconFromType(conceptTypes),
        color: getColourFromType(conceptTypes),
        data: conceptIri,
        leaf: !hasChildren,
        loading: false,
        children: [] as TreeNode[]
      };
    },

    async onNodeSelect(node: TreeNode): Promise<void> {
      if (MODULE_IRIS.includes(node.data)) {
        this.$router.push({ name: "Dashboard" });
      } else {
        this.$router.push({
          name: "Concept",
          params: { selectedIri: node.data }
        });
        await this.getFirstParent(node);
      }
    },

    async expandChildren(node: TreeNode): Promise<void> {
      node.loading = true;
      this.expandedKeys[node.key] = true;
      const children = await EntityService.getEntityChildren(node.data);
      children.forEach((child: EntityReferenceNode) => {
        if (!this.containsChild(node.children, child)) {
          const newNode = this.createTreeNode(child.name, child["@id"], child.type, child.hasChildren);
          node.children.push(newNode);
        }
      });
      node.loading = false;
    },

    containsChild(children: TreeNode[], child: EntityReferenceNode): boolean {
      if (children.some(e => e.data === child["@id"])) {
        return true;
      }
      return false;
    },

    async expandParents(): Promise<void> {
      const selectedLabel = Object.keys(this.selectedKey)[0];
      const selected = this.root.find(child => child.label === selectedLabel) || this.root[0];
      this.expandedKeys[selected.key] = false;
      const parentsNodes = [] as TreeNode[];
      const parents = await EntityService.getEntityParents(selected.data);
      parents.forEach((parent: EntityReferenceNode) => {
        parentsNodes.push(this.createTreeNode(parent.name, parent["@id"], parent.type, true));
      });

      // optional - adds child to last node
      parentsNodes[parentsNodes.length - 1].children.push(selected);
      this.expandedKeys[parentsNodes[parentsNodes.length - 1].key] = true;
      this.expandedKeys[selected.key] = false;

      this.root = parentsNodes;

      await this.getFirstParent(this.root[0]);
    },

    async getFirstParent(node: TreeNode): Promise<void> {
      const parentsReturn = await EntityService.getEntityParents(node.data);
      this.parentLabel = parentsReturn[0] ? parentsReturn[0].name : "";
    },

    async resetConcept(): Promise<void> {
      this.selectedKey = {};
      this.$emit("showTree");
      this.$store.commit("updateConceptIri", this.sideNavHierarchyFocus.iri);
      await this.getConceptAggregate(this.conceptIri);
      this.refreshTree();
      this.$router.push({ name: "Dashboard" });
    },

    toggleTreeLocked(value: boolean): void {
      this.$store.commit("updateTreeLocked", value);
    }
  }
});
</script>

<style scoped>
#hierarchy-tree-bar-container {
  height: 100%;
}

.p-tree .p-tree-container .p-treenode .p-treenode-content {
  padding: 0rem !important;
  transition: box-shadow 3600s 3600s !important;
}

.p-tree-toggler {
  margin-right: 0 !important;
}

.tree-root {
  height: 100%;
  overflow: auto;
}
.tree-root ::v-deep(.p-tree-toggler) {
  min-width: 2rem;
}

.p-progress-spinner {
  width: 1.25em !important;
  height: 1.25em !important;
}

.tree-row {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.25rem;
}
</style>
