<template>
  <div v-if="hasData" id="axioms-container" :style="{ width: size }">
    <div class="head-container">
      <strong class="label">{{ label }}</strong>
      <span v-if="getCount()">&nbsp;({{ getCount() }})</span>
      <Button
        :icon="buttonExpanded ? 'pi pi-minus' : 'pi pi-plus'"
        class="p-button-rounded p-button-text p-button-primary p-button-sm expand-button"
        :id="'expand-button-' + label"
        @click="setButtonExpanded()"
        v-styleclass="{
          selector: '.tgl-' + label,
          enterClass: 'p-d-none',
          enterActiveClass: 'my-fadein',
          leaveActiveClass: 'my-fadeout',
          leaveToClass: 'p-d-none'
        }"
      />
    </div>
    <pre :class="'p-d-none tgl-' + label">{{ getDefinition() }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { bundleToText } from "@/helpers/Transforms";
import { TTBundle } from "@/models/TripleTree";
import { mapState } from "vuex";
import { PartialEntity } from "@/models/PartialEntity";
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";

export default defineComponent({
  name: "TextDefinition",
  props: {
    label: { type: String },
    data: { type: Object as () => PartialEntity, required: true },
    size: { type: String },
    show: { type: Boolean }
  },
  computed: {
    hasData(): boolean {
      if (isObjectHasKeys(this.data, ["entity", "predicates"]) && Object.keys(this.data.predicates).length && Object.keys(this.data.entity).length) {
        return true;
      } else {
        return false;
      }
    },
    ...mapState(["selectedEntityType"])
  },
  mounted() {
    if (this.selectedEntityType === "Ontology" && this.label === "Inferred") {
      const button = document.getElementById(`expand-button-${this.label}`) as HTMLElement;
      if (button) button.click();
    }
  },
  data() {
    return {
      buttonExpanded: false,
      count: 0
    };
  },
  methods: {
    setButtonExpanded(): void {
      this.buttonExpanded = !this.buttonExpanded;
    },
    getDefinition(): string {
      return bundleToText(this.data as TTBundle);
    },
    getCount(): number {
      let count = 0;
      Object.keys(this.data.entity).forEach(key => {
        count += (this.data.entity as any)[key].length;
      });
      return count;
    }
  }
});
</script>

<style scoped>
pre {
  border: 1px solid #dee2e6;
  border-radius: 3px;
  padding: 0.5rem;
  margin: 0.5rem 0 0 0;
  overflow: auto;
}

.head-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

@keyframes my-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes my-fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.my-fadein {
  animation: my-fadein 150ms linear;
}

.my-fadeout {
  animation: my-fadeout 150ms linear;
}
</style>
