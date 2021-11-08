<template>
  <div class="logic-container" :id="id">
    <div class="label-container">
      <span class="float-text">Logic</span>
      <Dropdown v-model="selected" :options="options" placeholder="Select logic" />
    </div>
    <AddDeleteButtons :last="last" :position="position" @deleteClicked="deleteClicked" @addNextClicked="addNextClicked" />
  </div>
</template>

<script lang="ts">
import { ECLComponent } from "@/models/expressionConstraintsLanguage/ECLComponent";
import { ECLType } from "@/models/expressionConstraintsLanguage/ECLType";
import { defineComponent } from "vue";
import AddDeleteButtons from "@/components/sidebar/expressionConstraintsSearch/AddDeleteButtons.vue";

export default defineComponent({
  name: "Logic",
  props: { id: String, position: Number, value: String, last: Boolean },
  components: { AddDeleteButtons },
  emits: ["addClicked", "deleteClicked", "updateClicked", "addNextOptionsClicked"],
  watch: {
    selected() {
      this.onConfirm();
    }
  },
  mounted() {
    if (this.value) {
      this.selected = this.value;
    } else {
      this.selected = this.options[0];
    }
  },
  data() {
    return {
      options: ["AND", "OR", "MINUS"],
      selected: ""
    };
  },
  methods: {
    onConfirm() {
      this.$emit("updateClicked", {
        id: this.id,
        value: this.selected,
        position: this.position,
        type: ECLType.LOGIC,
        component: ECLComponent.LOGIC,
        label: this.selected
      });
    },

    deleteClicked() {
      this.$emit("deleteClicked", {
        id: this.id,
        value: this.selected,
        position: this.position,
        type: ECLType.LOGIC,
        component: ECLComponent.LOGIC,
        label: this.selected
      });
    },

    addNextClicked() {
      this.$emit("addNextOptionsClicked", {
        previousComponent: ECLType.LOGIC,
        previousPosition: this.position
      });
    }
  }
});
</script>

<style scoped>
.logic-container {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

.p-button-label {
  padding-left: 0.5rem;
}

.query-item-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}

.label-container {
  margin: 0 1rem 0 0;
  padding: 1rem;
  border: 1px solid #34314c;
  border-radius: 3px;
  position: relative;
}

.p-dropdown {
  width: 7rem;
}

.float-text {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.75rem;
  color: #6c757d;
}
</style>
