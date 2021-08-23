<template>
  <div v-if="value && value.children" class="refinement-container">
    <div class="buttons-container">
      <label for="switch">Group</label>
      <InputSwitch v-model="group" />
      <Button
        icon="fas fa-times"
        class="p-button-rounded p-button-outlined p-button-danger"
        @click="deleteClicked"
      />
    </div>
    <div
      v-if="value.children && value.children.length"
      class="refinement-children-container"
    >
      <template v-for="child in value.children" :key="child.id">
        <component
          :is="child.component"
          :value="child.value"
          :id="child.id"
          :position="child.position"
          @deleteClicked="deleteChild"
          @addClicked="addChild"
          @updateClicked="updateChild"
        >
        </component>
      </template>
    </div>
    <div class="next-refinement-container">
      <template v-for="nextOption in nextOptions" :key="nextOption">
        <component
          :is="nextOption.component"
          :id="nextOption.type + '-' + refinementBuild.length"
          :position="refinementBuild.length"
          :value="null"
          @addClicked="addChild"
        >
        </component>
      </template>
      <!-- <AddLogic
        :id="'logic-' + refinementBuild.length"
        :position="refinementBuild.length"
        :value="null"
        @addClicked="addChild"
      />
      <AddExpression
        :id="'expression-' + refinementBuild.length"
        :position="refinementBuild.length"
        @addClicked="addChild"
      />
      <AddConstraint
        :id="'constraint-' + refinementBuild.length"
        :position="refinementBuild.length"
        @addClicked="addChild"
      />
      <div v-if="value.children && value.children.length">
        <AddRefinement
          :id="'refinement-' + refinementBuild.length"
          :position="refinementBuild.length"
          :value="{ level: value.level }"
          @addClicked="addChild"
        />
      </div> -->
    </div>
  </div>
  <div v-else>
    <Button
      icon="fas fa-plus"
      label="Add refinement"
      class="p-button-rounded p-button-outlined p-button-danger add-refinement-button"
      @click="onConfirm"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import AddLogic from "@/components/sidebar/expressionConstraintsSearch/addLogic.vue";
import AddExpression from "@/components/sidebar/expressionConstraintsSearch/addExpression.vue";
import AddConstraint from "@/components/sidebar/expressionConstraintsSearch/addConstraint.vue";
import AddOperator from "@/components/sidebar/expressionConstraintsSearch/addOperator.vue";
import { ECLType } from "@/models/expressionConstraintsLanguage/ECLType";
import { ECLComponent } from "@/models/expressionConstraintsLanguage/ECLComponent";

export default defineComponent({
  name: "AddRefinement",
  props: {
    id: String,
    position: Number,
    value: {
      type: Object as PropType<{ children: any[], level: number }>,
      required: false
    }
  },
  emits: ["addClicked", "deleteClicked", "updateClicked"],
  components: { AddLogic, AddExpression, AddConstraint, AddOperator },
  watch: {
    refinementBuild: {
      handler() {
        this.refinementBuild.sort((a: any, b: any) => a.position - b.position);
        this.$emit("updateClicked", this.createRefinement());
        this.generateNextOptions();
      },
      deep: true
    },
    group() {
      this.$emit("updateClicked", this.createRefinement());
    }
  },
  mounted() {
    if (this.value && this.value.children && this.value.children.length) {
      this.refinementBuild = [...this.value.children];
    }
  },
  data() {
    return {
      refinementBuild: [] as any[],
      refinementString: "",
      nextOptions: [
        {
          component: ECLComponent.EXPRESSION,
          type: ECLType.EXPRESSION
        }
      ],
      group: false
    };
  },
  methods: {
    onConfirm() {
      this.$emit("addClicked", this.createRefinement());
    },

    deleteClicked() {
      this.$emit("deleteClicked", this.createRefinement());
    },

    addChild(data: any) {
      this.refinementBuild.push(data);
    },

    deleteChild(data: any) {
      const index = this.refinementBuild.findIndex(
        child => child.position === data.position
      );
      this.refinementBuild.splice(index, 1);
    },

    updateChild(data: any) {
      const index = this.refinementBuild.findIndex(
        item => item.position === data.position
      );
      this.refinementBuild[index] = data;
    },

    createRefinement() {
      return {
        id: this.id,
        value: {
          children: this.refinementBuild,
          level: this.value?.level ? this.value?.level + 1 : 1,
          group: this.group
        },
        position: this.position,
        type: ECLType.REFINEMENT,
        label: this.generateRefinementLabel(),
        component: ECLComponent.REFINEMENT,
        edit: false
      }
    },

    generateRefinementLabel(): string {
      let label = "";
      if (this.refinementBuild.length) {
        const labels = this.refinementBuild.map(item => item.label);
        label = labels.join(" ");
      }
      if (this.group) {
        return (label = ": { " + label + " }");
      } else {
        return label = ": " + label;
      }
    },

    generateNextOptions() {
      if (!this.refinementBuild.length) {
        this.nextOptions = [
          {
            component: ECLComponent.EXPRESSION,
            type: ECLType.EXPRESSION
          }
        ];
        return;
      }
      switch (this.refinementBuild[this.refinementBuild.length - 1].type) {
        case ECLType.EXPRESSION:
          if (
            this.refinementBuild.length === 1 ||
            this.refinementBuild.length === 7
          ) {
            this.nextOptions = [
              {
                component: ECLComponent.OPERATOR,
                type: ECLType.OPERATOR
              }
            ];
          } else {
            this.nextOptions = [
              {
                component: ECLComponent.LOGIC,
                type: ECLType.LOGIC
              }
            ];
          }
          break;
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
        case ECLType.REFINEMENT:
          this.nextOptions = [
            {
              component: ECLComponent.REFINEMENT,
              type: ECLType.REFINEMENT
            }
          ];
          break;
        case ECLType.OPERATOR:
          this.nextOptions = [
            {
              component: ECLComponent.CONSTRAINT,
              type: ECLType.CONSTRAINT
            }
          ];
          break;
      }
    }
  }
});
</script>

<style scoped>
.refinement-container {
  border: 1px solid #dee2e6;
}
.add-refinement-button {
  border-style: dashed !important;
}

.buttons-container {
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
}
</style>
