<template>
  <div class="focus-concept-container" :id="id">
    <div class="switch-button-container">
      <div class="buttons-container">
        <Button
          icon="fas fa-minus"
          class="p-button-rounded p-button-outlined p-button-danger"
          @click="deleteClicked"
        />
        <Button
          icon="fas fa-plus"
          class="p-button-rounded p-button-outlined p-button-success"
          @click="addNextClicked"
        />
      </div>
    </div>
    <div class="focus-concept-children-next-container">
      <span class="float-text">Focus concept</span>
      <div
        v-if="focusConceptBuild && focusConceptBuild.length"
        class="focus-concept-children-container"
      >
        <template v-for="child in focusConceptBuild" :key="child.id">
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Logic from "@/components/sidebar/expressionConstraintsSearch/Logic.vue";
import Expression from "@/components/sidebar/expressionConstraintsSearch/Expression.vue";
import Constraint from "@/components/sidebar/expressionConstraintsSearch/Constraint.vue";
import Operator from "@/components/sidebar/expressionConstraintsSearch/Operator.vue";
import { ECLType } from "@/models/expressionConstraintsLanguage/ECLType";
import { ECLComponent } from "@/models/expressionConstraintsLanguage/ECLComponent";

export default defineComponent({
  name: "FocusConcept",
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
  emits: ["addNextOptionsClicked", "deleteClicked", "updateClicked"],
  components: { Logic, Expression, Constraint, Operator },
  watch: {
    focusConceptBuild: {
      handler() {
        this.focusConceptBuild.sort(
          (a: any, b: any) => a.position - b.position
        );
        this.$emit("updateClicked", this.createFocusConcept());
      },
      deep: true
    }
  },
  mounted() {
    this.setStartBuild();
  },
  data() {
    return {
      focusConceptBuild: [] as any[],
      nextOptions: [
        {
          component: ECLComponent.EXPRESSION,
          type: ECLType.EXPRESSION
        }
      ]
    };
  },
  methods: {
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

    addNextClicked() {
      this.$emit("addNextOptionsClicked", { previousComponent: ECLType.FOCUS_CONCEPT, previousPosition: this.position });
    },

    createFocusConcept() {
      return {
        id: this.id,
        value: {
          children: this.focusConceptBuild
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

    setStartBuild() {
      if (this.value && this.value.children) {
        this.focusConceptBuild = this.value.children;
      } else {
        this.focusConceptBuild = [
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
        ];
      }
    }
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
