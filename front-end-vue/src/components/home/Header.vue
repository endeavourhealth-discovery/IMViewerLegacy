<template>
  <div class="p-grid">
    <div class="p-col-fixed" style="width:100px">
      <div class="box">
        <div v-if="$route.name == 'Home' || 'Dashboard'">
          <i
            class="fas fa-home"
            style="fontSize: 6rem; color: blue; padding: 5px;"
          />
        </div>
        <div v-else-if="$store.state.conceptAggregate.concept && isClaz">
          <i
            class="fas fa-sitemap"
            style="fontSize: 6rem; color: green; padding: 5px;"
          />
        </div>
        <div v-else-if="$store.state.conceptAggregate.concept && isSet">
          <i
            class="fas fa-tasks"
            style="fontSize: 6rem; color: red; padding: 5px;"
          />
        </div>
        <div v-else>
          <i
            class="fas fa-lightbulb"
            style="fontSize: 6rem; color: orange; padding: 5px;"
          />
        </div>
      </div>
    </div>
    <div class="p-col">
      <div class="box">
        <div class="p-col">
          <span v-if="$route.name == 'Home' || 'Dashboard'">Home</span>
          <span v-if="$route.name == 'Concept'">Concepts</span>
        </div>
        <div class="p-col">
          <span v-if="$route.name == 'Home' || 'Dashboard'"
            >Business purpose specific collections of concepts from the ontology
            used in the data model or in query and contain concepts as defined
            in the ontology, using the ontology language, including advanced
            concept classes.
          </span>
          <span v-if="$route.name == 'Concept'"
            >The semantic ontology is the set of concepts used in all parts of
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

<style>
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
</style>
