<template>
  <div id="content">
    <svg width="700" height="400" id="svg">
      <g class="links"></g>
      <g class="nodes"></g>
    </svg>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as d3 from "d3";
import { Concept } from "@/models/Concept";
import svgPanZoom from "svg-pan-zoom";

@Options({
  components: {},
  props: ["concept", "parents", "children", "mappedFrom", "mappedTo", "usages"],
  watch: {
    concept: {
      handler: function(val, oldVal) {
        this.removeD3();
        this.initD3();
      }
    }
  }
})
export default class Graph extends Vue {
  concept!: Concept;
  parents!: unknown;
  children!: unknown;
  mappedFrom!: unknown;
  mappedTo!: unknown;
  usages!: unknown;

  width = 700;
  height = 400;

  get graphData() {
    return {
      name: this.concept.name,
      children: [
        {
          name: "Properties",
          children: this.getPropertyNodes()
        },
        {
          name: "Parents",
          children: this.getNodes(this.parents)
        },
        {
          name: "Children",
          children: this.getNodes(this.children)
        },
        {
          name: "MappedTo",
          children: this.getNodes(this.mappedTo)
        },
        {
          name: "MappedFrom",
          children: this.getNodes(this.mappedFrom)
        },
        {
          name: "UsedIn",
          children: this.getNodes(this.usages)
        }
      ]
    };
  }

  getNodes(leaf: any) {
    if (!leaf) {
      return [];
    }
    const nodes: { name: string }[] = [];
    try {
      leaf.forEach((element: { name: any }) => {
        nodes.push({ name: element.name });
      });
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return nodes;
    }
  }

  getPropertyNodes() {
    if (!this.concept || !this.concept.Property) {
      return [];
    }
    const nodes: { name: string }[] = [];
    this.concept.Property.forEach(property => {
      nodes.push({ name: property.property.name });
    });
    return nodes;
  }

  initD3() {
    const root = d3.hierarchy(this.graphData);
    const links = root.links() as d3.SimulationLinkDatum<any>[];
    const nodes = root.descendants();
    const simulation = d3
      .forceSimulation(nodes as any)
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(this.width / 8, this.height / 5))
      .force("link", d3.forceLink().links(links))
      .on("tick", () => {
        const lines = d3
          .select(".links")
          .selectAll("line")
          .data(links);

        lines
          .enter()
          .append("line")
          .merge(lines as any)
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

        lines.exit().remove();

        const leafNodes = d3
          .select(".nodes")
          .selectAll("text")
          .data(nodes);

        leafNodes
          .enter()
          .append("text")
          .text(function(d: any) {
            return d.data.name;
          })
          .merge(leafNodes as any)
          .attr("x", function(d: any) {
            return d.x;
          })
          .attr("y", function(d: any) {
            return d.y;
          })
          .attr("dy", function(d) {
            return 5;
          })
          .attr("id", function(d: any) {
            const name = d.data.name;
            return /\s/.test(name) ? name.replace(/\s/g, "") : name;
          });

        leafNodes.exit().remove();
      });

    d3.select("#content")
      .selectAll("g.nodes")
      .on("mouseover", function(event: any) {
        const nameId = event.srcElement.id.startsWith(":")
          ? event.srcElement.id.substring(1)
          : event.srcElement.id;
        const currentNode = root
          .descendants()
          .filter(node => node.data.name === nameId);
        const title = `${currentNode[0]?.data.name}-${currentNode[0]?.data
          .children?.length || 0}`;
        const id = "#" + nameId;
        const element = d3.select(id).nodes()[0] as HTMLElement;
        if (element && currentNode[0]?.data.name) element.innerHTML = title;

        // d3.select(id)
        //   .insert("p")
        //   .text("text");
      })
      .on("mouseout", function(event: any) {
        const nameId = event.srcElement.id.startsWith(":")
          ? event.srcElement.id.substring(1)
          : event.srcElement.id;
        const currentNode = root
          .descendants()
          .filter(node => node.data.name === nameId);
        const id = "#" + nameId;
        const element = d3.select(id).nodes()[0] as HTMLElement;
        if (element) element.innerHTML = currentNode[0].data.name as string;
      });

    svgPanZoom("#svg", {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: false,
      center: true,
      dblClickZoomEnabled: false
    });
  }

  removeD3() {
    d3.select("#content")
      .selectAll("g")
      .selectAll("text")
      .remove();
    d3.select("#content")
      .selectAll("g")
      .selectAll("line")
      .remove();
  }

  mounted() {
    this.initD3();
  }
}
</script>

<style>
div.tooltip {
  position: absolute;
  text-align: center;
  width: 60px;
  height: 28px;
  padding: 2px;
  font: 12px sans-serif;
  background: lightsteelblue;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
}
circle {
  fill: cadetblue;
}
line {
  stroke: #ccc;
}
text {
  text-anchor: middle;
  font-family: "Helvetica Neue", Helvetica, sans-serif;
  fill: #666;
  font-size: 12px;
}
</style>
