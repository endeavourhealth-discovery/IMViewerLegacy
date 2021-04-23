<template>
  <div class="concept-container">
    <PanelControl />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import PanelControl from "@/components/panels/PanelControl.vue";

@Options({
  name: "Concept",
  components: {
    PanelControl
  }
})
export default class Concept extends Vue {}
</script>
<style scoped>
.concept-container {
  /* height: calc(100vh - 123px); */
  grid-area: content;
  height: 100%;
  width: 100%;
  overflow-y: auto;
}
</style>
