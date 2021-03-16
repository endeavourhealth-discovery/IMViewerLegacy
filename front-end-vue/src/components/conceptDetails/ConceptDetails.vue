<template>
  <Card>
    <template #header>
      <Button icon="pi pi-check" label="Save" class="p-button" style="width: fit-content; margin: 14px 0 14px 14px;"/>
      <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" style="width: fit-content; margin: 14px;"/>
    </template>
    <template #title>
      Concept details
    </template>
    <template #content v-if="concept && schema">
      <FormGenerator :schema="schema" :concept="concept"/>
    </template>
    <template #footer>
      <Button icon="pi pi-check" label="Save" class="p-button" style="width: fit-content;"/>
      <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" style="width: fit-content; margin-left: 14px;"/>
    </template>
  </Card>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import FormGenerator from '../tripletree/FormGenerator.vue';
import ConceptService from '@/services/ConceptService';

@Options({
  name: "conceptDetails",
  components: {
    FormGenerator
  }
})

export default class ConceptDetails extends Vue {
  concept = null
  schema = null

  async beforeMount(){
    this.schema = (await ConceptService.getTTFormSchema()).data;
    this.concept = (await ConceptService.getTTConcept(":25451000252115")).data;
  }
}
</script>

<style>

</style>
