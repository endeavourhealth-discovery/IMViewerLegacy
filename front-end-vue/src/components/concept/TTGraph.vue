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
      data: {
        name: "flare",
        children: [
          {
            name: "analytics",
            children: [
              {
                name: "cluster",
                children: [
                  {
                    name: "AgglomerativeCluster",
                    value: 3938
                  },
                  {
                    name: "CommunityStructure",
                    value: 3812
                  },
                  {
                    name: "HierarchicalCluster",
                    value: 6714
                  },
                  {
                    name: "MergeEdge",
                    value: 743
                  }
                ]
              },
              {
                name: "graph",
                children: []
              },
              {
                name: "optimization",
                children: []
              }
            ]
          }
        ]
      }
    };
  },
  async mounted() {
    this.drawGraph(this.conceptIri);
  },
  methods: {
    async getEntityBundle(iri: string) {
      const { entity, predicates } = await EntityService.getPartialEntityBundle(iri, []);
    },
    drawGraph(iri: string) {
      const root = d3.hierarchy(this.data);
      const links = root.links() as any;
      const nodes = root.descendants() as any;
      const height = 400;
      const width = 600;

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
        .force("charge", d3.forceManyBody().strength(-50))
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
        .attr("r", 3.5)
        .call(this.drag(simulation) as any);

      node.append("title").text((d: any) => d.data.name);

      simulation.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);

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
