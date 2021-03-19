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

  drawTree() {
    const root = d3.hierarchy(this.graphData);
    // const links = root.links() as d3.SimulationLinkDatum<any>[];
    // const nodes = root.descendants();

    const treeLayout = d3.tree();
    treeLayout.size([400, 200]);
    treeLayout(this.root);

    // Nodes
    d3.select("g.nodes")
      .selectAll("circle")
      .data(this.root.descendants())
      .enter()
      .append("circle")
      .classed("node", true)
      .attr("cx", function(d: any) {
        return d.x;
      })
      .attr("cy", function(d: any) {
        return d.y;
      })
      .attr("cursor", "pointer")
      .attr("r", 4);

    // Text
    d3.select("g.nodes")
      .selectAll("text")
      .data(this.root.descendants())
      .enter()
      .append("text")
      .classed("text", true)
      .attr("cx", function(d: any) {
        return d.x;
      })
      .attr("cy", function(d: any) {
        return d.y;
      })
      .attr("text", 4);

    // Links
    d3.select("g.links")
      .selectAll("line")
      .data(this.root.links())
      .enter()
      .append("line")
      .classed("link", true)
      .attr("x1", function(d: any) {
        return d.source.x;
      })
      .attr("y1", function(d: any) {
        return d.source.y;
      })
      .attr("x2", function(d: any) {
        return d.target.x;
      })
      .attr("y2", function(d: any) {
        return d.target.y;
      });
  }

  onCircleClick(event: any) {
    const currentNode = this.root
      .descendants()
      .filter((node: any) => node.data.name === event.srcElement.id);
    if (currentNode[0].children) {
      (currentNode[0] as any)._children = currentNode[0].children;
      currentNode[0].children = undefined;
    }
  }
}
</script>

<style>
.node {
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
