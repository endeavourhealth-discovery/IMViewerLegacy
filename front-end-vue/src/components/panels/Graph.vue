<template>
  <!-- <p>{{ concept }}</p>
  <p>{{ parents }}</p>
  <p>{{ children }}</p> -->
  <div id="content">
    <svg width="500" height="400">
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

@Options({
  components: {},
  computed: mapState(["conceptAggregate"]),
  watch: {
    async conceptAggregate(newValue, oldValue) {
      this.removeD3();
      this.concept = newValue.concept;
      this.parents = newValue.parents;
      this.children = newValue.children;
      this.graphData = this.getGraphData();
      this.initD3();
    }
  }
})
export default class Graph extends Vue {
  concept = {} as Concept;
  parents = {};
  children = {};

  width = 500;
  height = 400;

  graphData = {
    name: ":Section",
    children: [
      {
        name: "Properties",
        children: [
          {
            name: "A"
          },
          {
            name: "B"
          }
        ]
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
      name: `${this.concept.iri} | ${this.concept.name}`,
      children: [
        {
          name: "Properties",
          children: this.getChildrenProperties()
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
  }

  getChildrenProperties() {
    if (!this.concept) {
      return [];
    }
    const childrenProperties: { name: string }[] = [];
    this.concept.Property.forEach(property => {
      childrenProperties.push({ name: property.property.name });
    });
    return childrenProperties;
  }

  initD3() {
    const root = d3.hierarchy(this.graphData);
    const links = root.links() as d3.SimulationLinkDatum<any>[];
    const nodes = root.descendants();
    const simulation = d3
      .forceSimulation(nodes as any)
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(this.width / 2, this.height / 2))
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
      .on("click", function(event: any) {
        console.log(event.srcElement.id);
        d3.select(event.srcElement.id)
          .insert("p")
          .text("text");
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
