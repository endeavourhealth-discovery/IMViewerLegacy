<template>
  <div class="content-container">
    <div class="summary-container">
      <template v-for="(config, index) in configs" :key="index">
        <component
          v-if="concept[config.predicate]"
          :is="config.type"
          :label="config.label"
          :data="concept[config.predicate]"
          :size="config.size"
          :id="config.type + index"
        >
        </component>
      </template>
    </div>
    <SemanticProperties
      :semanticProperties="semanticProperties"
      :contentHeight="contentHeight"
    />
    <Divider />
    <DataModelProperties
      :dataModelProperties="dataModelProperties"
      :contentHeight="contentHeight"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import SemanticProperties from "./SemanticProperties.vue";
import DataModelProperties from "./DataModelProperties.vue";

export default defineComponent({
  name: "Definition",
  components: {
    SemanticProperties,
    DataModelProperties
  },
  props: [
    "concept",
    "semanticProperties",
    "dataModelProperties",
    "contentHeight",
    "configs"
  ],
  data() {
    return {
      selected: {},
      copyMenuItems: [] as any
    };
  },
  methods: {
    navigate(iri: any) {
      const currentRoute = this.$route.name as RouteRecordName | undefined;
      if (iri)
        this.$router.push({
          name: currentRoute,
          params: { selectedIri: iri }
        });
    }
  }
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

.definitional-container {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  gap: 7px;
}

.left-side {
  width: 50%;
}

.right-side {
  width: 50%;
}

.custom .p-scrollpanel-wrapper {
  border-right: 9px solid #f4f4f4;
}

.custom .p-scrollpanel-bar {
  background-color: #1976d2 !important;
  opacity: 1;
  transition: background-color 0.3s;
}

.custom .p-scrollpanel-bar:hover {
  background-color: #135ba1 !important;
}

#synonyms-button {
  margin-left: 0.5em;
}

.link {
  cursor: pointer;
}
</style>
