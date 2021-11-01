<template>
  <div class="p-d-flex p-flex-row p-jc-center p-ai-center loading -container" v-if="loading">
    <ProgressSpinner />
  </div>

  <div id="graph">
    <svg id="svg">
      <defs>
        <marker id="arrow" markerUnits="strokeWidth" markerWidth="12" markerHeight="12" viewBox="0 0 12 12" refX="25" refY="6" orient="auto-start-reverse">
          <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: #781c81;"></path>
        </marker>
      </defs>
    </svg>
  </div>
</template>

<script lang="ts">
import TTGraphData from "../../models/TTGraphData";
import { defineComponent } from "@vue/runtime-core";
import EntityService from "@/services/EntityService";
import { RouteRecordName } from "vue-router";
import { IM } from "@/vocabulary/IM";
import { RDFS } from "@/vocabulary/RDFS";
import { isArrayHasLength, isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import * as d3 from "d3";
import { RDF } from "@/vocabulary/RDF";
import svgPanZoom from "svg-pan-zoom";

export default defineComponent({
  name: "TTGraph",
  props: {
    conceptIri: { type: String, required: true }
  },
  watch: {
    async conceptIri(newValue) {
      await this.drawGraph(newValue);
    }
  },
  data() {
    return {
      loading: false,
      data: {} as TTGraphData
    };
  },
  async mounted() {
    await this.drawGraph(this.conceptIri);
  },
  methods: {
    async getEntityBundle(iri: string) {
      const { entity, predicates } = await EntityService.getPartialEntityBundle(iri, []);
      const firstNode = { name: entity[RDFS.LABEL], relToParent: "", children: [] } as TTGraphData;
      const excludedPredicates = [IM.HAS_STATUS, RDFS.COMMENT, RDF.TYPE, RDFS.LABEL, IM.PROPERTY_GROUP];
      const keys = Object.keys(entity).filter(key => key != "@id" && !excludedPredicates.includes(key));
      this.addNodes(entity, keys, firstNode, predicates);
      this.data = firstNode;
    },

    addNodes(entity: any, keys: string[], firstNode: TTGraphData, predicates: any) {
      if (isObjectHasKeys(entity)) {
        keys.forEach(key => {
          const secondNode = { name: predicates[key], relToParent: "", children: [] } as TTGraphData;

          if (isArrayHasLength(entity[key])) {
            entity[key].forEach((nested: any) => {
              secondNode.children.push({ name: nested.name, relToParent: "", children: [] });
            });
          } else if (isObjectHasKeys(entity[key])) {
            secondNode.children.push({ name: entity[key].name, relToParent: "", children: [] });
          } else {
            secondNode.children.push({ name: entity[key], relToParent: "", children: [] });
          }

          firstNode.children.push(secondNode);
        });
      }
    },

    async drawGraph(iri: string) {
      await this.getEntityBundle(iri);
      const root = d3.hierarchy(this.data);
      const links = root.links() as any;
      const nodes = root.descendants() as any;
      const height = 400;
      const width = 600;
      const radius = 16;

      const side = 2 * radius;
      const maxLength = radius / 2;
      const font = { size: { node: radius / 5, path: radius / 5 + 3 }, colour: "#fff" };
      const colour = {
        activeNode: { fill: "#e3f2fd", stroke: "#AAAAAA" },
        inactiveNode: { fill: "#781c81", stroke: "#AAAAAA" },
        path: { fill: "", stroke: "#AAAAAA" }
      };

      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d: any) => d.id)
            .distance(0)
            .strength(1)
        )
        .force("charge", d3.forceManyBody().strength(-1500))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

      const svg = d3.select("#svg").attr("viewBox", ["" + -width / 2, "" + -height / 2, "" + width, "" + height] as any);

      const pathLink = svg
        .selectAll(null)
        .data(links)
        .enter()
        .append("path")
        .attr("id", (d: any) => `${d.target.x}${d.target.y}${d.source.x}${d.source.y}`)
        .style("fill", colour.path.fill)
        .style("stroke", colour.path.stroke)
        .attr("marker-end", "url(#arrow)");
      // .attr("marker-start", "url(#arrow)");

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
          return d.target.data.name;
        });

      const node = svg
        .append("g")
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("fill", (d: any) => (d.children ? colour.inactiveNode.fill : colour.activeNode.fill))
        .attr("stroke", (d: any) => (d.children ? colour.inactiveNode.stroke : colour.activeNode.stroke))
        .attr("r", radius)
        .call(this.drag(simulation) as any);

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
        .attr("color", font.colour)
        .style("font-size", () => `${font.size.node}px`);

      const nodeText = nodeTextWrapper
        .append("xhtml:p")
        .text((d: any) => d.data.name)
        .attr("style", () => "text-align:center;padding:2px;margin:2px;");

      simulation.on("tick", () => {
        pathLink.attr("d", (d: any) => {
          return d.source.x < d.target.x
            ? `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`
            : `M${d.target.x},${d.target.y} L${d.source.x},${d.source.y}`;
        });

        nodeTextWrapper.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        nodeText.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      });

      svgPanZoom("#svg", {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: false,
        center: true,
        dblClickZoomEnabled: false
      });
    },

    drag(simulation: any) {
      function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    },

    calcAngleDegrees(x: number, y: number) {
      // 𝑎𝑡𝑎𝑛2(𝑦,𝑥) Where: 𝑦=𝑦𝐵−𝑦𝐴 & 𝑥=𝑥𝐵−𝑥𝐴
      return (Math.atan2(y, x) * 180) / Math.PI;
    }
  }
});
</script>

<style scoped>
#svg {
  height: 1000px;
  width: 100%;
}
</style>
