<template>
  <div id="axioms-container" :style="{ width: size }">
    <div class="head-container">
      <strong class="label">{{ label }}</strong>
      <span v-if="Object.prototype.hasOwnProperty.call(axiomObject, 'entity')">&nbsp;({{ predicateCount }})</span>
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
    <pre id="axiom-string" class="p-d-none">{{ data.length ? data : "None" }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { mapState } from "vuex";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { RDF } from "@/vocabulary/RDF";
import { RDFS } from "@/vocabulary/RDFS";

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
      axiomObject: {} as any,
      predicateCount: 0,
      predicates: [] as string[],
      buttonExpanded: false
    }
  },
  methods: {
    async getAxioms() {
      await EntityService.getAxioms(this.conceptIri)
        .then(res => {
          this.axiomObject = res.data;
          this.predicates = Object.keys(this.axiomObject.entity).filter(key => key !== RDF.TYPE).filter(key => key !== RDFS.COMMENT).filter(key => key !== RDFS.LABEL).filter(key => key !== "@id");
          this.predicateCount = this.predicates.length;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get axioms from server", err));
        });
    },

    setButtonExpanded() {
      this.buttonExpanded ? this.buttonExpanded = false : this.buttonExpanded = true;
    }
  }
})
</script>

<style scoped>
#axiom-string {
  border: 1px solid #dee2e6;
  border-radius: 3px;
  padding: 0.5rem;
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
