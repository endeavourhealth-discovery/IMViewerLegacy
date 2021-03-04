<template>
  <Tree
    :value="root"
    selectionMode="single"
    :expandedKeys="expandedKeys"
    @node-select="onNodeSelect"
  ></Tree>

  <!-- <Tree :value="nodes" selectionMode="single" v-model:selectionKeys="selectedKey2" :metaKeySelection="false" @node-select="onNodeSelect" @node-unselect="onNodeUnselect"></Tree> -->
</template>

<script lang="ts">
import { HistoryItem } from "@/models/HistoryItem";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import { Options, Vue } from "vue-class-component";
import { mapState } from "vuex";

interface TreeNode {
  key: string;
  label: string;
  data: string;
  icon: string;
  leaf: boolean;
  children: Array<TreeNode>;
}

@Options({
  components: {},
  computed: mapState(["conceptAggregate"]),
  watch: {
    conceptAggregate(newValue, oldValue) {
      this.createTree(newValue.concept, newValue.parents, newValue.children);
      this.$store.commit("updateHistory", {
        url: this.$route.fullPath,
        conceptName: newValue.concept.name,
        view: this.$route.name
      } as HistoryItem);
    }
  }
})
export default class Hierarchy extends Vue {
  searchResult = "";
  root: Array<TreeNode> = [];
  expandedKeys: any = {};

  // async mounted() {
  // }

  // convertParentHeirarchyIntoTree(parents: any) {
  //   parents.forEach((parentNode: any) => {
  //     const parent = this.createTreeNode(parentNode.name, parentNode.iri, "0");
  //     if (parentNode.parents) {
  //       this.convertParentHeirarchyIntoTree(parentNode.parents);
  //     } else {
  //       parent.children
  //     }
  //   });
  // }

  createTree(concept: any, parentHierarchy: any, children: any) {
    const selectedConcept = this.createTreeNode(concept.name, concept.iri, "0");

    children.forEach((child: any) => {
      selectedConcept.children.push(
        this.createTreeNode(child.name, child.iri, "1")
      );
    });
    this.root = [];

    if (parentHierarchy.length) {
      const parent = this.createTreeNode(
        parentHierarchy[0].name,
        parentHierarchy[0].iri,
        "0"
      );
      parent.children.push(selectedConcept);
      this.root.push(parent);
    } else {
      this.root.push(selectedConcept);
    }
    this.expandedKeys[this.root[0].key] = true;
  }

  createTreeNode(conceptName: any, conceptIri: any, level: any) {
    const node: TreeNode = {
      key: level,
      label: conceptName,
      icon: "pi pi-fw pi-inbox",
      data: conceptIri,
      leaf: false,
      children: []
    };
    return node;
  }

  onNodeSelect(node: any) {
    const currentRoute = this.$route.name as RouteRecordName | undefined;
    this.$router.push({
      name: currentRoute,
      params: { selectedIri: node.data }
    });
  }
}
</script>

<style>
.p-tree .p-tree-container .p-treenode .p-treenode-content {
  padding: 0rem !important;
}
</style>
