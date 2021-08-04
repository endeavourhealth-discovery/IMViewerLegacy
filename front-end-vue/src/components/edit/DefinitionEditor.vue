<template>
  <Card>
    <template #content>
      <div class="p-fluid editor-grid">
        <!-- <template v-for="(config, index) in configs" :key="index">
          <component
            :is="config.type"
            :label="config.label"
            :data="conceptEditable[config.predicate]"
            :size="config.size"
            :id="config.type + index"
          />
        </template> -->
        <TextInputWithLabel
          label="Iri"
          :data="conceptEditable['@id']"
          predicate="@id"
          size="50%"
          @TextInputWithLabelUpdated="updateConceptByPredicate"
        />
        <TextInputWithLabel
          label="Name"
          :data="conceptEditable['http://www.w3.org/2000/01/rdf-schema#label']"
          predicate="http://www.w3.org/2000/01/rdf-schema#label"
          size="50%"
          @TextInputWithLabelUpdated="updateConceptByPredicate"
        />
        <TextInputWithLabel
          label="Code"
          :data="conceptEditable['http://endhealth.info/im#code']"
          predicate="http://endhealth.info/im#code"
          size="50%"
          @TextInputWithLabelUpdated="updateConceptByPredicate"
        />
        <TextAreaWithLabel
          label="Description"
          :data="conceptEditable['http://www.w3.org/2000/01/rdf-schema#label']"
          predicate="http://www.w3.org/2000/01/rdf-schema#label"
          size="100%"
          @TextInputWithLabelUpdated="updateConceptByPredicate"
        />
        <TextInputWithLabel
          label="Version"
          :data="conceptEditable['version']"
          predicate="version"
          size="50%"
          @TextInputWithLabelUpdated="updateConceptByPredicate"
        />
        <DropdownChildrenNameWithLabel
          label="Status"
          :data="conceptEditable['http://endhealth.info/im#Status']"
          predicate="http://endhealth.info/im#Status"
          size="50%"
          @DropdownChildrenNameWithLabelUpdated="updateConceptByPredicate"
        />
        <DropdownChildrenNameWithLabel
          label="Scheme"
          :data="conceptEditable['http://endhealth.info/im#CodeScheme']"
          predicate="http://endhealth.info/im#CodeScheme"
          size="50%"
          @DropdownChildrenNameWithLabelUpdated="updateConceptByPredicate"
        />
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Card from "primevue/card";
import TextInputWithLabel from "@/components/generics/editor/TextInputWithLabel.vue";
import TextAreaWithLabel from "@/components/generics/editor/TextAreaWithLabel.vue";
import DropdownChildrenNameWithLabel from "@/components/generics/editor/DropdownChildrenNameWithLabel.vue";

export default defineComponent({
  name: "FormEditor",
  components: {
    Card,
    TextInputWithLabel,
    TextAreaWithLabel,
    DropdownChildrenNameWithLabel
  },
  props: ["iri", "updatedConcept"],
  emits: ["concept-updated"],
  watch: {
    conceptEditable: {
      handler(newValue) {
        this.$emit("concept-updated", newValue);
      },
      deep: true
    }
  },
  data() {
    return {
      conceptEditable: JSON.parse(JSON.stringify(this.updatedConcept))
    };
  },
  methods: {
    updateConceptByPredicate(event: { predicate: string; data: any }) {
      this.conceptEditable[event.predicate] = event.data;
    }
  }
});
</script>

<style scoped>
.save-button {
  margin-left: 0.5em;
}

.p-tabview {
  padding-top: 3px;
}

.p-card {
  box-shadow: unset;
  height: 100%;
}

.editor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
  grid-template-areas:
    "iri name code"
    "description description description"
    "version status scheme"
    "imlang imlang imlang";
  column-gap: 7px;
  height: 100%;
}

.iri {
  grid-area: iri;
}

.name {
  grid-area: name;
}

.code {
  grid-area: code;
}

.description {
  grid-area: description;
}

.version {
  grid-area: version;
}

.status {
  grid-area: status;
}

.scheme {
  grid-area: scheme;
}

.imlang-container {
  grid-area: imlang;
}

.p-field {
  height: fit-content;
}

.float-label-container {
  margin-top: 1.5rem;
}
</style>
