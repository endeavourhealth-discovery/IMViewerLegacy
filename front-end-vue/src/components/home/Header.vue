<template>
  <div class="p-grid">
    <div class="p-col-fixed" style="width:100px">
      <div class="box">
        <div v-if="$route.name === 'Home' || $route.name === 'Dashboard'">
          <i class="fas fa-home icon-home icon-header" />
        </div>
        <div v-else-if="$store.state.conceptAggregate.concept && isClaz">
          <i class="fas fa-sitemap icon-sitemap icon-header" />
        </div>
        <div v-else-if="$store.state.conceptAggregate.concept && isSet">
          <i class="fas fa-tasks icon-tasks icon-header" />
        </div>
        <div v-else>
          <i class="fas fa-lightbulb icon-lightbulb icon-header" />
        </div>
      </div>
    </div>
    <div class="p-col">
      <div class="box">
        <div class="p-col">
          <span v-if="$route.name === 'Home' || $route.name === 'Dashboard'">
            Home
          </span>
          <span v-else-if="$route.name === 'Concept'">Concepts</span>
        </div>
        <div class="p-col">
          <span v-if="$route.name === 'Home' || $route.name === 'Dashboard'">
            Business purpose specific collections of concepts from the ontology
            used in the data model or in query and contain concepts as defined
            in the ontology, using the ontology language, including advanced
            concept classes.
          </span>
          <span v-else-if="$route.name === 'Concept'">
            The semantic ontology is the set of concepts used in all parts of
            the information model, from clinical concepts through to data
            structure concepts.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { Options, Vue } from "vue-class-component";
import { isValueSet, isClass } from "../../helpers/ConceptTypeMethods";

@Options({
  name: "Header",
  components: {}
})
export default class Header extends Vue {
  get isSet() {
    const conceptTypeElements =
      store.state.conceptAggregate.concept[
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
      ];
    return isValueSet(conceptTypeElements);
  }
  get isClaz() {
    const conceptTypeElements =
      store.state.conceptAggregate.concept[
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
      ];
    return isClass(conceptTypeElements);
  }
}
</script>

<style scoped>
.header .p-card-header {
  width: 5%;
  padding-top: 10px;
  float: left;
}

.header .p-card-content {
  display: contents;
  margin-left: 10px;
}

.header .p-card-title,
.header .p-card-subtitle {
  padding-left: 100px;
}

.icon-header {
  font-size: 6rem;
  padding: 5px;
}

.icon-home {
  color: blue;
}

.icon-sitemap {
  color: green;
}

.icon-tasks {
  color: red;
}

.icon-lightbulb {
  color: orange;
}
</style>
