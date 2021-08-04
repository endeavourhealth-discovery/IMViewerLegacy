<template>
  <div class="p-field float-label-container">
    <span class="p-float-label">
      <InputText class="p-inputtext-lg" v-model="editText" type="text" />
      <label for="Iri">{{ label }}</label>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextInputWithLabel",
  props: {
    label: { type: String },
    data: { type: String },
    size: { type: String },
    predicate: { type: String }
  },
  emits: ["TextInputWithLabelUpdated"],
  watch: {
    editText(newValue) {
      this.$emit("TextInputWithLabelUpdated", {
        predicate: this.predicate,
        data: newValue
      });
    }
  },
  data() {
    return {
      editText: this.isString ? this.data : ""
    };
  },
  methods: {
    isString(): boolean {
      return typeof this.data === "string" ? true : false;
    }
  }
});
</script>

<style scoped>
.p-field {
  height: fit-content;
}

.float-label-container {
  margin-top: 1.5rem;
}
</style>
