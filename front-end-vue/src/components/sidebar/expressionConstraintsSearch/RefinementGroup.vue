<template>
  <div class="refinement-group-container" :id="id">
    <div class="switch-button-container">
      <div class="switch-container">
        <label for="switch">Group</label>
        <InputSwitch v-model="group" />
      </div>
      <AddDeleteButtons :last="last" :position="position" @deleteClicked="deleteClicked" @addNextClicked="addNextClicked" />
    </div>
    <div class="refinement-group-children-next-container">
      <span class="float-text">Refinement group</span>
      <div class="refinement-group-children-container">
        <template v-for="item in refinementGroupBuild" :key="item.id">
          <component
            :is="item.component"
            :value="item.value"
            :id="item.id"
            :position="item.position"
            :last="refinementGroupBuild.length - 2 <= item.position ? true : false"
            @deleteClicked="deleteItem"
            @addClicked="addItem"
            @updateClicked="updateItem"
            @addNextOptionsClicked="addNextOptions"
          >
          </component>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Refinement from "@/components/sidebar/expressionConstraintsSearch/Refinement.vue";
import AddNext from "@/components/sidebar/expressionConstraintsSearch/AddNext.vue";
import Logic from "@/components/sidebar/expressionConstraintsSearch/Logic.vue";
import AddDeleteButtons from "@/components/sidebar/expressionConstraintsSearch/AddDeleteButtons.vue";
import { ECLType } from "@/models/expressionConstraintsLanguage/ECLType";
import { ECLComponent } from "@/models/expressionConstraintsLanguage/ECLComponent";

