<template>
  {{ !!graphData }}
  <div id="content">
    <!-- <svg width="100%" height="600" id="svg">
      <g class="links"></g>
      <g class="nodes"></g>
    </svg> -->
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
      this.graphData = (
        await ConceptService.getConceptGraph(newValue.concept.iri)
      ).data;
      this.drawTree();
      this.initSvgPanZoom();
    }
  }
})
export default class Graph extends Vue {
  graphData = {};
  svg: any = {};
  duration: any = {};
  margin = { top: 20, right: 90, bottom: 30, left: 90 };
  width = 960 - this.margin.left - this.margin.right;
  height = 500 - this.margin.top - this.margin.bottom;
  root: any = {};
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

  collapse(d: any) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse);
      d.children = null;
    }
  }

  drawTree() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    // Set the dimensions and margins of the diagram

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    this.svg = d3
      .select("#content")
      .append("svg")
      .attr("width", this.width + this.margin.right + this.margin.left)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );

    const i = 0;
    this.duration = 750;

    // declares a tree layout and assigns the size
    const treemap = d3.tree().size([this.height, this.width]);

    // Assigns parent, children, height, depth
    this.root = d3.hierarchy(this.graphData, function(d: any) {
      return d.children;
    });
    this.root.x0 = this.height / 2;
    this.root.y0 = 0;

    // Collapse after the second level
    this.root.children.forEach(this.collapse);

    const treeData = treemap(this.root);

    this.update(this.root);
  }

  update(source: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    // Assigns the x and y position for the nodes
    const root = d3.hierarchy(source);
    // Compute the new tree layout.
    const nodes = root.descendants(),
      links = root.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function(d: any) {
      d.y = d.depth * 180;
    });

    // ****************** Nodes section ***************************

    // Update the nodes...
    const node = this.svg.selectAll("g.node").data(nodes, function(d: any) {
      return d.id;
    });

    // Enter any new modes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d: any) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", this.click);

    // Add Circle for the nodes
    nodeEnter
      .append("circle")
      .attr("class", "node")
      .attr("r", 1e-6)
      .style("fill", function(d: any) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    // Add labels for the nodes
    nodeEnter
      .append("text")
      .attr("dy", ".35em")
      .attr("x", function(d: any) {
        return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function(d: any) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function(d: any) {
        return d.data.name;
      });

    // UPDATE
    const nodeUpdate = nodeEnter.merge(node as any);

    // Transition to the proper position for the node
    nodeUpdate
      .transition()
      .duration(this.duration)
      .attr("transform", function(d: any) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // Update the node attributes and style
    nodeUpdate
      .select("circle.node")
      .attr("r", 10)
      .style("fill", function(d: any) {
        return d._children ? "lightsteelblue" : "#fff";
      })
      .attr("cursor", "pointer");

    // Remove any exiting nodes
    const nodeExit = node
      .exit()
      .transition()
      .duration(this.duration)
      .attr("transform", function(d: any) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select("circle").attr("r", 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select("text").style("fill-opacity", 1e-6);

    // ****************** links section ***************************

    // Update the links...
    const link = this.svg.selectAll("path.link").data(links, function(d: any) {
      return d.id;
    });

    // Enter any new links at the parent's previous position.
    const linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d: any) {
        const o = { x: source.x0, y: source.y0 };
        return that.diagonal(o, o);
      });

    // UPDATE
    const linkUpdate = linkEnter.merge(link as any);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(this.duration)
      .attr("d", function(d: any) {
        return that.diagonal(d, d.parent);
      });

    // Remove any exiting links
    const linkExit = link
      .exit()
      .transition()
      .duration(this.duration)
      .attr("d", function(d: any) {
        const o = { x: source.x, y: source.y };
        return that.diagonal(o, o);
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d: any) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
  }

  diagonal(s: any, d: any) {
    const path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

    return path;
  }

  // Toggle children on click.
  click(d: any) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    // const treemap = d3.tree().size([this.height, this.width]);
    // const treeData = treemap(this.root);
    this.update(d);
  }
}
</script>

<style>
.node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 3px;
}

.node text {
  font: 12px sans-serif;
}

.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}
</style>
