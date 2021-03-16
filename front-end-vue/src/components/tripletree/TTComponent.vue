<template>
  <!-- <template v-for="(field, index) in getKeys(concept)" :key="index">
    <component v-if="concept[field]"
               :is="getFieldType(field)"
               :schema="schema"
               :predicate="field"
               :size="12"
               :label="field"
               :componentValue="concept[field]"
               @update:componentValue="concept[field] = $event">
    </component>
  </template> -->
  <template v-for="(cSchema, index) in conceptSchemas" :key="index">
    <component
               :is="cSchema.control"
               :predicate="cSchema.prefix"
               :size="cSchema.size"
               :label="cSchema.property"
               :componentValue="cSchema.conceptValue"
               >
    </component>
  </template>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import { ConceptDetailsSchema } from '@/models/ConceptDetailsSchema';

@Options({
  name: "TTComponent",
  props: ["concept"]
})
export default class TTComponent extends Vue {
  concept?:any;
  conceptSchemas: Array<ConceptDetailsSchema> = [];

  // getKeys(o: any) {
  //   return Object.keys(o);
  // }

  getFieldType(field: string) {
    if (this.concept[field].constructor == Array)
      return "TTExpressionList";
    else if (this.concept[field].iri)
      return "TTIRIEdit";
    else
      return "TTEdit";
  }

  mounted() {
    this.generateSchema(this.concept);
  }

  generateSchema(conceptObject: object){
    for (const [key, value] of Object.entries(conceptObject)){
      this.conceptSchemas.push(new ConceptDetailsSchema(key, value))
    }
  }
}
</script>

<style scoped>

</style>
