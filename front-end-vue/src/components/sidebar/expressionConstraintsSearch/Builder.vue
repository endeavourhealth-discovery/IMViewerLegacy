<template>
  <Dialog
    :visible="showDialog"
    :modal="true"
    :closable="false"
    :maximizable="true"
    :style="{ width: '80vw' }"
    id="builder-dialog"
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
    <div id="query-string-container">
      <pre>{{ queryString }}</pre>
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
        class="p-button-success"
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

    addItem(data: any) {
      this.queryBuild.push(data);
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
          this.nextOptions = [
            {
              component: ECLComponent.CONSTRAINT,
              type: ECLType.CONSTRAINT
            },
            {
              component: ECLComponent.REFINEMENT,
              type: ECLType.REFINEMENT
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
  height: 70vh;
  flex-grow: 100;
  overflow: auto;
}

#query-build {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  margin: 0 0 1rem 0;
}

#next-option-container {
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-content: center;
}

#build-string-container {
  width: 100%;
  overflow: auto;
}

#builder-dialog ::v-deep(.p-dialog-content) {
  flex-grow: 100;
  background-color: hotpink;
}
</style>
