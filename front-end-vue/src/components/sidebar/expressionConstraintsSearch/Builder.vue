<template>
  <Dialog
    :visible="showDialog"
    :modal="true"
    :closable="false"
    :maximizable="true"
    :style="{ width: '80vw', height: '80vh', display: 'flex', flexFlow: 'column nowrap' }"
    id="builder-dialog"
    :contentStyle="{ flexGrow: '100' }"
  >
    <template #header>
      <h3>ECL Builder:</h3>
    </template>
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
    <div id="build-string-container">
      <h3>Output:</h3>
      <pre class="output-string">{{ queryString }}</pre>
    </div>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="p-button-secondary"
        @click="closeBuilderDialog"
      />
      <Button
        label="OK"
        icon="pi pi-check"
        class="p-button-primary"
        @click="submit"
      />
    </template>
  </Dialog>
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
  name: "Builder",
  components: {
    AddLogic,
    AddExpression,
    AddConstraint,
    AddRefinement
  },
  props: { showDialog: Boolean },
  emits: ["ECLSubmitted", "closeDialog"],
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
    submit() {
      this.$emit("ECLSubmitted", this.queryString);
    },

    closeBuilderDialog() {
      this.$emit("closeDialog");
    },

    async addItem(data: any) {
      this.queryBuild.push(data);
      await this.$nextTick();
      const itemToScrollTo = document.getElementById(data.id);
      itemToScrollTo?.scrollIntoView();
    },

    generateQueryString() {
      let primaryRefinementSet = false;
      this.queryString = this.queryBuild
        .map(item => {
          if (item.type === ECLType.REFINEMENT && !primaryRefinementSet) {
            primaryRefinementSet = true;
            return ":\n\t" + item.label;
          } else if (item.type === ECLType.REFINEMENT && primaryRefinementSet) {
            return "\t" + item.label;
          } else if (item.type === ECLType.LOGIC) {
            return item.label + "\n";
          } else {
            return item.label;
          }
        })
        .join(" ")
        .replaceAll("\n ", "\n");
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
          if (
            this.queryBuild[this.queryBuild.length - 2].type ===
            ECLType.REFINEMENT
          ) {
            this.nextOptions = [
              {
                component: ECLComponent.REFINEMENT,
                type: ECLType.REFINEMENT
              }
            ];
          } else {
            this.nextOptions = [
              {
                component: ECLComponent.CONSTRAINT,
                type: ECLType.CONSTRAINT
              },
              {
                component: ECLComponent.EXPRESSION,
                type: ECLType.EXPRESSION
              }
            ];
          }
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
              component: ECLComponent.LOGIC,
              type: ECLType.LOGIC
            }
          ];
          break;
      }
    }
  }
});
</script>

<style scoped>
#query-builder-container {
  width: 100%;
  height: calc(80% - 2rem);
}

#query-build {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  margin: 0 0 1rem 0;
  max-height: calc(100% - 2rem);
  overflow: auto;
}

#query-build ::v-deep(.query-item-container) {
  flex-basis: 100%;
}

#query-build ::v-deep(.refinement-container) {
  flex-basis: 100%;
}

#next-option-container {
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-content: center;
  min-height: 2rem;
}

#build-string-container {
  width: 100%;
  height: 20%;
}

.output-string {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  margin: 0;
  height: calc(100% - 1.75rem - 1.5rem);
}
</style>
