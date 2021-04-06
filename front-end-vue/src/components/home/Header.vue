<template>
  <div class="p-grid">
    <div class="p-col-fixed" style="width:100px">
      <div class="box">
        <font-awesome-icon
          v-if="$route.name == 'Home'"
          :icon="['fas', 'home']"
          size="6x"
          style="color: blue; padding: 5px"
        />
        <!-- <font-awesome-icon
        v-if="$route.name == 'Datamodel'"
        :icon="['fas', 'lightbulb']"
        size="6x"
        style="color: orange; padding: 5px"
      /> -->
        <font-awesome-icon
          v-if="$route.name == 'Concept'"
          :icon="['fas', 'sitemap']"
          size="6x"
          style="color: green; padding: 5px"
        />
        <!-- <font-awesome-icon
        v-if="$route.name == 'Valueset'"
        :icon="['fas', 'tasks']"
        size="6x"
        style="color: red; padding: 5px"
      /> -->
      </div>
    </div>
    <div class="p-col">
      <div class="box">
        <div class="p-col">
          <span v-if="$route.name == 'Home'">Home</span>
          <span v-if="$route.name == 'Concept'">Concepts</span>
        </div>
        <div class="p-col">
          <span v-if="$route.name == 'Home'"
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
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Header",
  components: {}
})
export default class Header extends Vue {}
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
