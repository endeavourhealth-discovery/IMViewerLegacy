<template>
  <Card id="create-definition-container">
    <template #title>
      <span class="title">Definition</span>
    </template>
    <template #content>
      <div class="p-fluid form-content">
        <div class="p-field">
          <label for="name">Name</label>
          <InputText v-model="name" id="name" type="text" @blur="setIri" />
        </div>
        <div class="p-field">
          <label for="scheme">Iri</label>
          <InputText v-model="iri" id="iri" type="text" disabled />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="footer">
        <StepsButtonBar :pageIndex="pageIndex" @clearForm="handleClear" @nextPage="handleNext" @previousPage="handlePrev" />
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { IM } from "@/vocabulary/IM";
import { defineComponent, PropType } from "vue";
import StepsButtonBar from "@/components/creator/StepsButtonBar.vue";

export default defineComponent({
  name: "DefinitionForm",
  props: { formData: { type: Object as PropType<any> }, pageIndex: { type: Number } },
  emits: ["prevPage", "nextPage"],
  components: { StepsButtonBar },
  data() {
    return {
      name: "",
      iri: IM.NAMESPACE
    };
  },
  methods: {
    handleNext() {
      const data = { definition: { name: this.name, iri: this.iri } };
      this.$emit("nextPage", data);
    },

    handleClear() {
      this.name = "";
      this.iri = IM.NAMESPACE;
    },

    handlePrev() {
      const data = { definition: { name: this.name, iri: this.iri } };
      this.$emit("prevPage", data);
    },

    setIri() {
      this.iri = IM.NAMESPACE + Math.floor(Math.random() * 1000000);
    }
  }
});
</script>

<style scoped>
#create-definition-container {
  height: calc(100% - 53px);
}

#create-definition-container {
  height: calc(100% - 53px);
}

#create-definition-container ::v-deep(.p-card-body) {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
}

#create-definition-container ::v-deep(.p-card-content) {
  flex-grow: 100;
  overflow-y: auto;
}
</style>
