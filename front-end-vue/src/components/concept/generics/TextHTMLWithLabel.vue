<template>
  <div :style="{ width: size }">
    <strong>{{ label }}:</strong>
    <!-- div content injected by javascript -->
    <div :id="id"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextHTMLWithLabel",
  props: {
    label: { type: String },
    data: { type: String },
    size: { type: String },
    id: { type: String }
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      convertedText: ""
    };
  },
  methods: {
    init() {
      if (!this.data || !this.id) {
        return;
      }
      const text = this.data.replace(/<p>/g, "</p>\n<p class='description-p'>");
      this.convertedText = "<p class='description-p'>" + text + "</p>";
      const descContainer = document.getElementById(this.id);
      if (descContainer) {
        descContainer.innerHTML = this.convertedText;
      }
    }
  }
});
</script>

<style scoped></style>
