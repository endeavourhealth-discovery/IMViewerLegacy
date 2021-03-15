<template>
  <div class="p-fluid p-formgrid p-grid">
    <TTComponent :schema="schema" :concept="concept"></TTComponent>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import IM from '@/models/IM';
import TTComponent from '@/components/tripletree/TTComponent.vue';

@Options({
  props: ["schema", "concept"]
})
export default class FormGenerator extends Vue {
  concept?:any;

  getLabel() {
    // return this.concept.label;
    // return this.concept["http://www.w3.org/2000/01/rdf-schema#label"];
    return this.concept[IM.label];
  }
}
</script>
