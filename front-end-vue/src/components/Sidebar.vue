<template>
  <span class="p-input-icon-left" style="width: 100%">
    <i class="pi pi-search" />
    <InputText
      type="text"
      v-model="searchResult"
      placeholder="Search"
      class="p-inputtext-lg"
      autoWidth="false"
      style="width: 100%"
    />
  </span>

  <TabView class="sidemenu">
    <TabPanel>
      <template #header>
        <font-awesome-icon
          :icon="['fas', 'project-diagram']"
          style="padding: 1px"
        />
        <span>Tree</span>
      </template>
      <Tree :value="root" :expandedKeys="expandedKeys"></Tree>
    </TabPanel>
    <TabPanel>
      <template #header>
        <font-awesome-icon :icon="['fas', 'history']" style="padding: 1px" />
        <span>History</span>
      </template>
      List
    </TabPanel>
    <TabPanel>
      <template #header>
        <font-awesome-icon :icon="['fas', 'search']" style="padding: 1px" />
        <span>Search results</span>
      </template>
      Search
    </TabPanel>
  </TabView>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ConceptService from "../services/ConceptService";
import store from "@/store/index";
import { mapState } from 'vuex';

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
  computed: mapState(['conceptAggregate']),
  watch: {
    conceptAggregate(newValue, oldValue) {
      this.createTree(newValue.concept, newValue.parents, newValue.children);
    },
  }
})
export default class Header extends Vue {

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
}
</script>

<style>
.sidemenu .p-tabview-panels {
  height: calc(100vh - 270px);
}

.p-tree .p-tree-container .p-treenode .p-treenode-content {
  padding: 0rem !important;
}
</style>
