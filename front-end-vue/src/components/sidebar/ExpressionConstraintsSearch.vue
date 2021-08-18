<template>
  <div id="query-search-container">
    <h3>Expression constraints language search</h3>
    <div id="query-builder-container">
      <div id="query-build">
        <template v-for="item in queryBuild" :key="item.id">
          <component
            :is="item.component"
            :data="item"
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
          :data="null"
          @addClicked="addItem"
        />
        <AddExpression
          :id="'expression-' + queryBuild.length"
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

export default defineComponent({
  name: "QuerySearch",
  components: {
    AddLogic,
    AddExpression
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
      if (data.type === "Logic") {
        this.queryBuild.push({
          type: data.type,
          position: data.position,
          id: data.id,
          data: data.value,
          label: data.value,
          component: "AddLogic"
        });
      }

      if (data.type === "Expression") {
        const buildItem = {
          type: data.type,
          id: data.id,
          position: data.position,
          data: data.value,
          label: data.value.code + " |" + data.value.name + "| ",
          component: "AddExpression"
        };
        this.queryBuild.push(buildItem);
      }
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
      if (data.type === "Logic") {
        this.queryBuild[index] = {
          type: data.type,
          position: data.position,
          id: data.id,
          data: data.value,
          label: data.value,
          component: "AddLogic",
          edit: false
        };
      }
      if (data.type === "Expression") {
        const buildItem = {
          type: data.type,
          id: data.id,
          position: data.position,
          data: data.value,
          label: data.value.code + " |" + data.value.name + "| ",
          component: "AddExpression",
          edit: false
        };
        this.queryBuild[index] = buildItem;
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
