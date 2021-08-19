<template>
  <div id="query-search-container">
    <h3>Expression constraints language search</h3>
    <div id="query-builder-container">
      <div id="query-build">
        <template v-for="item in queryBuild" :key="item.id">
          <component
            :is="item.component"
            :value="item.value"
            :id="item.id"
            :position="item.position"
            @deleteClicked="deleteItem"
            @addClicked="addItem"
            @updateClicked="updateItem"
          >
          </component>
        </template>
      </div>
      <div id="next-option-container">
        <AddLogic
          :id="'logic-' + queryBuild.length"
          :position="queryBuild.length"
          :value="null"
          @addClicked="addItem"
        />
        <AddExpression
          :id="'expression-' + queryBuild.length"
          :position="queryBuild.length"
          @addClicked="addItem"
        />
        <AddConstraint
          :id="'constraint-' + queryBuild.length"
          :position="queryBuild.length"
          @addClicked="addItem"
        />
        <AddRefinement
          :id="'refinement-' + queryBuild.length"
          :position="queryBuild.length"
          @addClicked="addItem"
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
import AddExpression from "@/components/sidebar/expressionConstraintsSearch/addExpression.vue";
import AddConstraint from "@/components/sidebar/expressionConstraintsSearch/addConstraint.vue";
import AddRefinement from "@/components/sidebar/expressionConstraintsSearch/addRefinement.vue";

export default defineComponent({
  name: "ExpressionConstraintsSearch",
  components: {
    AddLogic,
    AddExpression,
    AddConstraint,
    AddRefinement
  },
  watch: {
    queryBuild: {
      handler() {
        this.queryBuild.sort((a: any, b: any) => a.position - b.position);
        this.generateQueryString();
      },
      deep: true
    }
  },
  data() {
    return {
      queryString: "",
      queryBuild: [] as any[]
    };
  },
  methods: {
    addItem(data: any) {
      this.queryBuild.push(data);
    },

    generateQueryString() {
      this.queryString = this.queryBuild.map(item => item.label).join(" ");
    },

    deleteItem(data: any) {
      const index = this.queryBuild.findIndex(
        item => item.position === data.position
      );
      this.queryBuild.splice(index, 1);
    },

    updateItem(data: any) {
      const index = this.queryBuild.findIndex(
        item => item.position === data.position
      );
      this.queryBuild[index] = data;
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
