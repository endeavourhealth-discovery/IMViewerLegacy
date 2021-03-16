<template>
  <template v-for="(cSchema, index) in conceptSchemas" :key="index">
    <component
               :is="cSchema.control"
               :prefix="cSchema.prefix"
               :size="cSchema.size"
               :property="cSchema.property"
               :conceptKey="cSchema.conceptKey"
               :conceptValue="cSchema.conceptValue"
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
