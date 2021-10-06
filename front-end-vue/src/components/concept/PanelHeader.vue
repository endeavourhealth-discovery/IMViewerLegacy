<template>
  <div id="entity-panel-header-text" :key="icon">
    <i :class="icon" :style="color" aria-hidden="true" />
    {{ header }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { getColourFromType, getIconFromType } from "@/helpers/ConceptTypeMethods";
import { TTIriRef } from "@/models/TripleTree";

export default defineComponent({
  name: "PanelHeader",
  props: {
    types: { type: Array as PropType<Array<TTIriRef>> },
    header: { type: String }
  },
  data() {
    return {
      icon: "",
      color: ""
    };
  },
  watch: {
    types(newValue): void {
      if (newValue.length > 0) {
        this.color = "color: " + getColourFromType(newValue);
        this.icon = getIconFromType(newValue);
      }
    }
  }
});
</script>

<style scoped></style>
