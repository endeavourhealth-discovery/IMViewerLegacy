<template>
  <div class="text-html-with-label-container" :style="{ width: size }">
    <strong class="label">{{ label }}:</strong>
    <!-- div content injected by javascript -->
    <div class="data" :id="id"></div>
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
      let text = this.data;
      if (text.startsWith("<p>")) {
        text = text.slice(3);
      }
      if (this.data.endsWith("<p>")) {
        text = text.slice(0, -3);
      }
      text = text.replace(/<p>/g, "</p><p class='" + this.id + "-p'>");
      this.convertedText = "<p class='" + this.id + "-p'>" + text + "</p>";
      const descContainer = document.getElementById(this.id);
      if (descContainer) {
        descContainer.innerHTML = this.convertedText;
      }
    }
  }
});
</script>

<style scoped></style>
