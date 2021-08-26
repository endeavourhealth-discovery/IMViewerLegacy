<template>
  <div v-if="value && value.children" class="focus-concept-container" :id="id">
    <div class="switch-button-container">
      <div class="buttons-container">
        <Button
          icon="fas fa-times"
          class="p-button-rounded p-button-outlined p-button-danger"
          @click="deleteClicked"
        />
      </div>
    </div>
    <div class="focus-concept-children-next-container">
      <span class="float-text">Focus concept</span>
      <div
        v-if="value.children && value.children.length"
        class="focus-concept-children-container"
      >
        <template v-for="child in value.children" :key="child.id">
          <component
            :is="child.component"
            :value="child.value"
            :id="child.id"
            :position="child.position"
            @updateClicked="updateChild"
          >
          </component>
        </template>
      </div>
      <!-- <div class="next-focus-concept-container">
        <template v-for="nextOption in nextOptions" :key="nextOption">
          <component
            :is="nextOption.component"
            :id="nextOption.type + '-' + focusConceptBuild.length"
            :position="focusConceptBuild.length"
            :value="null"
            @addClicked="addChild"
          >
          </component>
        </template>
      </div> -->
    </div>
  </div>
  <div v-else>
    <Button
      icon="fas fa-plus"
      label="Add focus concept"
      class="p-button-rounded p-button-outlined p-button-danger add-focus-concept-button"
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
  name: "AddFocusConcept",
  props: {
    id: String,
    position: Number,
    value: {
      type: Object as PropType<{
        children: any[];
        level: number;
      }>,
      required: false
    }
  },
  emits: ["addClicked", "deleteClicked", "updateClicked"],
  components: { AddLogic, AddExpression, AddConstraint, AddOperator },
  watch: {
    focusConceptBuild: {
      handler() {
        this.focusConceptBuild.sort((a: any, b: any) => a.position - b.position);
        this.$emit("updateClicked", this.createFocusConcept());
      },
      deep: true
    }
  },
  data() {
    return {
      focusConceptBuild: [
        {
          component: ECLComponent.CONSTRAINT,
          id: this.id + "constraint",
          label: null,
          position: 0,
          type: ECLType.CONSTRAINT,
          value: null
        },
        {
          component: ECLComponent.EXPRESSION,
          edit: false,
          id: this.id + "expression",
          label: null,
          position: 1,
          type: ECLType.EXPRESSION,
          value: null
        }
      ] as any[],
      nextOptions: [
        {
          component: ECLComponent.EXPRESSION,
          type: ECLType.EXPRESSION
        }
      ]
    };
  },
  methods: {
    onConfirm() {
      this.$emit("addClicked", this.createFocusConcept());
    },

    deleteClicked() {
      this.$emit("deleteClicked", this.createFocusConcept());
    },

    async addChild(data: any) {
      this.focusConceptBuild.push(data);
      await this.$nextTick();
      const itemToScrollTo = document.getElementById(data.id);
      itemToScrollTo?.scrollIntoView();
    },

    deleteChild(data: any) {
      const index = this.focusConceptBuild.findIndex(
        child => child.position === data.position
      );
      this.focusConceptBuild.splice(index, 1);
    },

    updateChild(data: any) {
      const index = this.focusConceptBuild.findIndex(
        item => item.position === data.position
      );
      this.focusConceptBuild[index] = data;
    },

    createFocusConcept() {
      return {
        id: this.id,
        value: {
          children: this.focusConceptBuild,
        },
        position: this.position,
        type: ECLType.FOCUS_CONCEPT,
        label: this.generateFocusConceptLabel(),
        component: ECLComponent.FOCUS_CONCEPT,
        edit: false
      };
    },

    generateFocusConceptLabel(): string {
      let label = "";
      if (this.focusConceptBuild.length) {
        const labels = this.focusConceptBuild.map(item => {
          if (item.type === ECLType.LOGIC) {
            return item.label + "\n\t";
          } else {
            return item.label;
          }
        });
        label = labels.join(" ").replaceAll("\n ", "\n");
      }
      return label;
    },
  }
});
</script>

<style scoped>
.focus-concept-container {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

.add-focus-concept-button {
  border-style: dashed !important;
}

.switch-button-container {
  order: 2;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

.switch-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

.focus-concept-children-next-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #dee2e6;
  padding: 1rem;
  margin: 0 1em 0 0;
  position: relative;
}

.focus-concept-children-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
}

.buttons-container {
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
}

.float-text {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.75rem;
  color: #6c757d;
}
</style>
