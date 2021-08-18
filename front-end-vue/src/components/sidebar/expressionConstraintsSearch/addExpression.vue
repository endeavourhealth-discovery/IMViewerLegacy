<template>
  <Button
    icon="fas fa-plus"
    label="Add expression"
    class="p-button-rounded p-button-outlined p-button-danger add-expression-button"
    @click="showOverlay"
  />
  <OverlayPanel class="search-op" ref="miniSearchOP">
    <SearchMiniOverlay @searchResultSelected="updateSelectedResult" />
  </OverlayPanel>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchMiniOverlay from "@/components/sidebar/expressionConstraintsSearch/SearchMiniOverlay.vue";

export default defineComponent({
  name: "addExpression",
  props: { id: String, position: Number },
  emits: ["addExpressionClicked"],
  components: { SearchMiniOverlay },
  data() {
    return {
      selectedResult: {} as any
    };
  },
  methods: {
    hideOverlay(): void {
      const x = this.$refs.miniSearchOP as any;
      x.hide();
    },

    showOverlay(event: any): void {
      const x = this.$refs.miniSearchOP as any;
      x.show(event, event.target);
    },

    updateSelectedResult(data: any) {
      this.selectedResult = data;
      this.$emit("addExpressionClicked", { selectedResult: this.selectedResult, id: this.id, position: this.position });
    }
  }
});
</script>

<style scoped>
.add-expression-button {
  border-style: dashed !important;
}

.p-button-label {
  padding-left: 0.5rem;
}

.confirm-button {
  margin-top: 1rem;
}
</style>
