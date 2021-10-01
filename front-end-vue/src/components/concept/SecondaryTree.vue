<template>
  <div class="p-d-flex p-flex-column p-jc-start" id="secondary-tree-bar-container">
    <div id="alternate-parents-container" class="p-d-flex p-flex-column p-jc-start p-ai-start">
      <Button
        v-for="altParent in alternateParents"
        :key="altParent['@id']"
        :label="altParent.name"
        :disabled="altParent.name === ''"
        icon="pi pi-chevron-up"
        @click="expandParents(altParent.listPosition)"
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
        <div class="tree-row" @mouseover="showPopup($event, slotProps.node)" @mouseleave="hidePopup($event)">
          <span v-if="!slotProps.node.loading">
            <i :class="'fas fa-fw' + slotProps.node.typeIcon" :style="'color:' + slotProps.node.color" aria-hidden="true" />
          </span>
          <ProgressSpinner v-if="slotProps.node.loading" />
          <span>{{ slotProps.node.label }}</span>
        </div>
      </template>
    </Tree>

    <OverlayPanel ref="altTreeOP" id="secondary_tree_overlay_panel" style="width: 700px" :breakpoints="{ '960px': '75vw' }">
      <div v-if="hoveredResult.name" class="p-d-flex p-flex-row p-jc-start result-overlay" style="width: 100%; gap: 7px;">
        <div class="left-side" style="width: 50%;">
          <p>
            <strong>Name: </strong>
            <span>{{ hoveredResult.name }}</span>
          </p>
          <p>
            <strong>Iri: </strong>
            <span>{{ hoveredResult.iri }}</span>
          </p>
          <p v-if="hoveredResult.code">
            <strong>Code: </strong>
            <span>{{ hoveredResult.code }}</span>
          </p>
        </div>
        <div class="right-side" style="width: 50%;">
          <p v-if="hoveredResult.status">
            <strong>Status: </strong>
            <span>{{ hoveredResult.status.name }}</span>
          </p>
          <p v-if="hoveredResult.scheme">
            <strong>Scheme: </strong>
            <span>{{ hoveredResult.scheme.name }}</span>
          </p>
          <p v-if="hoveredResult.conceptType">
            <strong>Type: </strong>
            <span>{{ getConceptTypes(hoveredResult.conceptType) }}</span>
          </p>
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script lang="ts">
import { getIconFromType, getColourFromType } from "@/helpers/ConceptTypeMethods";
import { TreeNode } from "@/models/TreeNode";
import EntityService from "@/services/EntityService";
import { IM } from "@/vocabulary/IM";
import { RDF } from "@/vocabulary/RDF";
import { RDFS } from "@/vocabulary/RDFS";
import { defineComponent } from "vue";
import { ConceptSummary } from "@/models/search/ConceptSummary";

