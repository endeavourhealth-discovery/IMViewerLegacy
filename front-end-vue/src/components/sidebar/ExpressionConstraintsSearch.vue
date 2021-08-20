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
        <template v-for="nextOption in nextOptions" :key="nextOption">
          <component
            :is="nextOption.component"
            :id="nextOption.type + '-' + queryBuild.length"
            :position="queryBuild.length"
            :value="null"
            @addClicked="addItem"
          ></component>
        </template>
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
import { ECLType } from "@/models/expressionConstraintsLanguage/ECLType";
import { ECLComponent } from "@/models/expressionConstraintsLanguage/ECLComponent";

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
        this.generateNextOptions();
      },
      deep: true
    }
  },
  data() {
    return {
      queryString: "",
      queryBuild: [] as any[],
      nextOptions: [
        {
          component: ECLComponent.CONSTRAINT,
          type: ECLType.CONSTRAINT
        }
      ] as any[]
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
    },

    generateNextOptions() {
      if (!this.queryBuild.length) {
        this.nextOptions = [
          {
            component: ECLComponent.CONSTRAINT,
            type: ECLType.CONSTRAINT
          }
        ];
        return;
      }
      switch (this.queryBuild[this.queryBuild.length - 1].type) {
        case ECLType.CONSTRAINT:
          this.nextOptions = [
            {
              component: ECLComponent.EXPRESSION,
              type: ECLType.EXPRESSION
            }
          ];
          break;
        case ECLType.LOGIC:
          this.nextOptions = [
            {
              component: ECLComponent.CONSTRAINT,
              type: ECLType.CONSTRAINT
            }
          ];
          break;
        case ECLType.EXPRESSION:
          this.nextOptions = [
            {
              component: ECLComponent.REFINEMENT,
              type: ECLType.REFINEMENT
            },
            {
              component: ECLComponent.LOGIC,
              type: ECLType.LOGIC
            }
          ];
          break;
        case ECLType.REFINEMENT:
          this.nextOptions = [
            {
              component: ECLComponent.REFINEMENT,
              type: ECLType.REFINEMENT
            }
          ];
          break;
      }
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
