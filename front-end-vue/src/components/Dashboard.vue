<template>
  <div class="p-grid">
    <div class="p-col-6">
      <Card>
        <template #header>
          <font-awesome-icon
            :icon="['fas', 'lightbulb']"
            size="6x"
            style="color:orange; padding:5px"
          />
        </template>
        <template #title> Semantic Ontology </template>
        <template #subtitle> Complete conceptual definitions </template>
        <template #content>
          The semantic ontology is the set of concepts used in all parts of the
          information model, from clinical concepts through to data structure
          concepts.
        </template>
      </Card>
    </div>
    <div class="p-col-6">
      <Card>
        <template #header>
          <font-awesome-icon
            :icon="['fas', 'sitemap']"
            size="6x"
            style="color:limegreen; padding:5px"
          />
        </template>
        <template #title> Data Models </template>
        <template #subtitle> Data model definition </template>
        <template #content>
          The data model is a set of entities, attributes and value sets, all of
          which are defined precisely in the ontology, but the data model, being
          created for a specific business of healthcare is separate to the
          ontology.
        </template>
      </Card>
    </div>
    <div class="p-col-6">
      <Card>
        <template #header>
          <font-awesome-icon
            :icon="['fas', 'tasks']"
            size="6x"
            style="color:brown; padding:5px"
          />
        </template>
        <template #title> Value Sets </template>
        <template #subtitle> Value set and member explorer </template>
        <template #content>
          Business purpose specific collections of concepts from the ontology
          used in the data model or in query and contain concepts as defined in
          the ontology, using the ontology language, including advanced concept
          classes.
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class Dashboard extends Vue {
  msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
