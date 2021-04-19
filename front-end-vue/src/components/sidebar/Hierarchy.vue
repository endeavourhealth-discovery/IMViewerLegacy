<template>
  <Tree
    :value="root"
    selectionMode="single"
    v-model:selectionKeys="selectedKey"
    :expandedKeys="expandedKeys"
    @node-select="onNodeSelect"
    @node-expand="onNodeExpand"
    :loading="loading"
    style="height:100%;overflow:auto"
  ></Tree>
</template>

<script lang="ts">
import { HistoryItem } from "@/models/HistoryItem";
import { Options, Vue } from "vue-class-component";
import { mapState } from "vuex";
import ConceptService from "@/services/ConceptService";
import { RDFS } from "@/vocabulary/RDFS";
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
  loading = false;
  selectedKey = { 1: true };

  createTree(concept: any, parentHierarchy: any, children: any) {
    let index = 1;
    const selectedConcept = this.createTreeNode(
      concept[RDFS.LABEL],
      concept[IM.IRI],
      concept["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"],
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
      const parent = this.createTreeNode(
        parentHierarchy[0].name,
        parentHierarchy[0].iri,
        parentHierarchy[0].type,
        "0",
        parentHierarchy[0].hasChildren
      );
      parent.children.push(selectedConcept);
      this.root.push(parent);
    } else {
      this.root.push(selectedConcept);
    }
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

  async onNodeExpand(node: TreeNode) {
    let children: any[] = [];
    this.loading = true;
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
    this.loading = false;
  }
}
</script>

<style>
.p-tree .p-tree-container .p-treenode .p-treenode-content {
  padding: 0rem !important;
  transition: box-shadow 3600s 3600s !important;
}
</style>
