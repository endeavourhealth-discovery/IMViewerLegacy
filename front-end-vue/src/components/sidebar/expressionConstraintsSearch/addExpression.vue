<template>
  <div v-if="data" class="query-item-container">
    <p class="label">{{ data.label }}</p>
    <div class="buttons-container">
      <Button
        icon="fas fa-pencil-alt"
        class="p-button-rounded p-button-outlined p-button-secondary"
        @click="editClicked"
      />
      <Button
        icon="fas fa-times"
        class="p-button-rounded p-button-outlined p-button-danger"
        @click="deleteClicked"
      />
    </div>
  </div>
  <div v-else>
    <Button
      icon="fas fa-plus"
      label="Add expression"
      class="p-button-rounded p-button-outlined p-button-danger add-expression-button"
      @click="showOverlay"
    />
    <OverlayPanel class="search-op" ref="miniSearchOP">
      <SearchMiniOverlay @searchResultSelected="updateSelectedResult" />
    </OverlayPanel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchMiniOverlay from "@/components/sidebar/expressionConstraintsSearch/SearchMiniOverlay.vue";

export default defineComponent({
  name: "addExpression",
  props: { id: String, position: Number, data: { required: false } },
  emits: ["addClicked", "editClicked", "deleteClicked"],
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
      this.$emit("addClicked", {
        value: this.selectedResult,
        id: this.id,
        position: this.position,
        type: "Expression"
      });
      this.hideOverlay();
    },

    editClicked() {
      this.$emit("editClicked", this.data);
    },

    deleteClicked() {
      this.$emit("deleteClicked", this.data);
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
