<template>
  <div v-if="value" class="refinement-container">
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
      <AddLogic
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

export default defineComponent({
  name: "AddRefinement",
  props: {
    id: String,
    position: Number,
    value: { type: Object as PropType<{ children: any[] }>, required: false }
  },
  emits: ["addClicked", "deleteClicked", "updateClicked"],
  components: { AddLogic, AddExpression, AddConstraint },
  watch: {
    refinementBuild: {
      handler() {
        this.refinementBuild.sort((a: any, b: any) => a.position - b.position);
        this.$emit("updateClicked", {
          id: this.id,
          value: { children: this.refinementBuild },
          position: this.position,
          type: "Refinement",
          label: this.generateRefinementLabel(),
          component: "AddRefinement",
          edit: false
        });
      },
      deep: true
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
      refinementString: ""
    };
  },
  methods: {
    onConfirm() {
      this.$emit("addClicked", {
        id: this.id,
        value: { children: [] },
        position: this.position,
        type: "Refinement",
        label: this.generateRefinementLabel,
        component: "AddRefinement",
        edit: false
      });
    },

    deleteClicked() {
      this.$emit("deleteClicked", {
        id: this.id,
        value: { children: [] },
        position: this.position,
        type: "Refinement",
        label: this.generateRefinementLabel(),
        component: "AddRefinement",
        edit: false
      });
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

    generateRefinementLabel(): string {
      const labels = this.refinementBuild.map(item => item.label);
      let label = labels.join(" ");
      label = ": { " + label + " }";
      return label;
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
</style>
