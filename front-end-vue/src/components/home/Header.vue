<template>
  <div id="header-home" class="p-d-flex p-flex-row p-jc-start header-container">
    <div class="p-d-flex p-flex-column p-jc-center header-icon-container">
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
    <div class="p-d-flex p-flex-column p-jc-center text-container">
      <div class="title-text">
        <h3 v-if="$route.name === 'Home' || $route.name === 'Dashboard'">
          Home
        </h3>
        <h3 v-else-if="$route.name === 'Concept'">Concepts</h3>
      </div>
      <div class="body-text">
        <span v-if="$route.name === 'Home' || $route.name === 'Dashboard'">
          Business purpose specific collections of concepts from the ontology
          used in the data model or in query and contain concepts as defined in
          the ontology, using the ontology language, including advanced concept
          classes.
        </span>
        <span v-else-if="$route.name === 'Concept'">
          The semantic ontology is the set of concepts used in all parts of the
          information model, from clinical concepts through to data structure
          concepts.
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { Options, Vue } from "vue-class-component";
import { isValueSet, isRecordModel } from "../../helpers/ConceptTypeMethods";

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
    return isRecordModel(conceptTypeElements);
  }
}
</script>

<style scoped>
.header-container {
  grid-area: header;
  height: 100% !important;
}

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

.text-container {
  width: 100%;
  height: 100%;
}

.icon-header {
  width: 100px;
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
