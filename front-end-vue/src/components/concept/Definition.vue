<template>
  <div class="content-container">
    <div class="summary-container">
      <template v-for="(config, index) in configs" :key="index">
        <component
          :is="config.type"
          :label="config.label"
          :data="concept[config.predicate]"
          :size="config.size"
          :id="config.type + index"
        >
        </component>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SemanticProperties from "./SemanticProperties.vue";
import DataModelProperties from "./DataModelProperties.vue";
import ArrayObjectNamesToStringWithLabel from "@/components/concept/generics/ArrayObjectNamesToStringWithLabel.vue";
import TextHTMLWithLabel from "@/components/concept/generics/TextHTMLWithLabel.vue";
import TextWithLabel from "@/components/concept/generics/TextWithLabel.vue";
import ObjectNameWithLabel from "@/components/concept/generics/ObjectNameWithLabel.vue";
import ListboxWithLabel from "@/components/concept/generics/ListboxWithLabel.vue";

export default defineComponent({
  name: "Definition",
  components: {
    SemanticProperties,
    DataModelProperties,
    ArrayObjectNamesToStringWithLabel,
    TextHTMLWithLabel,
    TextWithLabel,
    ObjectNameWithLabel,
    ListboxWithLabel
  },
  props: ["concept", "configs"]
});
</script>

<style scoped>
.content-container {
  height: 100%;
}

.summary-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  width: 100%;
}
</style>
