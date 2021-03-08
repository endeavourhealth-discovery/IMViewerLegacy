<template>
  <Graph
    :children="children"
    :concept="concept"
    :mappedFrom="mappedFrom"
    :mappedTo="mappedTo"
    :parents="parents"
    :usages="usages"
  />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Concept } from "@/models/Concept";
import { mapState } from "vuex";
import Graph from "./Graph.vue";

@Options({
  components: { Graph },
  computed: mapState(["conceptAggregate"]),
  watch: {
    async conceptAggregate(newValue, oldValue) {
      this.concept = newValue.concept;
      this.parents = newValue.parents;
      this.children = newValue.children;
      this.mappedFrom = newValue.mappedFrom;
      this.mappedTo = newValue.mappedTo;
      this.usages = newValue.usages;
    }
  }
})
export default class GraphWrapper extends Vue {
  concept = {} as Concept;
  parents = {};
  children = {};
  mappedFrom = {};
  mappedTo = {};
  usages = {};
}
</script>
