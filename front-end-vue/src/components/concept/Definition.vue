<template>
  <div class="content-container">
    <div class="p-d-flex p-flex-row p-jc-start summary-container">
      <div class="left-side">
        <TextWithLabel label="Name" :text="concept.name" />
        <TextWithLabel label="Iri" :text="concept.iri" />
        <TextWithLabel label="Status" :text="concept.status ? concept.status : 'None'" />
        <ArrayToNamesString label="Types" :array="concept.types" />
      </div>
      <div class="right-side" v-if="concept.description">
        <TextWithHTML label="Description" :HTMLtext="concept.description" id="description" />
      </div>
    </div>
    <Divider />
    <div class="p-d-flex p-flex-row p-jc-start definitional-container">
      <div class="left-side">
        <strong>is a: </strong>{{ concept.isa?.length }}
        <Listbox
          :options="concept.isa"
          listStyle="height: 12rem;"
          v-model="selected"
          @change="navigate(selected['@id'])"
        >
          <template #option="slotProps">
            <div>
              {{ slotProps.option?.name || slotProps.option?.["@id"] }}
            </div>
          </template>
        </Listbox>
      </div>
      <div class="right-side">
        <strong>has sub types: </strong>{{ concept.subtypes?.length }}
        <Listbox
          :options="concept.subtypes"
          listStyle="height: 12rem;"
          v-model="selected"
          @change="navigate(selected['@id'])"
        >
          <template #option="slotProps">
            <div>
              {{ slotProps.option.name || slotProps.option["@id"] }}
            </div>
          </template>
        </Listbox>
      </div>
    </div>
    <Divider />
    <SemanticProperties
      :semanticProperties="semanticProperties"
      :dataModelProperties="dataModelProperties"
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
import TextWithLabel from "@/components/concept/generics/TextWithLabel.vue";
import ArrayToNamesString from "@/components/concept/generics/ArrayToNamesString.vue";
import TextWithHTML from "@/components/concept/generics/TextWithHTML.vue";

export default defineComponent({
  name: "Definition",
  components: { SemanticProperties, DataModelProperties, TextWithLabel, ArrayToNamesString, TextWithHTML },
  props: [
    "concept",
    "semanticProperties",
    "dataModelProperties",
    "contentHeight"
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
  width: 100%;
  gap: 7px;
}

.definitional-container {
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
