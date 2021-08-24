<template>
  <div v-if="value" class="query-item-container">
    <p v-if="value.name === 'ANY'" class="label">{{ value.name }}</p>
    <p v-else class="label">{{ value.code }} |{{ value.name }}|</p>
    <div class="buttons-container">
      <Button
        icon="fas fa-times"
        class="p-button-rounded p-button-outlined p-button-danger"
        @click="deleteClicked"
      />
      <Button
        icon="fas fa-pencil-alt"
        class="p-button-rounded p-button-outlined p-button-secondary"
        @click="editClicked"
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
  </div>
  <OverlayPanel class="search-op" ref="miniSearchOP">
    <SearchMiniOverlay @searchResultSelected="updateSelectedResult" />
  </OverlayPanel>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchMiniOverlay from "@/components/sidebar/expressionConstraintsSearch/SearchMiniOverlay.vue";
import { ECLType } from "@/models/expressionConstraintsLanguage/ECLType";
import { ECLComponent } from "@/models/expressionConstraintsLanguage/ECLComponent";

export default defineComponent({
  name: "addExpression",
  props: { id: String, position: Number, value: { required: false } },
  emits: ["addClicked", "updateClicked", "deleteClicked"],
  components: { SearchMiniOverlay },
  data() {
    return {
      selectedResult: {} as any,
      edit: false
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
      if (this.edit) {
        this.$emit("updateClicked", this.createExpression());
      } else {
        this.$emit("addClicked", this.createExpression());
      }
      this.hideOverlay();
    },

    editClicked(event: any) {
      this.showOverlay(event);
      this.edit = true;
    },

    deleteClicked() {
      this.$emit("deleteClicked", {
        value: this.selectedResult,
        id: this.id,
        position: this.position,
        type: "Expression",
        label:
          this.selectedResult.code + " |" + this.selectedResult.name + "| ",
        component: "AddExpression",
        edit: false
      });
    },

    createExpression() {
      let label;
      if (this.selectedResult.name === "ANY") {
        label = "*";
      } else {
        label = this.selectedResult.code + " |" + this.selectedResult.name;
      }
      return {
        value: this.selectedResult,
        id: this.id,
        position: this.position,
        type: ECLType.EXPRESSION,
        label: label,
        component: ECLComponent.EXPRESSION,
        edit: false
      };
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

.query-item-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}

.label {
  margin: 0 1rem 0 0;
  padding: 1rem;
  border: 1px solid #dee2e6;
}

.buttons-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
</style>
