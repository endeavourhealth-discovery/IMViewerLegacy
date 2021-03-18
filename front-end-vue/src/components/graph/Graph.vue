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
import svgPanZoom from "svg-pan-zoom";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import { mapState } from "vuex";
import ConceptService from "@/services/ConceptService";

@Options({
  components: {},
  computed: mapState(["conceptAggregate"]),
  watch: {
    async conceptAggregate(newValue, oldValue) {
      this.stopSimulation();
      console.log(JSON.stringify(newValue.concept.conceptType));
      this.graphData = (
        await ConceptService.getConceptGraph(newValue.concept.iri)
      ).data;
      console.log(JSON.stringify(this.graphData));
      this.root = d3.hierarchy(this.graphData);
      this.initD3();
      this.simulation.tick();
      this.initSvgPanZoom();
    }
  }
})
export default class Graph extends Vue {
  graphData = {};
  root = d3.hierarchy(this.graphData);
  windowRect = { height: 600, width: 700 };
  simulation: d3.Simulation<
    d3.SimulationNodeDatum,
    undefined
  > = {} as d3.Simulation<d3.SimulationNodeDatum, undefined>;

  stopSimulation() {
    try {
      d3.selectAll("circle").remove();
      d3.selectAll("text").remove();
      d3.selectAll("line").remove();
      this.simulation.stop();
    } catch (error) {
      // console.log("Simulation did not stop");
    }
  }

  initSvgPanZoom() {
    svgPanZoom("#svg", {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: false,
      center: true,
      dblClickZoomEnabled: false
    });
  }

  initD3() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.windowRect = document.getElementById("svg")?.getBoundingClientRect()!;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const links = this.root.links() as d3.SimulationLinkDatum<any>[];
    const nodes = this.root.descendants();
    this.simulation = d3
      .forceSimulation(nodes as any)
      .force("charge", d3.forceManyBody().strength(-750))
      .force("link", d3.forceLink().links(links))
      .force(
        "collision",
        d3
          .forceCollide()
          .radius(60)
          .strength(1)
      )
      .on("tick", () => {
        const circles = d3
          .select(".nodes")
          .selectAll("circle")
          .data(nodes);

        circles
          .enter()
          .append("circle")
          .attr("r", function(d: any) {
            if (d.depth === 0) return 10;
            return 5;
          })
          .merge(circles as any)
          .attr("cx", function(d: any) {
            if (d.depth === 0) {
              d.x = 0;
            }
            if (d.data.name === "Properties") {
              d.x = 0;
            }
            if (d.data.name === "Children") {
              d.x = that.windowRect.width / 4;
            }
            if (d.data.name === "Parents") {
              d.x = that.windowRect.width / -4;
            }
            return d.x;
          })
          .attr("cy", function(d: any) {
            if (d.depth === 0) {
              d.y = 0;
            }
            if (d.data.name === "Properties") {
              d.y = that.windowRect.height / 4;
            }
            if (d.data.name === "Children") {
              d.y = that.windowRect.height / -4;
            }
            if (d.data.name === "Parents") {
              d.y = that.windowRect.height / -4;
            }
            return d.y;
          })
          .attr("id", function(d: any) {
            const name = d.data.name;
            return /\s/.test(name) ? name.replace(/\s/g, "") : name;
          })
          .attr("class", function(d: any) {
            if (d.depth === 0) return "root";
            if (d.data.inheritedFromIri) return "inherited";
            return "";
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
          })
          .attr("stroke-width", 1)
          .attr("stroke", "black")
          .attr("stroke-dasharray", "1,4");

        lines.exit().remove();

        const textNodes = d3
          .select(".nodes")
          .selectAll("text")
          .data(nodes);

        textNodes
          .enter()
          .append("text")
          .text(function(d: any) {
            return d.data.valueTypeName || d.data.name;
          })
          .merge(textNodes as any)
          .attr("x", function(d: any) {
            return d.x;
          })
          .attr("y", function(d: any) {
            return d.y - 20;
          })
          .attr("name", function(d: any) {
            return d.data.valueTypeName || d.data.name;
          })
          .attr("id", function(d: any) {
            return d.data.valueTypeIri || d.data.iri;
          })
          .attr("inheritedFromIri", function(d: any) {
            return d.data.inheritedFromIri;
          })
          .attr("inheritedFromName", function(d: any) {
            return d.data.inheritedFromName;
          })
          .attr("propertyType", function(d: any) {
            return d.data.propertyType;
          });

        textNodes.exit().remove();

        const lineLabels = d3
          .select(".links")
          .selectAll("text")
          .data(links);

        lineLabels
          .enter()
          .append("text")
          .merge(lineLabels as any)
          .attr("class", "labelText")
          .attr("x", function(d: any) {
            return (d.target.x + d.source.x) / 2;
          })
          .attr("y", function(d: any) {
            return (d.target.y + d.source.y) / 2;
          })
          .text(function(d: any) {
            return d.target.data.propertyType;
          });

        lineLabels.exit().remove();
      });

    d3.select("#content")
      .selectAll("g.nodes")
      .on("mouseover", that.onMouseOver)
      .on("mouseout", that.onMouseOut)
      .on("click", function(event: any) {
        if (event.srcElement.localName === "circle") {
          that.onCircleClick(event);
        } else {
          that.onTextClick(event);
        }
      });
  }

  onMouseOver(event: any) {
    console.log(event.srcElement);
    const inheritedFrom =
      event.srcElement.attributes.inheritedFromName?.nodeValue;
    if (inheritedFrom) {
      const title = `${event.srcElement.innerHTML} - Inherited from ${inheritedFrom}`;
      event.srcElement.innerHTML = title;
    }
  }

  onMouseOut(event: any) {
    const originalTitle = event.srcElement.attributes.name?.value;
    if (originalTitle) {
      event.srcElement.innerHTML = originalTitle;
    }
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
    this.stopSimulation();
    this.initD3();
    this.simulation.tick();
    this.initSvgPanZoom();
  }

  onTextClick(event: any) {
    const iri = event.srcElement.attributes.id.nodeValue;
    const currentRoute = this.$route.name as RouteRecordName | undefined;
    if (iri)
      this.$router.push({
        name: currentRoute,
        params: { selectedIri: iri }
      });
  }
}
</script>

<style>
.root {
  fill: rgb(0, 75, 136);
}
.inherited {
  fill: grey;
}
circle {
  fill: cadetblue;
}
circle#Properties,
circle#Children,
circle#Parents {
  fill: rgb(33, 150, 243);
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