export default defineComponent({
  name: "RefinementGroup",
  props: {
    id: String,
    position: Number,
    value: {
      type: Object as PropType<{
        children: any[];
        group: boolean;
      }>,
      required: false
    },
    last: Boolean
  },
  emits: ["addNextOptionsClicked", "addClicked", "deleteClicked", "updateClicked"],
  components: { Refinement, AddNext, Logic, AddDeleteButtons },
  watch: {
    refinementGroupBuild: {
      handler() {
        this.refinementGroupBuild.sort((a: any, b: any) => a.position - b.position);
        this.$emit("updateClicked", this.createRefinementGroup());
      },
      deep: true
    },
    group() {
      this.$emit("updateClicked", this.createRefinementGroup());
    }
  },
  mounted() {
    this.refinementGroupBuild = this.setStartBuild();
  },
  data() {
    return {
      refinementGroupBuild: [] as any[],
      group: false
    };
  },
  methods: {
    onConfirm() {
      this.$emit("addClicked", this.createRefinementGroup());
    },

    deleteClicked() {
      this.$emit("deleteClicked", this.createRefinementGroup());
    },

    async addNextOptions(data: any) {
      if (this.refinementGroupBuild[data.previousPosition + 1].type === ECLType.ADD_NEXT) {
        this.refinementGroupBuild[data.previousPosition + 1] = this.getNextOptions(data.previousPosition, data.previousComponent, data.parentGroup);
      } else {
        this.refinementGroupBuild.splice(data.previousPosition, 0, this.getNextOptions(data.previousPosition, data.previousComponent, data.parentGroup));
      }
      await this.$nextTick();
      const itemToScrollTo = document.getElementById(data.id);
      itemToScrollTo?.scrollIntoView();
    },

    addNextClicked() {
      this.$emit("addNextOptionsClicked", {
        previousComponent: ECLType.REFINEMENT_GROUP,
        previousPosition: this.position
      });
    },

    async addItem(data: any) {
      this.refinementGroupBuild[data.position] = this.generateNewComponent(data.selectedType, data.position);
      this.updatePositions(data.position);
      if (this.refinementGroupBuild[this.refinementGroupBuild.length - 1].type !== ECLType.ADD_NEXT) {
        this.refinementGroupBuild.push(
          this.getNextOptions(
            this.refinementGroupBuild.length - 1,
            this.refinementGroupBuild[this.refinementGroupBuild.length - 1].type,
            ECLType.REFINEMENT_GROUP
          )
        );
      }
    },

    deleteItem(data: any) {
      const index = this.refinementGroupBuild.findIndex(child => child.position === data.position);
      this.refinementGroupBuild.splice(index, 1);
      if (data.position === 0) {
        this.refinementGroupBuild.unshift(this.setStartBuild()[0]);
      }
      if (this.refinementGroupBuild[this.refinementGroupBuild.length - 1].type !== ECLType.ADD_NEXT) {
        this.refinementGroupBuild.push(
          this.getNextOptions(this.refinementGroupBuild.length - 1, this.refinementGroupBuild[this.refinementGroupBuild.length - 1].type, "")
        );
      } else {
        this.refinementGroupBuild[this.refinementGroupBuild.length - 1] = this.getNextOptions(
          this.refinementGroupBuild.length - 2,
          this.refinementGroupBuild[this.refinementGroupBuild.length - 2].type,
          ""
        );
      }
    },

    updateItem(data: any) {
      const index = this.refinementGroupBuild.findIndex(item => item.position === data.position);
      this.refinementGroupBuild[index] = data;
    },

    getNextOptions(position: number, previous: string, group: string) {
      return {
        id: "addNext" + "_" + (position + 1),
        value: {
          previousPosition: position,
          previousComponent: previous,
          parentGroup: group
        },
        position: position + 1,
        type: ECLType.ADD_NEXT,
        label: null,
        component: ECLComponent.ADD_NEXT
      };
    },

    updatePositions(startPosition: number) {
      this.refinementGroupBuild.forEach((item: any) => {
        if (item.position > startPosition) {
          item.position = item.position + 1;
        }
      });
    },

    generateNewComponent(type: string, position: number) {
      let result;
      switch (type) {
        case ECLType.REFINEMENT:
          result = {
            id: ECLType.REFINEMENT + "_" + position,
            value: null,
            position: position,
            type: ECLType.REFINEMENT,
            label: null,
            component: ECLComponent.REFINEMENT
          };
          break;
        case ECLType.LOGIC:
          result = {
            id: ECLType.LOGIC + "_" + position,
            value: null,
            position: position,
            type: ECLType.LOGIC,
            label: null,
            component: ECLComponent.LOGIC
          };
          break;
        default:
          break;
      }
      return result;
    },

    createRefinementGroup() {
      return {
        id: this.id,
        value: {
          children: this.refinementGroupBuild,
          group: this.group
        },
        position: this.position,
        type: ECLType.REFINEMENT_GROUP,
        label: this.generateRefinementLabel(),
        component: ECLComponent.REFINEMENT_GROUP,
        edit: false
      };
    },

    generateRefinementLabel(): string {
      let label = "";
      if (this.refinementGroupBuild.length) {
        const labels = this.refinementGroupBuild.map(item => {
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
      if (this.group) {
        return ":\n\t{" + label + "}";
      } else {
        return ":\n\t" + label;
      }
    },

    setStartBuild() {
      if (this.value && this.value.children) {
        return [...this.value.children];
      } else {
        return [
          {
            component: ECLComponent.REFINEMENT,
            id: this.id + ECLType.REFINEMENT,
            label: null,
            position: 0,
            type: ECLType.REFINEMENT,
            value: null
          },
          {
            component: ECLComponent.ADD_NEXT,
            id: this.id + ECLType.ADD_NEXT,
            value: {
              previousPosition: 0,
              previousComponent: ECLType.REFINEMENT
            },
            position: 1,
            type: ECLType.ADD_NEXT,
            label: null
          }
        ];
      }
    }
  }
});
</script>

<style scoped>
.refinement-group-container {
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
  align-items: flex-start;
  gap: 1rem;
}

.switch-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

.refinement-group-children-next-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #d499b9;
  border-radius: 3px;
  padding: 1rem;
  margin: 0 1em 0 0;
  position: relative;
}

.refinement-group-children-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.float-text {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.75rem;
  color: #6c757d;
}
</style>
