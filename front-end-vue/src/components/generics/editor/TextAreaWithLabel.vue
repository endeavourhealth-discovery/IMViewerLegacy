<template>
  <div class="p-field float-label-container description">
    <span class="p-float-label">
      <Textarea
        class="p-inputtext-lg"
        v-model="editText"
        rows="4"
      />
      <label for="address">Description</label>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextAreaWithLabel",
  props: {
    label: { type: String },
    data: { type: String },
    size: { type: String },
    predicate: { type: String }
  },
  emits: ["TextAreaWithLabelUpdated"],
  watch: {
    editText(newValue) {
      this.$emit("TextAreaWithLabelUpdated", {
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
})
</script>

<style scoped></style>
