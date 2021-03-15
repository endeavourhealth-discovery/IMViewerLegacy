<template>
  <template v-for="(field, index) in getKeys(concept)" :key="index">
    <component v-if="concept[field]"
               :is="getFieldType(field)"
               :schema="schema"
               :predicate="field"
               :size="12"
               :label="field"
               :componentValue="concept[field]"
               @update:componentValue="concept[field] = $event">
    </component>
  </template>

</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({
  props: ["schema", "concept"]
})
export default class TTComponent extends Vue {
  concept?:any;

  getKeys(o: any) {
    return Object.keys(o);
  }

  getFieldType(field: string) {
    if (this.concept[field].constructor == Array)
      return "TTExpressionList";
    else if (this.concept[field].iri)
      return "TTIRIEdit";
    else
      return "TTEdit";
  }
}
</script>

<style scoped>

</style>
