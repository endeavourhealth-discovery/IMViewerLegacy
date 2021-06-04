<template>
  <div>
    <div :key="icon">
      <i :class="icon" :style="color" aria-hidden="true" />
      {{ header }}
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import {
  getColourFromType,
  getIconFromType
} from "@/helpers/ConceptTypeMethods";

export default defineComponent({
  name: "PanelHeader",
  props: ["types", "header"],
  data() {
    return {
      icon: "",
      color: ""
    };
  },
  watch: {
    types(newValue) {
      if (newValue) {
        this.color = "color: " + getColourFromType(newValue);
        this.icon = getIconFromType(newValue);
      }
    }
  }
});
</script>

<style></style>
