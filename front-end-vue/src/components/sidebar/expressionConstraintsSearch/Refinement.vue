<template>
  <div class="refinement-container" :id="id">
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
    <div class="refinement-children-next-container">
      <span class="float-text">Refinement</span>
      <div
        v-if="refinementBuild && refinementBuild.length"
        class="refinement-children-container"
      >
        <template v-for="child in refinementBuild" :key="child.id">
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
import Expression from "@/components/sidebar/expressionConstraintsSearch/Expression.vue";
import Constraint from "@/components/sidebar/expressionConstraintsSearch/Constraint.vue";
import Operator from "@/components/sidebar/expressionConstraintsSearch/Operator.vue";
import { ECLType } from "@/models/expressionConstraintsLanguage/ECLType";
import { ECLComponent } from "@/models/expressionConstraintsLanguage/ECLComponent";

export default defineComponent({
  name: "Refinement",
  props: {
    id: String,
    position: Number,
    value: {
      type: Object as PropType<{
        children: any[];
      }>,
      required: false
    }
  },
  emits: ["addNextOptionsClicked", "deleteClicked", "updateClicked"],
  components: { Expression, Constraint, Operator },
  watch: {
    refinementBuild: {
      handler() {
        this.refinementBuild.sort((a: any, b: any) => a.position - b.position);
        this.$emit("updateClicked", this.createRefinement());
      },
      deep: true
    },
    group() {
      this.$emit("updateClicked", this.createRefinement());
    }
  },
  mounted() {
    this.setStartBuild();
  },
  data() {
    return {
      refinementBuild: [] as any[]
    };
  },
  methods: {
    deleteClicked() {
      this.$emit("deleteClicked", this.createRefinement());
    },

    updateChild(data: any) {
      const index = this.refinementBuild.findIndex(
        item => item.position === data.position
      );
      this.refinementBuild[index] = data;
    },

    addNextClicked() {
      this.$emit("addNextOptionsClicked", {
        previousComponent: ECLType.REFINEMENT,
        previousPosition: this.position,
        parentGroup: ECLType.REFINEMENT_GROUP
      });
    },

    createRefinement() {
      return {
        id: this.id,
        value: {
          children: this.refinementBuild
        },
        position: this.position,
        type: ECLType.REFINEMENT,
        label: this.generateRefinementLabel(),
        component: ECLComponent.REFINEMENT,
        edit: false
      };
    },

    generateRefinementLabel(): string {
      let label = "";
      if (this.refinementBuild.length) {
        const labels = this.refinementBuild.map(item => item.label);
        label = labels
          .join(" ")
          .replaceAll("\n ", "\n")
          .replaceAll("  ", " ")
          .trim();
      }
      return label;
    },

    setStartBuild() {
      if (this.value && this.value.children) {
        this.refinementBuild = [...this.value.children];
      } else {
        this.refinementBuild = [
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
          },
          {
            component: ECLComponent.OPERATOR,
            id: this.id + ECLType.OPERATOR,
            label: null,
            position: 2,
            type: ECLType.OPERATOR,
            value: null
          },
          {
            component: ECLComponent.CONSTRAINT,
            id: this.id + ECLType.CONSTRAINT,
            label: null,
            position: 3,
            type: ECLType.CONSTRAINT,
            value: null
          },
          {
            component: ECLComponent.EXPRESSION,
            id: this.id + ECLType.EXPRESSION,
            label: null,
            position: 4,
            type: ECLType.OPERATOR,
            value: null
          }
        ];
      }
    }
  }
});
</script>

<style scoped>
.refinement-container {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

.add-refinement-button {
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

.refinement-children-next-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #56a902;
  border-radius: 3px;
  padding: 1rem;
  margin: 0 1em 0 0;
  position: relative;
}

.refinement-children-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
}

.buttons-container {
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  gap: 0.5rem;
}

.float-text {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.75rem;
  color: #6c757d;
}
</style>