export default defineComponent({
  name: "SecondaryTree",
  props: ["conceptIri"],
  watch: {
    async conceptIri(newValue) {
      this.selectedKey = {};
      this.alternateParents = [];
      this.expandedKeys = {};
      await this.getConceptAggregate(newValue);
      this.createTree(this.conceptAggregate.concept, this.conceptAggregate.parents, this.conceptAggregate.children, this.parentPosition);
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
      parentPosition: 0,
      hoveredResult: {} as ConceptSummary | any,
      overlayLocation: {} as any
    };
  },
  async mounted() {
    await this.getConceptAggregate(this.conceptIri);
    this.createTree(this.conceptAggregate.concept, this.conceptAggregate.parents, this.conceptAggregate.children, 0);
  },
  beforeUnmount() {
    if (Object.keys(this.overlayLocation).length) {
      this.hidePopup(this.overlayLocation);
    }
  },
  methods: {
    async getConceptAggregate(iri: string): Promise<void> {
      const conceptReturn = await EntityService.getPartialEntity(iri, [RDF.TYPE, RDFS.LABEL]);
      if (conceptReturn) this.conceptAggregate.concept = conceptReturn;

      const parentsReturn = await EntityService.getEntityParents(iri);
      if (parentsReturn) this.conceptAggregate.parents = parentsReturn;

      const childrenReturn = await EntityService.getEntityChildren(iri);
      if (childrenReturn) this.conceptAggregate.children = childrenReturn;
    },

    async createTree(concept: any, parentHierarchy: any, children: any, parentPosition: number): Promise<void> {
      const selectedConcept = this.createTreeNode(concept[RDFS.LABEL], concept[IM.IRI], concept[RDF.TYPE], concept[RDFS.LABEL], concept.hasChildren);
      children.forEach((child: any) => {
        selectedConcept.children.push(this.createTreeNode(child.name, child["@id"], child.type, child.name, child.hasChildren));
      });
      this.root = [];
      this.setParents(parentHierarchy, parentPosition);
      this.root.push(selectedConcept);
      if (!Object.prototype.hasOwnProperty.call(this.expandedKeys, selectedConcept.key)) {
        this.expandedKeys[selectedConcept.key] = true;
      }
      this.selectedKey[selectedConcept.key] = true;
    },

    setParents(parentHierarchy: any, parentPosition: number): void {
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
      } else {
        this.currentParent = null;
        this.alternateParents = [];
      }
    },

    createTreeNode(conceptName: any, conceptIri: any, conceptTypes: any, level: any, hasChildren: boolean): TreeNode {
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

    async expandChildren(node: TreeNode): Promise<void> {
      node.loading = true;
      if (!Object.prototype.hasOwnProperty.call(this.expandedKeys, node.key)) {
        this.expandedKeys[node.key] = true;
      }
      let children: any[] = [];
      const result = await EntityService.getEntityChildren(node.data);
      if (result) {
        children = result;
        children.forEach((child: any) => {
          if (!this.containsChild(node.children, child)) {
            node.children.push(this.createTreeNode(child.name, child["@id"], child.type, child.name, child.hasChildren));
          }
        });
      }
      node.loading = false;
    },

    containsChild(nodeChildren: any[], child: any) {
      if (nodeChildren.some(nodeChild => nodeChild.data === child["@id"])) {
        return true;
      }
      return false;
    },

    async expandParents(parentPosition: number): Promise<void> {
      if (!this.root || !this.root.length) return;
      if (!Object.prototype.hasOwnProperty.call(this.expandedKeys, this.root[0].key)) {
        this.expandedKeys[this.root[0].key] = true;
      }

      let parents: any[] = [];
      const result = await EntityService.getEntityParents(this.root[0].data);
      if (result) {
        parents = result;
        const parentNode = this.createExpandedParentTree(parents, parentPosition);
        this.root = [];
        this.root.push(parentNode);
        await this.setExpandedParentParents();
        // this refreshes the keys so they start open if children and parents were both expanded
        this.expandedKeys = { ...this.expandedKeys };
      }
    },

    createExpandedParentTree(parents: any, parentPosition: number): TreeNode {
      let parentNode = {} as TreeNode;
      for (let i = 0; i < parents.length; i++) {
        if (i === parentPosition) {
          parentNode = this.createTreeNode(parents[i].name, parents[i]["@id"], parents[i].type, parents[i].name, true);
          parentNode.children.push(this.root[0]);
          if (!Object.prototype.hasOwnProperty.call(this.expandedKeys, parentNode.key)) {
            this.expandedKeys[parentNode.key] = true;
          }
        }
      }
      return parentNode;
    },

    async setExpandedParentParents() {
      const result = await EntityService.getEntityParents(this.root[0].data);
      if (result) {
        this.currentParent = null;
        this.alternateParents = [];
        if (result.length) {
          if (result.length === 1) {
            this.parentPosition = 0;
            this.currentParent = {
              name: result[0].name,
              iri: result[0]["@id"],
              listPosition: 0
            };
          } else {
            for (let i = 0; i < result.length; i++) {
              if (i === 0) {
                this.currentParent = {
                  name: result[i].name,
                  iri: result[i]["@id"],
                  listPosition: i
                };
              } else {
                this.alternateParents.push({
                  name: result[i].name,
                  iri: result[i]["@id"],
                  listPosition: i
                });
              }
            }
          }
        } else {
          return;
        }
      }
    },

    async onNodeSelect() {
      await this.$nextTick();
      this.selectedKey = {};
      this.selectedKey[this.conceptAggregate.concept[RDFS.LABEL]] = true;
    },

    async showPopup(event: any, data: any): Promise<void> {
      this.overlayLocation = event;
      const x = this.$refs.altTreeOP as any;
      x.show(event);
      const result = await EntityService.getEntitySummary(data.data);
      if (result) this.hoveredResult = result;
    },

    hidePopup(event: any): void {
      const x = this.$refs.altTreeOP as any;
      x.hide(event);
      this.overlayLocation = {};
    },

    getConceptTypes(types: any): any {
      return types
        .map((type: any) => {
          return type.name;
        })
        .join(", ");
    }
  }
});
</script>

<style scoped>
.tree-root {
  overflow: auto;
  border: 0;
  padding-top: 0;
}

.tree-root ::v-deep(.p-tree-toggler) {
  min-width: 2rem;
}

#secondary-tree-bar-container {
  height: 100%;
  border: 1px solid #dee2e6;
}

.p-progress-spinner {
  width: 1.25em !important;
  height: 1.25em !important;
}

#secondary-tree-bar-container ::v-deep(.p-treenode-selectable) {
  cursor: default !important;
}

.tree-row {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.25rem;
}
</style>
