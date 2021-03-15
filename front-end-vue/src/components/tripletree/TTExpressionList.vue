<template>
  <Accordion :activeIndex="0" class="p-col-12">
    <AccordionTab :header="label">
      <div v-for="(item, i) in componentValue" :key="i">
        <Divider v-if="i > 0"/>
        <TTComponent :schema="schema" :concept="item"></TTComponent>
      </div>
    </AccordionTab>
  </Accordion>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({
  props: ["label", "predicate", "componentValue", "schema"]
})
export default class TTExpressionList extends Vue {
}
</script>

<style scoped>

</style>
