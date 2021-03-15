<template>
  <TreeTable :value="nodes">
    <Column field="predicate" header="Predicate" :expander="true"></Column>
    <Column field="data" header="Data"></Column>
  </TreeTable>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import TreeTable from 'primevue/treetable';

@Options({
  components: {TreeTable },
  props: ["label", "predicate", "componentValue"],
  watch: {
    componentValue: {
      immediate: true,
      handler(n, o) {
        this.buildTreeTableData(n);
      }
    }
  }
})
export default class TTExpression extends Vue {
  nodes? :any[];

  buildTreeTableData(expressionList: any) {
    this.nodes = [];
    for (const expression of expressionList) {
      this.nodes.push({"key": "1", data: {predicate: "Predicate", data: "Hello"}})
    }
  }
}
</script>

<style scoped>

</style>
