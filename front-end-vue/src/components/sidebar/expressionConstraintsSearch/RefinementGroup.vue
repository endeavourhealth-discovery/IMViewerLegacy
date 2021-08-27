<template>
  <div class="refinement-group-container" :id="id">
    <div class="switch-button-container">
      <div class="switch-container">
        <label for="switch">Group refinements</label>
        <InputSwitch v-model="group" />
      </div>
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
    <div class="refinement-group-children-next-container">
      <span class="float-text">Refinement group</span>
      <div class="refinement-group-children-container">
        <template v-for="item in refinementBuild" :key="item.id">
          <component
            :is="item.component"
            :value="item.value"
            :id="item.id"
            :position="item.position"
            :last="refinementBuild.length -1 === item.position ? true : false"
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
    }
  },
  emits: ["addNextOptionsClicked", "addClicked", "deleteClicked", "updateClicked"],
  components: { Refinement, AddNext },
  watch: {
    refinementBuild: {
      handler() {
        this.refinementBuild.sort((a: any, b: any) => a.position - b.position);
        this.$emit("updateClicked", this.createRefinementGroup());
      },
      deep: true
    },
    group() {
      this.$emit("updateClicked", this.createRefinementGroup());
    }
  },
  mounted() {
    this.refinementBuild = this.setStartBuild();
  },
  data() {
    return {
      refinementBuild: [] as any[],
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
      if (this.refinementBuild[data.previousPosition + 1].type === ECLType.ADD_NEXT) {
        this.refinementBuild[data.previousPosition + 1] = this.getNextOptions(data.previousPosition, data.previousComponent);
      } else {
        this.refinementBuild.splice(
          data.previousPosition,
          0,
          this.getNextOptions(
            data.previousPosition,
            data.previousComponent
          )
        );
      }
      await this.$nextTick();
      const itemToScrollTo = document.getElementById(data.id);
      itemToScrollTo?.scrollIntoView();
    },

    addNextClicked() {
      this.$emit("addNextOptionsClicked", { previousComponent: ECLType.REFINEMENT_GROUP, previousPosition: this.position });
    },

    async addItem(data: any) {
      this.refinementBuild[data.position] = this.generateNewComponent(data.selectedType, data.position);
      this.updatePositions(data.position);
      if (this.refinementBuild[this.refinementBuild.length - 1].type !== ECLType.ADD_NEXT) {
        this.refinementBuild.push(
          this.getNextOptions(
            this.refinementBuild.length - 1,
            this.refinementBuild[this.refinementBuild.length - 1].type
          )
        );
      }

    },

    deleteItem(data: any) {
      const index = this.refinementBuild.findIndex(
        child => child.position === data.position
      );
      this.refinementBuild.splice(index, 1);
      if (data.position === 0) {
        this.refinementBuild.unshift(this.setStartBuild()[0]);
      }
      if (this.refinementBuild[this.refinementBuild.length - 1].type !== ECLType.ADD_NEXT) {
        this.refinementBuild.push(
          this.getNextOptions(
            this.refinementBuild.length - 1,
            this.refinementBuild[this.refinementBuild.length - 1].type
          )
        );
      } else {
        this.refinementBuild[this.refinementBuild.length - 1] =
          this.getNextOptions(
            this.refinementBuild.length - 2,
            this.refinementBuild[this.refinementBuild.length - 2].type
          );
      }
    },

    updateItem(data: any) {
      const index = this.refinementBuild.findIndex(
        item => item.position === data.position
      );
      this.refinementBuild[index] = data;
    },

    getNextOptions(position: number, previous: string) {
      return {
        id: "addNext" + "_" + (position + 1),
        value: { previousPosition: position, previousComponent: previous },
        position: position + 1,
        type: ECLType.ADD_NEXT,
        label: null,
        component: ECLComponent.ADD_NEXT
      }
    },

    updatePositions(startPosition: number) {
      this.refinementBuild.forEach((item: any) => {
        if (item.position > startPosition) {
          item.position = item.position + 1;
        }
      })
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
          children: this.refinementBuild,
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
      if (this.refinementBuild.length) {
        const labels = this.refinementBuild.map(item => {
          if (item.type === ECLType.LOGIC) {
            return item.label + "\n\t";
          } else {
            return item.label;
          }
        });
        label = labels.join(" ").replaceAll("\n ", "\n");
      }
      if (this.group) {
        return (label = "{ " + label + " }");
      } else {
        return label;
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
        ]
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
  border: 1px solid #dee2e6;
  padding: 1rem;
  margin: 0 1em 0 0;
  position: relative;
}

.refinement-group-children-container {
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
