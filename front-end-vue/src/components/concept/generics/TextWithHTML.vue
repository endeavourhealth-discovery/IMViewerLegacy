<template>
  <strong>Description:</strong>
  <ScrollPanel style="height: 100px" class="custom">
    <!-- div content injected by javascript -->
    <div :id="id"></div>
  </ScrollPanel>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextWithHTML",
  props: ["label", "HTMLtext", "id"],
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
      const text = this.HTMLtext.replace(
          /<p>/g,
          "</p>\n<p class='description-p'>"
        );
      this.convertedText = "<p class='description-p'>" + text + "</p>";
      const descContainer = document.getElementById(this.id);
      if (descContainer) {
        descContainer.innerHTML = this.convertedText;
      }
    }
  }
});
</script>

<style scoped>

</style>
