<template>
  <Tree :value="root" selectionMode="single" :expandedKeys="expandedKeys" @node-select="onNodeSelect"></Tree>


<!-- <Tree :value="nodes" selectionMode="single" v-model:selectionKeys="selectedKey2" :metaKeySelection="false" @node-select="onNodeSelect" @node-unselect="onNodeUnselect"></Tree> -->

</template>

<script lang="ts">
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
    },
  },
})
export default class Hierarchy extends Vue {
  searchResult = "";
  root: Array<TreeNode> = [];
  expandedKeys: any = {};

  // async mounted() {
  // }

  createTree(concept: any, parentHierarchy: any, children: any) {
    // const parent = this.createTreeNode(parentHierarchy[0].name, parentHierarchy[0].iri, "3");
    const selectedConcept = this.createTreeNode(
      concept.name,
      concept.iri,
      "3-0"
    );
    // parent.children.push(selectedConcept);

    children.forEach((child: any) => {
      selectedConcept.children.push(
        this.createTreeNode(child.name, child.iri, "3-0-0")
      );
    });
    this.root = [];
    this.root.push(selectedConcept);
    this.expandedKeys[this.root[0].key] = true;
  }

  createTreeNode(conceptName: any, conceptIri: any, level: any) {
    const node: TreeNode = {
      key: level,
      label: conceptName,
      icon: "pi pi-fw pi-inbox",
      data: conceptIri,
      leaf: false,
      children: [],
    };
    return node;
  }

  onNodeSelect(node: any) {
    const currentRoute = this.$route.name as RouteRecordName | undefined;
    this.$router.push({ name: currentRoute, params: { selectedIri: node.data } });
  }
}
</script>

<style>
.p-tree .p-tree-container .p-treenode .p-treenode-content {
  padding: 0rem !important;
}
</style>