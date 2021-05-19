<template>
  <div
    class="p-d-flex p-flex-column p-jc-start"
    id="hierarchy-tree-bar-container"
  >
    <span class="p-buttonset" id="hierarchy-selected-bar">
      <Button
        :label="parentLabel"
        :disabled="parentLabel === ''"
        icon="pi pi-chevron-up"
        @click="expandParents"
        class="p-button-text p-button-plain"
      />
      <Button
        icon="pi pi-refresh"
        @click="
          refreshTree(
            conceptAggregate.concept,
            conceptAggregate.parents,
            conceptAggregate.children
          )
        "
        class="p-button-rounded p-button-text p-button-plain"
      />
      <Button
        class="p-button-rounded p-button-text p-button-plain"
        disabled="true"
      >
        <div v-if="loading" class="spinner"></div
      ></Button>
    </span>

    <Tree
      :value="root"
      selectionMode="single"
      v-model:selectionKeys="selectedKey"
      :expandedKeys="expandedKeys"
      @node-select="onNodeSelect"
      @node-expand="expandChildren"
      class="tree-root"
    >
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
import { getIconFromType } from "@/helpers/ConceptTypeMethods";
import { TreeNode } from "@/models/TreeNode";

export default defineComponent({
  name: "Hierarchy",
  components: {},
  computed: mapState(["conceptAggregate"]),
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
    }
  },
  data() {
    return {
      loading: false,
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
        icon: getIconFromType(conceptTypes),
        data: conceptIri,
        leaf: !hasChildren,
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
      this.loading = true;
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
      });
      this.loading = false;
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
.tree-root {
  height: 95%;
  overflow: auto;
}
.p-tree-toggler,
.p-tree-toggler-icon {
  min-width: 2rem;
}

.p-treenode-icon {
  min-width: 1.25rem;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border-color: currentColor;
  border-style: solid;
  border-radius: 99999px;
  border-width: 2px;
  border-left-color: transparent;
  color: rgb(112, 169, 216);
  opacity: 0;
  animation-name: rotate, fadeIn;
  animation-duration: 450ms, 600ms;
  animation-timing-function: linear, ease;
  animation-iteration-count: infinite, 1;
  animation-delay: 600ms;
  animation-fill-mode: forwards;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
