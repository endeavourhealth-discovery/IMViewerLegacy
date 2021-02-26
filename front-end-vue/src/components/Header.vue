<template>
  <Card class="header">
    <template #header>
      <font-awesome-icon v-if="$route.name == 'Home'" :icon="['fas', 'home']" size="6x" style="color:blue; padding:5px" />
      <font-awesome-icon v-if="$route.name == 'Datamodel'" :icon="['fas', 'lightbulb']" size="6x" style="color:orange; padding:5px" />
      <font-awesome-icon v-if="$route.name == 'Ontology'" :icon="['fas', 'sitemap']" size="6x" style="color:green; padding:5px" />
      <font-awesome-icon v-if="$route.name == 'Valueset'" :icon="['fas', 'tasks']" size="6x" style="color:red; padding:5px" />
    </template>
    <template #title>
      <span v-if="$route.name == 'Home'">Home</span>
      <span v-if="$route.name == 'Datamodel'">Data Models</span>
      <span v-if="$route.name == 'Ontology'">Semantic Ontology</span>
      <span v-if="$route.name == 'Valueset'">Value Sets</span>
    </template>
    <template #subtitle>
      <span v-if="$route.name == 'Home'">Business purpose specific collections of concepts from the ontology used in the data model or in query and contain concepts as defined in the ontology, using the ontology language, including advanced concept classes</span>
      <span v-if="$route.name == 'Datamodel'">The data model is a set of entities, attributes and value sets, all of which are defined precisely in the ontology, but the data model, being created for a specific business of healthcare is separate to the ontology.</span>
      <span v-if="$route.name == 'Ontology'">The semantic ontology is the set of concepts used in all parts of the information model, from clinical concepts through to data structure concepts.</span>
      <span v-if="$route.name == 'Valueset'">Business purpose specific collections of concepts from the ontology used in the data model or in query and contain concepts as defined in the ontology, using the ontology language, including advanced concept classes.</span>
    </template>
  </Card>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {},
})
export default class Header extends Vue {}
</script>

<style>
.header .p-card-header {
  width: 5%;
  float: left;
}

.header .p-card-content {
  display: contents;
}
</style>
