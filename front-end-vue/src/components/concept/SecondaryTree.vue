<template>
  <div
    class="p-d-flex p-flex-column p-jc-start"
    id="secondary-tree-bar-container"
  >
    <div id="alternate-parents-container">
      <Button
        v-for="altParent in alternateParents"
        :key="altParent['@id']"
        :label="altParent.name"
        :disabled="altParent.name === ''"
        icon="pi pi-arrow-circle-down"
        @click="selectAltParent(altParent)"
        class="p-button-text p-button-plain"
      />
    </div>
    <div class="p-d-flex p-flex-row p-jc-start" id="secondary-tree-parents-bar">
      <Button
        :label="currentParent?.name"
        :disabled="!currentParent"
        icon="pi pi-chevron-up"
        @click="expandParents(parentPosition)"
        class="p-button-text p-button-plain"
      />
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
            :class="'fas fa-fw' + slotProps.node.typeIcon"
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
import {
  getIconFromType,
  getColourFromType
} from "@/helpers/ConceptTypeMethods";
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
      this.selectedKey = {};
      this.alternateParents = [];
      this.expandedKeys = {};
      await this.getConceptAggregate(newValue);
      this.createTree(
        this.conceptAggregate.concept,
        this.conceptAggregate.parents,
        this.conceptAggregate.children,
        this.parentPosition
      );
    }
  },
  data() {
    return {
      conceptAggregate: {} as any,
      root: [] as any,
      expandedKeys: {} as any,
      selectedKey: {} as any,
      currentParent: {} as {
        name: string;
        iri: string;
        listPosition: number;
      } | null,
      alternateParents: [] as {
        name: string;
        iri: string;
        listPosition: number;
      }[],
      parentPosition: 0
    };
  },
  async mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.setTreeHeight);
    });
    this.setTreeHeight();

    await this.getConceptAggregate(this.conceptIri);
    this.createTree(
      this.conceptAggregate.concept,
      this.conceptAggregate.parents,
      this.conceptAggregate.children,
      0
    );
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setTreeHeight);
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
          LoggerService.error(
            "Secondary tree selected concept aggregate fetch failed",
            err
          )
        );
      });
    },

    async createTree(
      concept: any,
      parentHierarchy: any,
      children: any,
      parentPosition: number
    ): Promise<void> {
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

      this.root = [];

      if (parentHierarchy.length) {
        if (parentHierarchy.length === 1) {
          this.currentParent = {
              name: parentHierarchy[parentPosition].name,
              iri: parentHierarchy[parentPosition]["@id"],
              listPosition: 0
          };
          this.alternateParents = [];
        } else {
          for (let i = 0; i < parentHierarchy.length; i++) {
            if (i === parentPosition) {
              this.currentParent = {
                name: parentHierarchy[parentPosition].name,
                iri: parentHierarchy[parentPosition]["@id"],
                listPosition: i
              };
            } else {
              this.alternateParents.push({
                name: parentHierarchy[i].name,
                iri: parentHierarchy[i]["@id"],
                listPosition: i
              });
            }
          }
        }
      }

      this.root.push(selectedConcept);
      if (!(selectedConcept.key in this.expandedKeys)) {
        this.expandedKeys[selectedConcept.key] = true;
      }
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

    async onNodeSelect(node: any): Promise<void> {
      this.alternateParents = [];
      await this.getConceptAggregate(node.data);
      this.createTree(
        this.conceptAggregate.concept,
        this.conceptAggregate.parents,
        this.conceptAggregate.children,
        0
      );

      // if (node.label === "Discovery ontology") {
      //   this.$router.push({ name: "Dashboard" });
      // } else {
      //   this.$router.push({
      //     name: "Concept",
      //     params: { selectedIri: node.data }
      //   });
      // }
    },

    async expandChildren(node: TreeNode): Promise<void> {
      node.loading = true;
      if (!(node.key in this.expandedKeys)) {
        this.expandedKeys[node.key] = true;
      }
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

    async expandParents(parentPosition: number): Promise<void> {
      if (!(this.root[0].key in this.expandedKeys)) {
        this.expandedKeys[this.root[0].key] = true;
      }

      let parents: any[] = [];
      let parentNode = {} as TreeNode;
      await ConceptService.getConceptParents(this.root[0].data)
        .then(res => {
          parents = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error(
              "Concept parents server request failed during parent expand stage 1",
              err
            )
          );
        });
      for (let i = 0; i < parents.length; i++) {
        if (i === parentPosition) {
          parentNode = this.createTreeNode(
            parents[i].name,
            parents[i]["@id"],
            parents[i].type,
            parents[i].name,
            true
          );
          parentNode.children.push(this.root[0]);
          if (!(parentNode.key in this.expandedKeys)) {
            this.expandedKeys[parentNode.key] = true;
          }
        }
      }

      this.root = [];
      this.root.push(parentNode);

      // console.log(this.root[0].data)

      await ConceptService.getConceptParents(this.root[0].data)
        .then(res => {
          this.alternateParents = [];
          if (res.data.length) {
            if (
              res.data[0].name === "http://endhealth.info/im#DiscoveryOntology"
            ) {
              this.currentParent = null;
            } else if (res.data.length === 1) {
              this.parentPosition = 0;
              this.currentParent = {
                name: res.data[0].name,
                iri: res.data[0]["@id"],
                listPosition: 0
              };
              this.alternateParents = [];
            } else {
              for (let i = 0; i < res.data.length; i++) {
                if (i === parentPosition) {
                  this.currentParent = {
                    name: res.data[parentPosition].name,
                    iri: res.data[i]["@id"],
                    listPosition: i
                  };
                } else {
                  this.alternateParents.push({
                    name: res.data[i].name,
                    iri: res.data[i]["@id"],
                    listPosition: i
                  });
                }
              }
            }
          } else {
            this.currentParent = null;
            this.alternateParents = [];
          }
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error(
              "Concept parents server request failed during parent expand stage 2",
              err
            )
          );
        });
      this.setTreeHeight();
    },

    selectAltParent(parent: any): void {
      if (this.currentParent) {
        const index = this.alternateParents.indexOf(parent);
        this.alternateParents.splice(index, 1);
        this.alternateParents.push(this.currentParent);
        this.parentPosition = parent.listPosition;
        this.currentParent = parent;
      }
    },

    setTreeHeight(): void {
      const conceptContainer = document.getElementsByClassName(
        "concept-container"
      )[0] as HTMLElement;
      const header = conceptContainer.getElementsByClassName(
        "p-panel-header"
      )[0] as HTMLElement;
      const nav = conceptContainer.getElementsByClassName(
        "p-tabview-nav"
      )[0] as HTMLElement;
      const tree = conceptContainer.getElementsByClassName(
        "p-tree"
      )[0] as HTMLElement;
      const currentFontSize = parseFloat(
        window
          .getComputedStyle(document.documentElement, null)
          .getPropertyValue("font-size")
      );
      const parentBar = document.getElementById(
        "secondary-tree-parents-bar"
      ) as HTMLElement;
      const altParentsContainer = document.getElementById(
        "alternate-parents-container"
      ) as HTMLElement;
      if (
        tree &&
        header &&
        nav &&
        conceptContainer &&
        currentFontSize &&
        parentBar &&
        altParentsContainer
      ) {
        const calcHeight =
          conceptContainer.getBoundingClientRect().height -
          header.getBoundingClientRect().height -
          nav.getBoundingClientRect().height -
          altParentsContainer.getBoundingClientRect().height -
          parentBar.getBoundingClientRect().height -
          6 * currentFontSize -
          7 +
          "px";
        tree.style.maxHeight = calcHeight;
      }
    }
  }
});
</script>

<style scoped>
.tree-root {
  overflow: auto;
}
</style>
