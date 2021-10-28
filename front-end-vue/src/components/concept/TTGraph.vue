<template>
  <div class="p-d-flex p-flex-row p-jc-center p-ai-center loading -container" v-if="loading">
    <ProgressSpinner />
  </div>
  <div id="graph"></div>
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
    this.drawGraph(this.conceptIri);
  },
  methods: {
    async getEntityBundle(iri: string) {
      const { entity, predicates } = await EntityService.getPartialEntityBundle(iri, []);
      const firstNode = { name: entity[RDFS.LABEL], children: [] } as TTGraphData;
      const basePredicates = [IM.HAS_STATUS, RDFS.SUBCLASS_OF, RDFS.COMMENT, RDF.TYPE, RDFS.LABEL];
      const keys = Object.keys(entity).filter(key => key != "@id" && !basePredicates.includes(key));
      if (isObjectHasKeys(entity)) {
        keys.forEach(key => {
          const secondNode = { name: predicates[key], children: [] } as TTGraphData;
          if (isArrayHasLength(entity[key])) {
            entity[key].forEach((nested: any) => {
              secondNode.children.push({ name: nested.name, children: [] });
            });
          } else if (isObjectHasKeys(entity[key])) {
            secondNode.children.push({ name: entity[key].name, children: [] });
          } else {
            secondNode.children.push({ name: entity[key], children: [] });
          }

          firstNode.children.push(secondNode);
        });
      }
      this.data = firstNode;
    },

    async drawGraph(iri: string) {
      await this.getEntityBundle(iri);
      const root = d3.hierarchy(this.data);
      const links = root.links() as any;
      const nodes = root.descendants() as any;
      const height = 400;
      const width = 600;
      const radius = 25;
      const side = 2 * radius;
      const maxLength = radius / 2;

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

      const svg = d3
        .select("#graph")
        .append("svg")
        .attr("viewBox", ["" + -width / 2, "" + -height / 2, "" + width, "" + height] as any);

      const link = svg
        .append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line");

      const lineTextWrapper = svg
        .selectAll(null)
        .data(links)
        .enter()
        .append("text")
        .attr("x", (d: any) => (d.target.x + d.source.x) / 2)
        .attr("y", (d: any) => (d.target.y + d.source.y) / 2)
        .attr("font-size", () => `${radius / 5}px`)
        .text((d: any) => d.target.data.name);

      const node = svg
        .append("g")
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("fill", (d: any) => (d.children ? null : "#000"))
        .attr("stroke", (d: any) => (d.children ? null : "#fff"))
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
        .attr("y", (d: any) => (d.data.name?.length <= maxLength ? radius - side / 1.5 : radius - side / 1.4))
        .attr("width", side)
        .attr("height", side / 2)
        .attr("color", "red")
        .style("font-size", () => `${radius / 5}px`);

      const nodeText = nodeTextWrapper
        .append("xhtml:p")
        .text((d: any) => d.data.name)
        .attr("style", () => "text-align:center;padding:2px;margin:2px;");

      simulation.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);

        lineTextWrapper.attr("transform", (d: any) => {
          const dx = (d.target.x + d.source.x) / 2;
          const dy = (d.target.y + d.source.y) / 2;
          return `translate(${dx},${dy})`;
        });

        nodeTextWrapper.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        nodeText.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
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
    }
  }
});
</script>

<style scoped>
td,
th {
  border: 1px solid lightgray;
  padding: 0.5rem;
  overflow-wrap: break-word;
  text-align: left;
}

td {
  cursor: pointer;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}

th[scope="col"] {
  background-color: #f8f9fa;
  color: #495057;
}

table {
  border-collapse: collapse;
  border: 2px solid rgb(200, 200, 200);
}

.p-organizationchart {
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
