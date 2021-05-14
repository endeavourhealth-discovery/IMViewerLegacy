<template>
  <div id="content">
    <svg width="100%" height="600" id="svg">
      <g class="links"></g>
      <g class="nodes"></g>
    </svg>
    <div id="controls" class="p-d-flex p-flex-column p-jc-center p-ai-center">
      <Button
        class="p-button-info p-button-rounded p-button-outlined zoom-button"
        icon="pi pi-plus"
        @click="zoomIn"
      />
      <Button
        class="p-button-info p-button-rounded p-button-outlined zoom-button"
        label="Reset"
        @click="zoomReset"
      />
      <Button
        class="p-button-info p-button-rounded p-button-outlined zoom-button"
        icon="pi pi-minus"
        @click="zoomOut"
      />
    </div>
  </div>
</template>

<script lang="ts">
import * as d3 from "d3";
import svgPanZoom from "svg-pan-zoom";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import { HierarchyNode } from "d3";
import GraphData from "../../models/GraphData";
import { defineComponent } from "@vue/runtime-core";
import ConceptService from "@/services/ConceptService";

export default defineComponent({
  name: "Graph",
  components: {},
  props: {
    conceptIri: String
  },
  computed: {
    root(): HierarchyNode<unknown> {
      return d3.hierarchy(this.graph);
    }
  },
  watch: {
    async conceptIri(newValue) {
      await this.getGraph(newValue);
      this.initView();
      this.initSvgPanZoom();
    }
  },
  data() {
    return {
      graph: {} as GraphData,
      margin: {} as any,
      width: 660,
      height: 500,
      panZoom: {} as SvgPanZoom.Instance,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth
    };
  },
  async mounted() {
    await this.getGraph(this.conceptIri!);
    this.initView();
    this.initSvgPanZoom();

    this.margin = { top: 20, right: 90, bottom: 30, left: 90 };
    this.width = 660 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

    window.addEventListener("resize", this.onResize);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
    this.eraseTree();
  },

  methods: {
    async getGraph(iri: string) {
      this.graph = (await ConceptService.getConceptGraph(iri)).data;
    },

    onResize() {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
      this.initSvgPanZoom();
      this.zoomReset();
      this.initView();
    },

    zoomIn() {
      this.panZoom.zoomIn();
    },

    zoomReset() {
      this.panZoom.resetZoom();
      this.panZoom.resetPan();
    },

    zoomOut() {
      this.panZoom.zoomOut();
    },

    initSvgPanZoom() {
      // this.panZoom?.destroy();
      this.panZoom = svgPanZoom("#svg", {
        zoomEnabled: true,
        fit: false,
        center: true,
        dblClickZoomEnabled: false,
        mouseWheelZoomEnabled: false
      });
    },

    eraseTree() {
      d3.selectAll("g")
        .selectAll("*")
        .remove();
    },

    drawTree() {
      this.eraseTree();

      const treemap = d3.tree().size([this.height, this.width]);
      let nodes: any = d3.hierarchy(this.graph, (d: any) => d.children);
      const isBig = this.graph.children.some((child: GraphData) => {
        return child.children?.length > 50;
      });
      nodes = treemap(nodes);
      const g = d3.selectAll("g");

      // add the links between the nodes
      const link = g
        .selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", (d: any) => {
          return (
            "M" +
            (d.depth > 2 ? 1.5 * d.y : d.y) +
            "," +
            (isBig ? 6 * d.x : d.x) +
            "C" +
            (d.depth > 2 ? (d.y + d.parent.y) / 1.5 : (d.y + d.parent.y) / 2) +
            "," +
            (isBig ? 6 * d.x : d.x) +
            " " +
            (d.depth > 2 ? (d.y + d.parent.y) / 1.5 : (d.y + d.parent.y) / 2) +
            "," +
            (isBig ? 6 * d.parent.x : d.parent.x) +
            " " +
            (d.parent.depth > 2 ? 1.5 * d.parent.y : d.parent.y) +
            "," +
            (isBig ? 6 * d.parent.x : d.parent.x)
          );
        });

      // add nodes
      const node: any = g
        .selectAll(".node")
        .data(nodes.descendants())
        .enter()
        .append("g")
        .attr(
          "class",
          (d: any) => "node" + (d.children ? " node--internal" : " node--leaf")
        )
        .attr(
          "transform",
          (d: any) =>
            "translate(" +
            (d.depth > 2 ? 1.5 * d.y : d.y) +
            "," +
            (isBig ? 6 * d.x : d.x) +
            ")"
        )
        .attr("cursor", "pointer");

      // add circles to nodes
      node
        .append("circle")
        .attr("r", 8)
        .attr(
          "id",
          (d: any) => d.data.valueTypeIri || d.data.iri || d.data.name
        )
        .attr("class", (d: any) =>
          d.depth === 0 || this.getNumberOfChildren(d.data) ? "circle" : "empty"
        );

      // add text nodes
      node
        .append("text")
        .attr("id", (d: any) => d.data.valueTypeIri || d.data.iri)
        .attr("dy", ".35em")
        .attr("x", (d: any) => (d.children ? -15 : 15))
        .attr("y", (d: any) => {
          d.children && d.depth !== 0 ? 0 : d;
        })
        .attr("name", (d: any) => d.data.valueTypeName || d.data.name)
        .attr("inheritedFrom", (d: any) => d.data.inheritedFromName)
        .attr("inheritedFrom", (d: any) => d.data.inheritedFromName)
        .style("text-anchor", (d: any) => (d.children ? "end" : "start"))
        .text(
          (d: any) =>
            d.data.valueTypeName ||
            `${d.data.name} ${this.getNumberOfChildren(d.data)}`
        );

      // add text property nodes
      node
        .append("text")
        .attr("id", (d: any) => d.data.iri)
        .attr("dy", ".35em")
        .attr("x", () => -15)
        .attr("y", () => 0)
        .style("text-anchor", () => "end")
        .text((d: any) =>
          d.parent?.data.name === "Direct" ||
          d.parent?.data.name === "Inherited" ||
          d.parent?.data.name === "Roles"
            ? d.data.name
            : ""
        );

      // set event listeners
      d3.select("#content")
        .selectAll("circle")
        .on("click", this.onCircleClick);

      d3.select("#content")
        .selectAll("text")
        .on("mouseover", this.onMouseOver)
        .on("mouseout", this.onMouseOut)
        .on("click", this.onTextClick);
    },

    getNumberOfChildren(data: any) {
      if (data.name === "Properties") {
        let num = 0;
        if (data.children?.length) {
          data.children?.forEach((child: any) => {
            num += child.children?.length || child._children?.length;
          });
        }
        if (data._children?.length) {
          data._children?.forEach((child: any) => {
            num += child.children?.length || child._children?.length;
          });
        }
        return num ? `[${num}]` : "";
      }
      if (
        data.name === "Parents" ||
        data.name === "Children" ||
        data.name === "Roles" ||
        data.name === "Direct" ||
        data.name === "Inherited"
      ) {
        if (data._children?.length) return `[${data._children.length}]`;
        if (data.children?.length) return `[${data.children.length}]`;
      }

      return "";
    },

    onMouseOver(event: any) {
      const inheritedFrom =
        event.srcElement.attributes.inheritedFrom?.nodeValue;
      if (inheritedFrom) {
        const title = `${event.srcElement.innerHTML} - Inherited from ${inheritedFrom}`;
        event.srcElement.innerHTML = title;
      }
    },

    onMouseOut(event: any) {
      const inheritedFrom =
        event.srcElement.attributes.inheritedFrom?.nodeValue;
      if (inheritedFrom) {
        const originalTitle = event.srcElement.attributes.name?.nodeValue;
        if (originalTitle) {
          event.srcElement.innerHTML = originalTitle;
        }
      }
    },

    initView() {
      try {
        this.onCircleClick({ srcElement: { id: "Parents" } });
        this.onCircleClick({ srcElement: { id: "Children" } });
      } catch (error) {
        //
      }
    },

    onCircleClick(event: any) {
      if (
        event.srcElement.id === "Parents" ||
        event.srcElement.id === "Children" ||
        event.srcElement.id === "Properties" ||
        event.srcElement.id === "Roles"
      ) {
        const currentParent = this.graph.children.filter(
          (child: any) => child.name === event.srcElement.id
        );
        if (currentParent[0].children && currentParent[0].children.length) {
          (currentParent[0] as any)._children = currentParent[0].children;
          currentParent[0].children = [];
        } else {
          currentParent[0].children = (currentParent[0] as any)._children;
          (currentParent[0] as any)._children = [];
        }

        this.drawTree();
      } else if (
        event.srcElement.id === "Direct" ||
        event.srcElement.id === "Inherited"
      ) {
        const currentGrandParent = this.graph.children.filter(
          (child: any) => child.name === "Properties"
        );
        const currentParent = currentGrandParent[0].children.filter(
          (child: any) => child.name === event.srcElement.id
        );
        if (currentParent[0].children && currentParent[0].children.length) {
          (currentParent[0] as any)._children = currentParent[0].children;
          currentParent[0].children = [];
        } else {
          currentParent[0].children = (currentParent[0] as any)._children;
          (currentParent[0] as any)._children = [];
        }

        this.drawTree();
      }
    },

    onTextClick(event: any) {
      const currentRoute = this.$route.name as RouteRecordName | undefined;
      if (event.srcElement.id)
        this.$router.push({
          name: currentRoute,
          params: { selectedIri: event.srcElement.id }
        });
    }
  }
});
</script>

<style>
#svg {
  cursor: move;
  cursor: grab;
}

#svg:active {
  cursor: grabbing;
}

.empty {
  fill: #fff;
  stroke: rgb(92, 95, 97);
  stroke-width: 3px;
}

.circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 3px;
}

.text {
  font: 12px sans-serif;
}

.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}

#content {
  position: relative;
}

#controls {
  position: absolute;
  top: 50px;
  left: 50px;
  width: fit-content;
}

.zoom-button {
  width: fit-content;
}
</style>
