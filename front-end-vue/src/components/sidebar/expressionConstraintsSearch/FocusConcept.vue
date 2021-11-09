<template>
  <div class="focus-concept-container" :id="id">
    <AddDeleteButtons :last="last" :position="position" @deleteClicked="deleteClicked" @addNextClicked="addNextClicked" />
    <div class="focus-concept-children-next-container">
      <span class="float-text">Focus concept</span>
      <div v-if="focusConceptBuild && focusConceptBuild.length" class="focus-concept-children-container">
        <template v-for="child in focusConceptBuild" :key="child.id">
          <component :is="child.component" :value="child.value" :id="child.id" :position="child.position" @updateClicked="updateChild"> </component>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Expression from "@/components/sidebar/expressionConstraintsSearch/Expression.vue";
import Constraint from "@/components/sidebar/expressionConstraintsSearch/Constraint.vue";
import AddDeleteButtons from "@/components/sidebar/expressionConstraintsSearch/AddDeleteButtons.vue";
import { ECLType } from "@/models/expressionConstraintsLanguage/ECLType";
import { ECLComponent } from "@/models/expressionConstraintsLanguage/ECLComponent";
import { NextComponentSummary } from "@/models/ecl/NextComponentSummary";
import { ComponentDetails } from "@/models/ecl/ComponentDetails";

export default defineComponent({
  name: "FocusConcept",
  props: {
    id: { type: String, required: true },
    position: { type: Number, required: true },
    value: {
      type: Object as PropType<{
        children: any[];
      }>,
      required: false
    },
    last: Boolean
  },
  emits: {
    addNextOptionsClicked: (payload: NextComponentSummary) => true,
    deleteClicked: (payload: ComponentDetails) => true,
    updateClicked: (payload: ComponentDetails) => true
  },
  components: { Expression, Constraint, AddDeleteButtons },
  watch: {
    focusConceptBuild: {
      handler() {
        this.focusConceptBuild.sort((a: any, b: any) => a.position - b.position);
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
      focusConceptBuild: [] as any[]
    };
  },
  methods: {
    deleteClicked() {
      this.$emit("deleteClicked", this.createFocusConcept());
    },

    updateChild(data: any) {
      const index = this.focusConceptBuild.findIndex(item => item.position === data.position);
      this.focusConceptBuild[index] = data;
    },

    addNextClicked(): void {
      this.$emit("addNextOptionsClicked", {
        previousComponent: ECLType.FOCUS_CONCEPT,
        previousPosition: this.position,
        parentGroup: ECLType.FOCUS_CONCEPT
      });
    },

    createFocusConcept(): ComponentDetails {
      return {
        id: this.id,
        value: {
          children: this.focusConceptBuild
        },
        position: this.position,
        type: ECLType.FOCUS_CONCEPT,
        label: this.generateFocusConceptLabel(),
        component: ECLComponent.FOCUS_CONCEPT
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
        label = labels
          .join(" ")
          .replaceAll("\n ", "\n")
          .trim();
      }
      return label;
    },

    setStartBuild() {
      if (this.value && this.value.children) {
        this.focusConceptBuild = [...this.value.children];
      } else {
        this.focusConceptBuild = [
          {
            component: ECLComponent.CONSTRAINT,
            id: this.id + ECLType.CONSTRAINT,
            label: null,
            position: 0,
            type: ECLType.CONSTRAINT,
            value: null
          },
          {
            component: ECLComponent.EXPRESSION,
            id: this.id + ECLType.EXPRESSION,
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

.focus-concept-children-next-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #47b8e0;
  border-radius: 3px;
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

.float-text {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.75rem;
  color: #6c757d;
}
</style>
