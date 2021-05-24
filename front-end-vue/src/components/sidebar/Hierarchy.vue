<template>
  <div
    class="p-d-flex p-flex-column p-jc-start"
    id="hierarchy-tree-bar-container"
  >
    <div class="p-d-flex p-flex-row p-jc-start" id="hierarchy-selected-bar">
      <Button
        :label="parentLabel"
        :disabled="parentLabel === ''"
        icon="pi pi-chevron-up"
        @click="expandParents"
        class="p-button-text p-button-plain"
      />
      <Button
        icon="pi pi-home"
        @click="resetConcept"
        class="p-button-rounded p-button-text p-button-plain"
      />
      <Button v-if="$store.state.treeLocked"
        class="p-button-rounded p-button-text p-button-plain"
        @click="toggleTreeLocked(false)"
        v-tooltip.right="'Toggle hierarchy tree updates on concept select'"
      >
        <i class="fas fa-link"></i>
      </Button>
      <Button v-else
        class="p-button-rounded p-button-text p-button-plain"
        @click="toggleTreeLocked(true)"
        v-tooltip.right="'Toggle hierarchy tree updates on concept select'"
      >
        <i class="fas fa-unlink"></i>
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
        <span v-if="!slotProps.node.loading">
          <i
            :class="'fas fa-fw ' + slotProps.node.typeIcon"
            :style="'color:' + slotProps.node.color"
            aria-hidden="true"
          />
        </span>
        <ProgressSpinner v-if="slotProps.node.loading" />
        {{ slotProps.node.label }}
      </template>
    </Tree>
  </div>
</template>

<script lang="ts">
import { HistoryItem } from "@/models/HistoryItem";
import { defineComponent } from "vue";
import { mapState } from "vuex";
import ConceptService from "@/services/ConceptService";
import { RDFS } from "@/vocabulary/RDFS";
import { RDF } from "@/vocabulary/RDF";
import { IM } from "@/vocabulary/IM";
import LoggerService from "@/services/LoggerService";
import {
  getColourFromType,
  getIconFromType
} from "@/helpers/ConceptTypeMethods";
import { TreeNode } from "@/models/TreeNode";

