<template>
  <div id="axioms-container" :style="{ width: size }">
    <div class="head-container">
      <strong class="label">{{ label }}</strong>
      <span v-if="Object.prototype.hasOwnProperty.call(data, 'count')">
        &nbsp;({{ data.count }})
      </span>
      <Button
        :icon="buttonExpanded ? 'pi pi-minus' : 'pi pi-plus'"
        class="p-button-rounded p-button-text p-button-primary p-button-sm expand-button"
        @click="setButtonExpanded()"
        v-styleclass="{
          selector: '#axiom-string',
          enterClass: 'p-d-none',
          enterActiveClass: 'my-fadein',
          leaveActiveClass: 'my-fadeout',
          leaveToClass: 'p-d-none'
        }"
      />
    </div>
    <pre id="axiom-string" class="p-d-none">{{
      data.axiomString.length ? data.axiomString : "None"
    }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Axioms",
  props: {
    label: { type: String },
    data: { type: Object },
    size: { type: String }
  },
  data() {
    return {
      buttonExpanded: false
    };
  },
  methods: {
    setButtonExpanded() {
      this.buttonExpanded
        ? (this.buttonExpanded = false)
        : (this.buttonExpanded = true);
    }
  }
});
</script>

<style scoped>
#axiom-string {
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
