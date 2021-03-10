<template>
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
import { Concept } from "@/models/Concept";
import svgPanZoom from "svg-pan-zoom";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";

@Options({
  components: {},
  props: ["concept", "parents", "children", "mappedFrom", "mappedTo", "usages"],
  watch: {
    concept: {
      handler: function(val, oldVal) {
        this.removeD3();
        this.graphData = this.getGraphData();
        this.root = d3.hierarchy(this.graphData);
        this.initD3();
      }
    }
  }
})
export default class Graph extends Vue {
  concept!: Concept;
  parents!: unknown;
  children!: unknown;
  graphData = this.getGraphData();
  root = d3.hierarchy(this.graphData);
  width = 700;
  height = 600;

  getGraphData() {
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
        }
      ]
    };
  }

  getNodes(leaf: any) {
    if (!leaf) {
      return [];
    }
    const nodes: { name: string; value: string }[] = [];
    try {
      leaf.forEach((element: { name: any; iri: any }) => {
        nodes.push({ name: element.name, value: element.iri });
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
    const nodes: { name: string; iri: string }[] = [];
    this.concept.Property.forEach(property => {
      nodes.push({ name: property.property.name, iri: property.iri });
    });
    return nodes;
  }

  initD3() {
    this.width = +d3.select("svg").attr("width");
    this.height = +d3.select("svg").attr("height");
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const links = this.root.links() as d3.SimulationLinkDatum<any>[];
    const nodes = this.root.descendants();
    const simulation = d3
      .forceSimulation(nodes as any)
      .force("charge", d3.forceManyBody().strength(-750))
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

        const circles = d3
          .select(".nodes")
          .selectAll("circle")
          .data(nodes);

        circles
          .enter()
          .append("circle")
          .attr("r", 5)
          .merge(circles as any)
          .attr("cx", function(d: any) {
            return d.x;
          })
          .attr("cy", function(d: any) {
            return d.y;
          })
          .attr("id", function(d: any) {
            const name = d.data.name;
            return /\s/.test(name) ? name.replace(/\s/g, "") : name;
          });

        circles.exit().remove();

        const textNodes = d3
          .select(".nodes")
          .selectAll("text")
          .data(nodes);

        textNodes
          .enter()
          .append("text")
          .text(function(d: any) {
            return d.data.name;
          })
          .merge(textNodes as any)
          .attr("x", function(d: any) {
            return d.x;
          })
          .attr("y", function(d: any) {
            return d.y * 1.1;
          })
          .attr("dy", function(d) {
            return 5;
          })
          .attr("id", function(d: any) {
            const name = d.data.name;
            return /\s/.test(name) ? name.replace(/\s/g, "") : name;
          })
          .attr("link", function(d: any) {
            return d.iri;
          });

        textNodes.exit().remove();
      });

    d3.select("#content")
      .selectAll("g.nodes")
      .on("mouseover", function(event: any) {
        console.log(that.concept.Property);
        // const currentNode = that.root
        //   .descendants()
        //   .filter(node => node.data.name === event.srcElement.id);
        //   const title = `${currentNode[0]?.data.name}-${currentNode[0]?.data
        //     .children?.length || 0}`;
        //   const id = "#" + event.srcElement.id;
        //   const element = d3.select(id).nodes()[0] as HTMLElement;
        //   if (element && currentNode[0]?.data.name) element.innerHTML = title;
      })
      // .on("mouseout", function(event: any) {
      //   const currentNode = root
      //     .descendants()
      //     .filter(node => node.data.name === event.srcElement.id);
      //   const id = "#" + event.srcElement.id;
      //   const element = d3.select(id).nodes()[0] as HTMLElement;
      //   if (element) element.innerHTML = currentNode[0].data.name as string;
      // })
      .on("click", function(event: any) {
        if (event.srcElement.localName === "circle") {
          that.onCircleClick(event);
        } else {
          that.onTextClick(event);
        }
      });

    svgPanZoom("#svg", {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: false,
      center: true,
      dblClickZoomEnabled: false
    });
  }

  onCircleClick(event: any) {
    const currentNode = this.root
      .descendants()
      .filter((node: any) => node.data.name === event.srcElement.id);
    console.log(currentNode);
    console.log(!!currentNode[0].children);
    if (currentNode[0].children) {
      (currentNode[0] as any)._children = currentNode[0].children;
      currentNode[0].children = undefined;
    } else {
      currentNode[0].children = (currentNode[0] as any)._children;
      (currentNode[0] as any)._children = undefined;
    }
    this.removeD3();
    this.initD3();
  }

  onTextClick(event: any) {
    const currentNode = this.root
      .descendants()
      .filter((node: any) => node.data.name === event.srcElement.innerHTML);
    const iri = (currentNode[0].data as any)?.value;
    const currentRoute = this.$route.name as RouteRecordName | undefined;
    if (iri)
      this.$router.push({
        name: currentRoute,
        params: { selectedIri: iri }
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
circle {
  fill: cadetblue;
}
circle#Properties,
circle#Children,
circle#Parents {
  fill: rgb(161, 174, 219);
  fill-opacity: 1;
  cursor: pointer;
}
text#Properties,
text#Children,
text#Parents {
  fill: black;
  font-size: 11px;
  cursor: default;
}
line {
  stroke: #ccc;
}
text {
  text-anchor: middle;
  font-family: "Helvetica Neue", Helvetica, sans-serif;
  fill: #666;
  font-size: 12px;
  cursor: pointer;
}
</style>
