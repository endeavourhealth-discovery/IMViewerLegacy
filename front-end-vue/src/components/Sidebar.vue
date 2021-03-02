<template>
  <span class="p-input-icon-left" style="width:100%">
    <i class="pi pi-search" />
    <InputText
      type="text"
      v-model="searchResult"
      placeholder="Search"
      class="p-inputtext-lg"
      autoWidth="false"
      style="width:100%"
    />
  </span>

  <TabView class="sidemenu">
    <TabPanel class="sidemenu">
      <template #header>
        <font-awesome-icon
          :icon="['fas', 'project-diagram']"
          style="padding:1px"
        />
        <span>Tree</span>
      </template>
      <Tree :value="root" :expandedKeys="expandedKeys"></Tree>
    </TabPanel>
    <TabPanel class="sidemenu">
      <template #header>
        <font-awesome-icon :icon="['fas', 'history']" style="padding:1px" />
        <span>History</span>
      </template>
      List
    </TabPanel>
    <TabPanel class="sidemenu">
      <template #header>
        <font-awesome-icon :icon="['fas', 'search']" style="padding:1px" />
        <span>Search results</span>
      </template>
      Search
    </TabPanel>
  </TabView>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ConceptService from "../services/ConceptService";

interface TreeNode {
  key: string;
  label: string;
  data: string;
  icon: string;
  leaf: boolean;
  children: Array<TreeNode>;
}

@Options({
  components: {}
})
export default class Header extends Vue {
  private conceptService = new ConceptService();

  searchResult = "";
  root: Array<TreeNode> = [];
  expandedKeys: any = {};

  async mounted() {
    const conceptIri: any = this.$router.currentRoute.value.params.conceptIri;
    const concept = await (await this.conceptService.getConcept(conceptIri))
      .data;
    const parentHierarchy = await (
      await this.conceptService.getConceptParentHierarchy(conceptIri)
    ).data;
    const children = await (
      await this.conceptService.getConceptChildren(conceptIri)
    ).data;

    console.log(
      await (await this.conceptService.getConceptParents(conceptIri)).data
    );
    console.log(
      await (await this.conceptService.getAncestorDefinitions(conceptIri)).data
    );

    this.createTree(concept, parentHierarchy, children);
  }

  updated() {
    console.log(this.$router.currentRoute.value.params.conceptIri);
  }

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
      children: []
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