export default defineComponent({
  name: "Hierarchy",
  components: {},
  computed: mapState(["conceptAggregate", "focusTree"]),
  watch: {
    conceptAggregate(newValue) {
      this.createTree(newValue.concept, newValue.parents, newValue.children);
      if (this.$route.fullPath === "/") {
        this.$store.commit("updateHistory", {
          url: this.$route.fullPath,
          conceptName: "Home",
          view: this.$route.name
        } as HistoryItem);
      } else {
        this.$store.commit("updateHistory", {
          url: this.$route.fullPath,
          conceptName: newValue.concept[RDFS.LABEL],
          view: this.$route.name
        } as HistoryItem);
      }
    },
    focusTree(newValue) {
      if (newValue === true) {
        this.refreshTree(this.conceptAggregate.concept, this.conceptAggregate.parents, this.conceptAggregate.children);
        this.$store.commit("focusTree", false);
        this.$emit("showTree");
      }
    }
  },
  data() {
    return {
      searchResult: "",
      root: [] as TreeNode[],
      expandedKeys: {} as any,
      selectedKey: {} as any,
      parentLabel: ""
    };
  },
  methods: {
    createTree(concept: any, parentHierarchy: any, children: any): void {
      if (this.root.length == 0) {
        this.refreshTree(concept, parentHierarchy, children);
      } else if (concept[IM.IRI] === IM.NAMESPACE + "DiscoveryOntology") {
        this.refreshTree(concept, parentHierarchy, children);
      }
    },

    refreshTree(concept: any, parentHierarchy: any, children: any): void {
      this.expandedKeys = {};
      const selectedConcept = this.createTreeNode(
        concept[RDFS.LABEL],
        concept[IM.IRI],
        concept[RDF.TYPE],
        concept[RDFS.LABEL],
        concept.hasChildren
      );

      children.forEach((child: any) => {
        if (child.name) {
          //remove this to return all OWL children
          selectedConcept.children.push(
            this.createTreeNode(
              child.name,
              child["@id"],
              child.type,
              child.name,
              child.hasChildren
            )
          );
        }
      });
      this.root = [];

      if (parentHierarchy.length) {
        this.parentLabel = parentHierarchy[0].name;
      }

      this.root.push(selectedConcept);
      this.expandedKeys[selectedConcept.key] = true;
      this.selectedKey[selectedConcept.key] = true;
    },

    createTreeNode(
      conceptName: any,
      conceptIri: any,
      conceptTypes: any,
      level: any,
      hasChildren: boolean
    ): TreeNode {
      const node: TreeNode = {
        key: level,
        label: conceptName,
        typeIcon: getIconFromType(conceptTypes),
        color: getColourFromType(conceptTypes),
        data: conceptIri,
        leaf: !hasChildren,
        loading: false,
        children: []
      };
      return node;
    },

    onNodeSelect(node: any): void {
      if (node.label === "Discovery ontology") {
        this.$router.push({ name: "Dashboard" });
      } else {
        this.$router.push({
          name: "Concept",
          params: { selectedIri: node.data }
        });
      }
    },

    async expandChildren(node: TreeNode): Promise<void> {
      node.loading = true;
      this.expandedKeys[node.key] = true;
      let children: any[] = [];
      await ConceptService.getConceptChildren(node.data)
        .then(res => {
          children = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error("Concept children server request failed", err)
          );
        });
      let index = 0;

      children.forEach((child: any) => {
        if (!this.containsChild(node.children, child)) {
          node.children.push(
            this.createTreeNode(
              child.name,
              child["@id"],
              child.type,
              node.key + "-" + index,
              child.hasChildren
            )
          );
          index++;
        }
      });
      node.loading = false;
    },

    containsChild(children: any[], child: any) {
      if (children.some(e => e.data === child?.["@id"])) {
        return true;
      }
      return false;
    },

    async expandParents(): Promise<void> {
      this.expandedKeys[this.root[0].key] = true;

      let parents: any[] = [];
      const parentsNodes: any[] = [];
      await ConceptService.getConceptParents(this.root[0].data)
        .then(res => {
          parents = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error("Concept children server request failed", err)
          );
        });

      parents.forEach((parent: any) => {
        parentsNodes.push(
          this.createTreeNode(
            parent.name,
            parent["@id"],
            parent.type,
            parent.name,
            true
          )
        );
      });

      parentsNodes.forEach((parentNode: TreeNode) => {
        parentNode.children.push(this.root[0]);
        this.expandedKeys[parentNode.key] = true;
      });

      this.root = parentsNodes;

      await ConceptService.getConceptParents(this.root[0].data)
        .then(res => {
          if (res.data[0]) {
            this.parentLabel = res.data[0].name;
          } else {
            this.parentLabel = "";
          }
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error("Concept children server request failed", err)
          );
        });
    },

    resetConcept(): void {
      this.parentLabel = "";
      this.$store.commit(
        "updateConceptIri",
        "http://endhealth.info/im#DiscoveryOntology"
      );
      this.$store.dispatch(
        "fetchConceptAggregate",
        "http://endhealth.info/im#DiscoveryOntology"
      );
      this.$router.push({ name: "Dashboard" });
    },

    toggleTreeLocked(value: boolean): void {
      this.$store.commit("updateTreeLocked", value);
    }
  }
});
</script>

<style>
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
  height: 95%;
  overflow: auto;
}
.p-tree-toggler,
.p-tree-toggler-icon {
  min-width: 2rem;
}

.p-progress-spinner {
  width: 1.25em !important;
  height: 1.25em !important;
}
</style>
