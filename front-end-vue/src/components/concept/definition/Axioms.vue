<template>
  <div id="axioms-container" :style="{ width: size }">
    <div class="head-container">
      <strong class="label">{{ label }}</strong>
      <span v-if="Object.prototype.hasOwnProperty.call(axiomObject, 'entity')">&nbsp;({{ axiomObject.predicates.length - 1 }})</span>
      <Button
        icon="pi pi-plus"
        class="p-button-rounded p-button-text p-button-primary p-button-sm expand-button"
        v-styleclass="{
          selector: '#axiom-string',
          enterClass: 'p-d-none',
          enterActiveClass: 'my-fadein',
          leaveActiveClass: 'my-fadeout',
          leaveToClass: 'p-d-none'
        }"
      />
    </div>
    <pre id="axiom-string" class="p-d-none">{{ data.length ? data : "None" }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { mapState } from "vuex";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "Axioms",
  props: {
    label: { type: String },
    data: { type: String },
    size: { type: String }
  },
  computed: {
    ...mapState(["conceptIri"])
  },
  mounted() {
    this.getAxioms();
  },
  data() {
    return {
      axiomObject: {} as any
    }
  },
  methods: {
    async getAxioms() {
      await EntityService.getAxioms(this.conceptIri)
        .then(res => {
          this.axiomObject = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get axioms from server", err));
        });
    }
  }
})
</script>

<style scoped>
#axiom-string {
  border: 1px solid #dee2e6;
  border-radius: 3px;
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
