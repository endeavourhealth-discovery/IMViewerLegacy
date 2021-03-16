<template>
  <Accordion :activeIndex="0" class="p-col-12">
    <AccordionTab :header="property">
      <div v-for="(item, i) in conceptValue" :key="i">
        <Divider v-if="i > 0"/>
        <TTComponent :concept="item"></TTComponent>
      </div>
    </AccordionTab>
  </Accordion>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import { ConceptDetailsSchema } from '@/models/ConceptDetailsSchema';

@Options({
  name: "TTExpressionList",
  props: ["prefix", "property", "conceptValue"]
})
export default class TTExpressionList extends Vue {
  conceptValue: any;
  conceptSchema: Array<ConceptDetailsSchema> = [];

  mounted() {
    this.generateSchema(this.conceptValue);
  }

  generateSchema(conceptObject: object){
    for (const [key, value] of Object.entries(conceptObject)){
      this.conceptSchema.push(new ConceptDetailsSchema(key, value))
    }
  }
}
</script>

<style scoped>

</style>
