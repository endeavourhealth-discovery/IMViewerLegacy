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
  props: ["concept", "parents", "children"],
  watch: {
    concept: {
      handler: async function(val, oldVal) {
        this.removeD3();
        // await new Promise(resolve => setTimeout(resolve, 1000));
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
  windowRect = { height: 600, width: 700 };

  getGraphData() {
    const currentConceptName = this.concept.name;
    const properties = this.getPropertyNodes();
    const parents = this.getNodes(this.parents);
    const children = this.getNodes(this.children);
    const graphData: any = { name: currentConceptName, children: [] };
    if (properties.length)
      graphData.children.push({
        name: "Properties",
        children: properties
      });
    if (parents.length)
      graphData.children.push({
        name: "Parents",
        children: parents
      });
    if (children.length)
      graphData.children.push({
        name: "Children",
        children: children
      });
    return graphData;
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
    const nodes: any[] = [];
    this.concept.Property.forEach(property => {
      nodes.push({
        name: property.property.name,
        iri: property.property.iri,
        type: property.valueType.name
      });
    });
    return nodes;
  }

  initD3() {
    this.windowRect = document.getElementById("svg")?.getBoundingClientRect()!;
    this.width = +d3.select("svg").attr("width");
    this.height = +d3.select("svg").attr("height");
    console.log(this.height, this.width);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const links = this.root.links() as d3.SimulationLinkDatum<any>[];
    const nodes = this.root.descendants();
    const simulation = d3
      .forceSimulation(nodes as any)
      // .force("charge", d3.forceManyBody().strength(-100))
      // .force("collision", d3.forceCollide().strength(10).radius(10))
      // .force(
      //   "x",
      //   d3.forceX().x(function(d: any) {
      //     if (d.x <= 0) return d.x * -2;
      //     return d.x * 2;
      //   })
      // )
      // .force(
      //   "y",
      //   d3.forceY().y(function(d: any) {
      //     if (d.y >= 0) return d.y * -2;
      //     return d.y * 2;
      //   })
      // )
      // .force("charge", d3.forceManyBody().distanceMin(300).distanceMax(1000).strength(-70))
      // .force("center1", d3.forceCenter(this.width - 100).strength(200))
      // .force("center2", d3.forceCenter(this.width + 100))
      .on("tick", () => {

        const circles = d3
          .select(".nodes")
          .selectAll("circle")
          .data(nodes);

        circles
          .enter()
          .append("circle")
          .attr("r", function(d: any) {
            return 5;
          })
          .merge(circles as any)
          .attr("cx", function(d: any) {
            if (d.depth === 0) { d.x = 0}
            if (d.data.name === "Properties") { d.x =  0; }
            if (d.data.name === "Children") { d.x =  that.windowRect.width / 4; }
            if (d.data.name === "Parents") { d.x =  that.windowRect.width / -4; }
            return d.x;
          })
          .attr("cy", function(d: any) {
            if (d.depth === 0) { d.y =  0; }
            if (d.data.name === "Properties") { d.y = that.windowRect.height / 4; }
            if (d.data.name === "Children") { d.y = that.windowRect.height / -4; }
            if (d.data.name === "Parents") { d.y = that.windowRect.height / -4; }
            return d.y;
          })
          .attr("id", function(d: any) {
            const name = d.data.name;
            return /\s/.test(name) ? name.replace(/\s/g, "") : name;
          });

        circles.exit().remove();

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

        const textNodes = d3
          .select(".nodes")
          .selectAll("text")
          .data(nodes);

        textNodes
          .enter()
          .append("text")
          .text(function(d: any) {
            if (d.data.type) return d.data.type;
            return d.data.name;
          })
          .merge(textNodes as any)
          .attr("x", function(d: any) {
            return d.x;
          })
          .attr("y", function(d: any) {
            return d.y - 20;
          })
          .attr("id", function(d: any) {
            const name = d.data.name;
            return /\s/.test(name) ? name.replace(/\s/g, "") : name;
          })
          .attr("link", function(d: any) {
            return d.iri;
          });

        textNodes.exit().remove();

        // const lineLabels = d3
        //   .select(".links")
        //   .selectAll("text")
        //   .data(links);

        // lineLabels
        //   .enter()
        //   // .merge(lineLabels as any)
        //   .append("text")
        //   .attr("class", "labelText")
        //   .attr("x", function(d: any) {
        //     if (d.source.data.name === "Properties") return d.target.x;
        //   })
        //   .attr("y", function(d: any) {
        //     if (d.source.data.name === "Properties") return d.target.y;
        //   })
        //   .text(function(d: any) {
        //     if (d.source.data.name === "Properties") {
        //       return d.target.data.name;
        //     }
        //   });

        // lineLabels.exit().remove();
      });

    d3.select("#content")
      .selectAll("g.nodes")
      .on("mouseover", function(event: any) {
        console.log(that.concept.Property);
        // console.log(event);
      })
      .on("mouseout", function(event: any) {
        console.log("mouseout");
      })
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
