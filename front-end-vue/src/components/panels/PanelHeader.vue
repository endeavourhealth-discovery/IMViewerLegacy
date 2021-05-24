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
import {getColourFromType, getIconFromType} from "@/helpers/ConceptTypeMethods";

export default defineComponent({
  name: "PanelHeader",
  props: ["type", "header"],
  data() {
    return {
      icon: '',
      color: ''
    }
  },
  watch: {
    type(newValue) {
      if (newValue) {
        this.color = 'color: ' + getColourFromType(newValue);
        this.icon = getIconFromType(newValue);
      }
    }
  }
});
</script>

<style></style>
