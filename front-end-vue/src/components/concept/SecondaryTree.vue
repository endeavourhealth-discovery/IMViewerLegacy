<template>
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
          :class="'fas fa-fw' + slotProps.node.typeIcon"
          :style="'color:' + slotProps.node.color"
          aria-hidden="true"
        />
      </span>
      <ProgressSpinner v-if="slotProps.node.loading" />
      {{ slotProps.node.label }}
    </template>
  </Tree>
</template>

<script lang="ts">
import { getIconFromType, getColourFromType } from "@/helpers/ConceptTypeMethods";
import { TreeNode } from "@/models/TreeNode";
import ConceptService from "@/services/ConceptService";
import { IM } from "@/vocabulary/IM";
import { RDF } from "@/vocabulary/RDF";
import { RDFS } from "@/vocabulary/RDFS";
import { defineComponent } from "vue";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "SecondaryTree",
  props: ["conceptIri"],
  watch: {
    async conceptIri(newValue) {
      await this.getConceptAggregate(newValue);
      this.createTree(
        this.conceptAggregate.concept,
        this.conceptAggregate.parents,
        this.conceptAggregate.children
      );
    }
  },
  data() {
    return {
      conceptAggregate: {} as any,
      root: [] as any,
      expandedKeys: {} as any,
      selectedKey: {} as any,
    }
  },
  async mounted() {
    await this.getConceptAggregate(this.conceptIri);
    this.createTree(
      this.conceptAggregate.concept,
      this.conceptAggregate.parents,
      this.conceptAggregate.children
    );
  },
  methods: {
    async getConceptAggregate(iri: string): Promise<void> {
      await Promise.all([
        ConceptService.getConcept(iri).then(res => {
          this.conceptAggregate.concept = res.data;
        }),
        ConceptService.getConceptParents(iri).then(res => {
          this.conceptAggregate.parents = res.data;
        }),
        ConceptService.getConceptChildren(iri).then(res => {
          this.conceptAggregate.children = res.data;
        })
      ]).catch(err => {
        this.$toast.add(
          LoggerService.error("Secondary tree selected concept aggregate fetch failed", err)
        );
      });
    },

    async getNodeParents(iri: string): Promise<any[] | void> {
      let result: any;
      await ConceptService.getConceptParents(iri).then(res => {
        result = res.data;
      }).catch(err => {
        this.$toast.add(
          LoggerService.error("Secondary tree node parents fetch failed", err)
        );
      });
      return result;
    },

    async createTree(concept: any, parentHierarchy: any, children: any): Promise<void> {
      this.expandedKeys = {};
      const selectedConcept = this.createTreeNode(
        concept[RDFS.LABEL],
        concept[IM.IRI],
        concept[RDF.TYPE],
        concept[RDFS.LABEL],
        concept.hasChildren
      );

      children.forEach((child: any) => {
        selectedConcept.children.push(
          this.createTreeNode(
            child.name,
            child["@id"],
            child.type,
            child.name,
            child.hasChildren
          )
        );
      });

      this.root.push(selectedConcept);
      this.expandedKeys[0] = true;
      let count = 0;

      while(count < 3 && this.root[0] && this.root[0].key !== "Discovery ontology") {
        const rootCopy = [...this.root];
        console.log("root copy")
        console.log(rootCopy)
        this.root = [];

        await this.parentNodeGenerator(rootCopy);

        count++
        // this.expandedKeys[count] = true;
        console.log("loop end" + count);
        console.log(this.root);
      }

      // if(parentHierarchy.length) {
      //   const rootCopy = [...this.root]
      //   this.root = [];
      //   parentHierarchy.forEach((parent: any) => {
      //     const parentNode = this.createTreeNode(
      //       parent.name,
      //       parent["@id"],
      //       parent.type,
      //       parent.name,
      //       parent.hasChildren
      //     )
      //   })
      //   rootCopy.forEach((item: any) => {
      //     item.children.push(rootCopy)
      //   })
      //   this.root.push(rootCopy);
      // } else {
      //   this.root.push(selectedConcept);
      // }

      // if (parentHierarchy.length) {
      //   const parent = this.createTreeNode(
      //     parentHierarchy[0].name,
      //     parentHierarchy[0]["@id"],
      //     parentHierarchy[0].type,
      //     "0",
      //     parentHierarchy[0].hasChildren
      //   );
      //   parent.children.push(selectedConcept);
      //   this.root.push(parent);
      // } else {
      //   this.root.push(selectedConcept);
      // }
      // this.expandedKeys[0] = true;
      // this.expandedKeys[1] = true;
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
      this.$router.push({
        name: "Concept",
        params: { selectedIri: node.data }
      });
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
          )
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
      const parentNodes: any[] = [];
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
        parentNodes.push(
          this.createTreeNode(
            parent.name,
            parent["@id"],
            parent.type,
            parent.name,
            true
          )
        );
      });

      parentNodes.forEach((parentNode: TreeNode) => {
        parentNode.children.push(this.root[0]);
        this.expandedKeys[parentNode.key] = true;
      });

      this.root = parentNodes;
    },

    async parentNodeGenerator(rootCopy: any) {
      for (const node of rootCopy) {
        let parents: any;
        await this.getNodeParents(node.data).then(res => {
          parents = res;
          console.log(parents);
        });
        if (parents.length) {
          parents.forEach((parent: any) => {
            if (!(parent.name in this.expandedKeys)) {
              const parentNode = this.createTreeNode(
                parent.name,
                parent["@id"],
                parent.type,
                parent.name,
                parent.hasChildren
              );
              parentNode.children = rootCopy;
              console.log(parentNode);
              this.root.push(parentNode);
              this.expandedKeys[parentNode.key] = true;
            }
          });
        }
      }
    }
  }
});
</script>

<style scoped>

</style>
