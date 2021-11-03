<template>
  <div class="query-item-container" :id="id">
    <div class="label-container">
      <span class="float-text">Expression</span>
      <p v-if="selectedResult.name === 'ANY'" @click="editClicked" class="label" v-tooltip.bottom="'Click to change'">
        {{ selectedResult.name }}
      </p>
      <p v-else @click="editClicked" class="label">{{ selectedResult.code }} |{{ selectedResult.name }}|</p>
    </div>
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
  name: "Expression",
  props: { id: String, position: Number, value: { required: false } },
  emits: ["updateClicked"],
  components: { SearchMiniOverlay },
  mounted() {
    if (this.value) {
      this.updateSelectedResult(this.value);
    } else {
      this.updateSelectedResult({ name: "ANY" });
    }
  },
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
      this.$emit("updateClicked", this.createExpression());
      this.hideOverlay();
    },

    editClicked(event: any) {
      this.showOverlay(event);
    },

    createExpression() {
      let label;
      if (this.selectedResult.name === "ANY") {
        label = "*";
      } else {
        label = this.selectedResult.code + " |" + this.selectedResult.name + "|";
      }
      return {
        value: this.selectedResult,
        id: this.id,
        position: this.position,
        type: ECLType.EXPRESSION,
        label: label,
        component: ECLComponent.EXPRESSION
      };
    }
  }
});
</script>

<style scoped>
.query-item-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}

.label-container {
  margin: 0 1rem 0 0;
  padding: 1rem;
  border: 1px solid #ffc952;
  border-radius: 3px;
  position: relative;
  min-width: 15rem;
}

.label {
  cursor: pointer;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  background-color: #ffffff;
  padding: 0.25rem;
}

.float-text {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.75rem;
  color: #6c757d;
}
</style>
