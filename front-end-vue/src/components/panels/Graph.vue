<template>
  {{ mappedTo }}
  {{ usages }}
  <div title="This is my tooltip">{{ mappedFrom }}</div>
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
import { mapState } from "vuex";
import svgPanZoom from "svg-pan-zoom";

@Options({
  components: {},
  computed: mapState(["conceptAggregate"]),
  watch: {
    async conceptAggregate(newValue, oldValue) {
      this.removeD3();
      this.concept = newValue.concept;
      this.parents = newValue.parents;
      this.children = newValue.children;
      this.mappedFrom = newValue.mappedFrom;
      this.mappedTo = newValue.mappedTo;
      this.usages = newValue.usages;
      this.graphData = this.getGraphData();
      this.initD3();
    }
  }
})
export default class Graph extends Vue {
  concept = {} as Concept;
  parents = {};
  children = {};
  mappedFrom = {};
  mappedTo = {};
  usages = {};

  width = 700;
  height = 400;

  graphData = {
    name: "Data model",
    children: [
      {
        name: "Properties"
      },
      {
        name: "Parents"
      },
      {
        name: "Children"
      },
      {
        name: "Mapped To"
      },
      {
        name: "Mapped From"
      },
      {
        name: "Used In"
      }
    ]
  };

  getGraphData() {
    return {
      // name: `${this.concept.iri} | ${this.concept.name}`,
      name: this.$route.params.selectedIri,
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
          name: "Children"
          // children: this.getNodes(this.children)
        },
        {
          name: "Mapped To"
          // children: this.getNodes(this.mappedTo)
        },
        {
          name: "Mapped From"
          // children: this.getNodes(this.mappedFrom)
        },
        {
          name: "Used In"
          // children: this.getNodes(this.usages)
        }
      ]
    };
  }

  getNodes(leaf: any) {
    if (!leaf) {
      return [];
    }
    const nodes: { name: string }[] = [];
    leaf.forEach((element: { name: any }) => {
      nodes.push({ name: element.name });
    });
    return nodes;
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
        const u = d3
          .select(".links")
          .selectAll("line")
          .data(links);

        u.enter()
          .append("line")
          .merge(u as any)
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

        u.exit().remove();

        const u2 = d3
          .select(".nodes")
          .selectAll("text")
          .data(nodes);

        u2.enter()
          .append("text")
          .text(function(d: any) {
            return d.data.name;
          })
          .merge(u2 as any)
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
            return `${d.data.name}`;
          });

        u2.exit().remove();
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
        if (element) element.innerHTML = title;

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
        if (element) element.innerHTML = currentNode[0].data.name;
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
    svgPanZoom("#svg", {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: false,
      center: true,
      dblClickZoomEnabled: false
    });
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
