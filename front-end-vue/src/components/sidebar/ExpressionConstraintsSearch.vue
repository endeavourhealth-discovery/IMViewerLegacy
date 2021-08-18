<template>
  <div id="query-search-container">
    <h3>Expression constraints language search</h3>
    <div id="query-builder-container">
      <div id="query-build">
        <template v-for="(item) in queryBuild" :key="item.id">
          <component
            :is="item.type"
            :data="item.data"
            :id="item.id"
          >
          </component>
        </template>
      </div>
      <div id="next-option-container">
        <AddLogic
          id="logic-1"
          :position="2"
          @addLogicClicked="addLogic"
        />
        <AddExpression
          id="expression-1"
          :position="1"
          @addExpressionClicked="addExpression"
        />
      </div>
    </div>
    <div id="query-string-container">
      {{ queryString }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AddLogic from "@/components/sidebar/expressionConstraintsSearch/addLogic.vue";
import Logic from "@/components/sidebar/expressionConstraintsSearch/Logic.vue";
import AddExpression from "@/components/sidebar/expressionConstraintsSearch/addExpression.vue";

export default defineComponent({
  name: "QuerySearch",
  components: {
    AddLogic,
    Logic,
    AddExpression
  },
  data() {
    return {
      queryString: "",
      queryStringArray: [] as string[],
      queryBuild: [] as any[]
    };
  },
  methods: {
    addLogic(data: any) {
      this.queryBuild.push({ type: "Logic", id: data.id, data: data.value });
      this.queryString += data.value;
    },

    buildStringFromArray() {
      console.log("string builder");
    },

    buildQueryFromArray() {
      console.log("query builder");
    },

    addExpression(data: any) {
      this.queryStringArray.splice(data.position, 0, data.selectedResult.code + " |" + data.selectedResult.name);
      console.log("add expression");
    }
  }
});
</script>

<style scoped>
#query-search-container {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
}

#query-builder-container {
  flex-grow: 100;
}
</style>
