<template>
  <div class="p-d-flex p-flex-row p-jc-center p-ai-center loading -container" v-if="loading">
    <ProgressSpinner />
  </div>

  <div id="graph">
    <svg id="svg">
      <defs id="defs">
        <!-- <marker id="arrow" markerUnits="strokeWidth" markerWidth="12" markerHeight="12" viewBox="0 0 12 12" refX="25" refY="6" orient="auto-start-reverse">
          <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: #781c81;"></path>
        </marker> -->
      </defs>
    </svg>
  </div>
</template>

<script lang="ts">
import TTGraphData from "../../models/TTGraphData";
import { translateFromEntityBundle, translateFromTTDocument, closeNodeByName, hasNodeChildrenByName } from "../../helpers/GraphTranslator";
import { defineComponent } from "@vue/runtime-core";
import EntityService from "@/services/EntityService";
import * as d3 from "d3";
import svgPanZoom from "svg-pan-zoom";
import { isArrayHasLength } from "@/helpers/DataTypeCheckers";

export default defineComponent({
  name: "TTGraph",
  props: {
    conceptIri: { type: String, required: true }
  },
  watch: {
    async conceptIri(newValue) {
      await this.getEntityBundle(this.conceptIri);
      const root = d3.hierarchy(this.data);
      this.stopSimulation();
      this.drawGraph(root.links(), root.descendants());
    }
  },
  data() {
    return {
      loading: false,
      data: {} as TTGraphData,
      simulation: {} as any,
      svgPan: {} as any
    };
  },
  async mounted() {
    await this.getEntityBundle(this.conceptIri);
    const root = d3.hierarchy(this.data);
    this.drawGraph(root.links(), root.descendants());
  },
  methods: {
    async getEntityBundle(iri: string) {
      const bundle = await EntityService.getPartialEntityBundle(iri, []);
      // this.data = translateFromEntityBundle(bundle);
      this.data = translateFromTTDocument();
    },

    drawGraph(links: any, nodes: any) {
      const height = 400;
      const width = 400;
      const force = -1500;
      const radius = 16;

      const side = 2 * radius;
      const maxLength = radius / 2;
      const font = { size: { node: radius / 5, path: radius / 5 + 3 } };
      const colour = {
        activeNode: { fill: "#e3f2fd", stroke: "#AAAAAA" },
        inactiveNode: { fill: "#781c81", stroke: "#AAAAAA" },
        centerNode: {
          fill: "#e39a36",
          stroke: "#ffffff"
        },
        font: {},
        path: { fill: "", stroke: "#AAAAAA" }
      };

      this.simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d: any) => d.id)
            .distance(0)
            .strength(1)
        )
        .force("charge", d3.forceManyBody().strength(force))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

      const svg = d3.select("#svg").attr("viewBox", ["" + -width / 2, "" + -height / 2, "" + width, "" + height] as any);

      // const markers = d3
      //   .select("#defs")
      //   .selectAll()
      //   .data(links)
      //   .enter()
      //   .append("marker")
      //   .attr("id", (d: any) => `${d.target.x}${d.target.y}${d.source.x}${d.source.y}`)
      //   .attr("markerUnits", "strokeWidth")
      //   .attr("markerWidth", "12")
      //   .attr("markerHeight", "12")
      //   .attr("viewBox", "0 0 12 12")
      //   .attr("refX", "25")
      //   .attr("refY", "6")
      //   .attr("orient", (d: any) => this.calcAngleDegrees(d.target.x, d.target.y));

      // const markerPaths = markers
      //   .append("path")
      //   .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
      //   .style("fill", "#781c81");

      const pathLink = svg
        .selectAll(null)
        .data(links)
        .enter()
        .append("path")
        .attr("id", (d: any) => `${d.target.x}${d.target.y}${d.source.x}${d.source.y}`)
        .style("fill", colour.path.fill)
        .style("stroke", colour.path.stroke)
        .attr("marker-end", (d: any) => `url(#${d.target.x}${d.target.y}${d.source.x}${d.source.y})`);

      svg
        .selectAll(null)
        .data(links)
        .enter()
        .append("text")
        .append("textPath")
        .attr("xlink:href", (d: any) => `#${d.target.x}${d.target.y}${d.source.x}${d.source.y}`)
        .style("text-anchor", "middle")
        .attr("startOffset", "50%")
        .attr("font-size", () => `${font.size.path}px`)
        .text((d: any) => {
          return d.target.data.relToParent;
        });

      const node = svg
        .append("g")
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("fill", (d: any) => {
          if (d.depth === 0) return colour.centerNode.fill;
          return hasNodeChildrenByName(this.data, d.data.name) ? colour.inactiveNode.fill : colour.activeNode.fill;
        })
        .attr("stroke", (d: any) => (hasNodeChildrenByName(this.data, d.data.name) ? colour.inactiveNode.stroke : colour.activeNode.stroke))
        .attr("r", (d: any) => radius)
        .call(this.drag(this.simulation) as any);

      const nodeTextWrapper = svg
        .append("g")
        .attr("class", "labels")
        .selectAll("title")
        .data(nodes)
        .enter()
        .append("foreignObject")
        .attr("x", () => radius - side)
        .attr("y", (d: any) => {
          const quotient = Math.round(d.data.name?.length / maxLength) || 0;
          if (quotient <= 1) {
            return radius - side / 1.5;
          }
          return radius - side / (1.5 - +("0." + (quotient - 1)));
        })
        .attr("width", side)
        .attr("height", side)
        .attr("color", (d: any) => (hasNodeChildrenByName(this.data, d.data.name) ? colour.activeNode.fill : colour.inactiveNode.fill))
        .style("font-size", () => `${font.size.node}px`)
        .on("dblclick", (d: any) => this.dblclick(d));

      const nodeText = nodeTextWrapper
        .append("xhtml:p")
        .text((d: any) => d.data.name)
        .attr("style", () => "text-align:center;padding:2px;margin:2px;");

      this.simulation.on("tick", () => {
        pathLink.attr("d", (d: any) => {
          return d?.source.x < d.target.x
            ? `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`
            : `M${d.target.x},${d.target.y} L${d.source.x},${d.source.y}`;
        });

        // markers.attr("orient", (d: any) => this.calcAngleDegrees(d.target.x, d.target.y));

        // markerPaths.attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2");

        nodeTextWrapper.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        nodeText.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      });

      this.svgPan = svgPanZoom("#svg", {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: false,
        center: true,
        dblClickZoomEnabled: false
      });
    },

    dblclick(d: any) {
      const node = d.path[0]["__data__"]["data"] as TTGraphData;
      if (isArrayHasLength(node.children) || isArrayHasLength(node._children)) {
        closeNodeByName(this.data, node.name);
        this.stopSimulation();
        const root = d3.hierarchy(this.data);
        this.drawGraph(root.links(), root.descendants());
      }
    },

    drag(simulation: any) {
      function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        // d.fx = d.x;
        // d.fy = d.y;
      }

      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        // d.fx = null;
        // d.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    },

    stopSimulation() {
      this.svgPan.destroy();
      d3.selectAll("g").remove();
      this.simulation.stop();
    },

    calcAngleDegrees(x: number, y: number) {
      // 𝑎𝑡𝑎𝑛2(𝑦,𝑥) Where: 𝑦=𝑦𝐵−𝑦𝐴 & 𝑥=𝑥𝐵−𝑥𝐴
      return (Math.atan2(y, x) * 180) / Math.PI;
    }
  }
});
</script>

<style>
#svg {
  height: 1000px;
  width: 100%;
}

circle:hover {
  stroke: steelblue;
  stroke-width: 3px;
}
foreignObject:hover {
  font-weight: 600;
}
</style>
