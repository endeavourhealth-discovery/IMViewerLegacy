<template>
  <span class="p-buttonset">
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
</template>

<script lang="ts">
import { HistoryItem } from "@/models/HistoryItem";
import { Options, Vue } from "vue-class-component";
import { mapState } from "vuex";
import ConceptService from "@/services/ConceptService";
import { RDFS } from "@/vocabulary/RDFS";
import { RDF } from "@/vocabulary/RDF";
import { IM } from "@/vocabulary/IM";
import LoggerService from "@/services/LoggerService";
import { getIconFromType } from "@/helpers/ConceptTypeMethods";

interface TreeNode {
  key: string;
  label: string;
  data: string;
  icon: string;
  leaf: boolean;
  children: Array<TreeNode>;
}

@Options({
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
  }
})
export default class Hierarchy extends Vue {
  searchResult = "";
  root: Array<TreeNode> = [];
  expandedKeys: any = {};
  selectedKey = { 1: true };
  parentLabel = "";

  createTree(concept: any, parentHierarchy: any, children: any) {
    if (this.root.length == 0) {
      this.refreshTree(concept, parentHierarchy, children);
    } else if (concept[IM.IRI] === IM.NAMESPACE + "DiscoveryOntology") {
      this.refreshTree(concept, parentHierarchy, children);
    }
  }

  refreshTree(concept: any, parentHierarchy: any, children: any) {
    this.expandedKeys = {};
    let index = 1;
    const selectedConcept = this.createTreeNode(
      concept[RDFS.LABEL],
      concept[IM.IRI],
      concept[RDF.TYPE],
      index,
      concept.hasChildren
    );
    index++;

    children.forEach((child: any) => {
      if (child.name) {
        //remove this to return all OWL children
        selectedConcept.children.push(
          this.createTreeNode(
            child.name,
            child.iri,
            child.type,
            index,
            child.hasChildren
          )
        );
      }
      index++;
    });
    this.root = [];

    if (parentHierarchy.length) {
      this.parentLabel = parentHierarchy[0].name;
    }

    this.root.push(selectedConcept);
    this.expandedKeys[0] = true;
    this.expandedKeys[1] = true;
    this.selectedKey = { 1: true };
  }

  createTreeNode(
    conceptName: any,
    conceptIri: any,
    conceptTypes: any,
    level: any,
    hasChildren: boolean
  ) {
    const node: TreeNode = {
      key: level,
      label: conceptName,
      icon: getIconFromType(conceptTypes),
      data: conceptIri,
      leaf: !hasChildren,
      children: []
    };
    return node;
  }

  onNodeSelect(node: any) {
    if (node.label === "Discovery ontology") {
      this.$router.push({ name: "Dashboard" });
    } else {
      this.$router.push({
        name: "Concept",
        params: { selectedIri: node.data }
      });
    }
  }

  async expandChildren(node: TreeNode) {
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

    node.children = [];

    children.forEach((child: any) => {
      node.children.push(
        this.createTreeNode(
          child.name,
          child.iri,
          child.type,
          node.key + "-" + index,
          child.hasChildren
        )
      );
      index++;
    });
  }

  async expandParents() {
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
        this.createTreeNode(parent.name, parent.iri, parent.type, 0, true)
      );
    });

    parentsNodes.forEach((parentNode: TreeNode) => {
      parentNode.children.push(this.root[0]);
    });

    this.root = parentsNodes;
    this.expandedKeys[0] = true;
    this.expandedKeys[1] = true;

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
</script>

<style>
.p-tree .p-tree-container .p-treenode .p-treenode-content {
  padding: 0rem !important;
  transition: box-shadow 3600s 3600s !important;
}
.tree-root {
  height: 100%;
  overflow: auto;
}
.p-tree-toggler {
  min-width: 22px;
}
</style>
