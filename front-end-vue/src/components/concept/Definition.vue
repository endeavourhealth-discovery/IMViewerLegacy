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
import ArrayObjectNamesToStringWithLabel from "@/components/generics/ArrayObjectNamesToStringWithLabel.vue";
import TextHTMLWithLabel from "@/components/generics/TextHTMLWithLabel.vue";
import TextWithLabel from "@/components/generics/TextWithLabel.vue";
import ObjectNameWithLabel from "@/components/generics/ObjectNameWithLabel.vue";
import ArrayObjectNameListboxWithLabel from "@/components/generics/ArrayObjectNameListboxWithLabel.vue";
import TermsTable from "@/components/concept/TermsTable.vue";

export default defineComponent({
  name: "Definition",
  components: {
    SemanticProperties,
    DataModelProperties,
    ArrayObjectNamesToStringWithLabel,
    TextHTMLWithLabel,
    TextWithLabel,
    ObjectNameWithLabel,
    ArrayObjectNameListboxWithLabel,
    TermsTable
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
  row-gap: 0.5rem;
}
</style>
