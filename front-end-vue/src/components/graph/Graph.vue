<template>
  {{ !!graphData }}
  <div id="content">
    <svg width="100%" height="600" id="svg">
      <g class="links"></g>
      <g class="nodes"></g>
    </svg>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as d3 from "d3";
import svgPanZoom from "svg-pan-zoom";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import { mapState } from "vuex";
import ConceptService from "@/services/ConceptService";
import { HierarchyNode } from "d3";

@Options({
  components: {},
  computed: mapState(["conceptAggregate"]),
  watch: {
    async conceptAggregate(newValue, oldValue) {
      this.graphData = (
        await ConceptService.getConceptGraph(newValue.concept.iri)
      ).data;
      this.root = d3.hierarchy(this.graphData);
      this.drawTree();
      this.initSvgPanZoom();
    }
  }
})
export default class Graph extends Vue {
  graphData = {};
  root: HierarchyNode<unknown> = {} as HierarchyNode<unknown>;
  tree = {
    name: "father",
    children: [
      {
        name: "son1",
        children: [{ name: "grandson" }, { name: "grandson2" }]
      },
      {
        name: "son2",
        children: [{ name: "grandson3" }, { name: "grandson4" }]
      }
    ]
  };

  initSvgPanZoom() {
    svgPanZoom("#svg", {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: false,
      center: true,
      dblClickZoomEnabled: false
    });
  }

  eraseTree() {
    d3.selectAll("g")
      .selectAll("*")
      .remove();
  }

  drawTree() {
    this.eraseTree();
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };
    const width = 660 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const treemap = d3.tree().size([height, width]);
    let nodes: any = d3.hierarchy(this.graphData, (d: any) => d.children);
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
          d.y +
          "," +
          d.x +
          "C" +
          (d.y + d.parent.y) / 2 +
          "," +
          d.x +
          " " +
          (d.y + d.parent.y) / 2 +
          "," +
          d.parent.x +
          " " +
          d.parent.y +
          "," +
          d.parent.x
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
      .attr("transform", (d: any) => "translate(" + d.y + "," + d.x + ")")
      .attr("cursor", "pointer");

    // add circles to nodes
    node
      .append("circle")
      .attr("r", 5)
      .attr("class", "circle");

    // add text nodes
    node
      .append("text")
      .attr("id", (d: any) => d.data.valueTypeIri)
      .attr("dy", ".35em")
      .attr("x", (d: any) => (d.children ? -10 : 10))
      .attr("y", (d: any) =>
        d.children && d.depth !== 0 ? -(d.data.value + 5) : d
      )
      .style("text-anchor", (d: any) => (d.children ? "end" : "start"))
      .text((d: any) => d.data.valueTypeName || d.data.name);

    // add text property nodes
    node
      .append("text")
      .attr("id", (d: any) => d.data.iri)
      .attr("dy", ".35em")
      .attr("x", (d: any) => -10)
      .attr("y", (d: any) => -(d.data.value + 5))
      .style("text-anchor", (d: any) => "end")
      .text((d: any) =>
        d.parent?.data.name === "Properties" ? d.data.name : ""
      );
  }
}
</script>

<style>
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
</style>
