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
      <div class="footer button-bar">
        <!-- <Button
          v-if="pageIndex > 0"
          label="Previous"
          icon="fas fa-chevron-circle-left"
          class=""
          @click="handlePrevious"
        /> -->
        <Button
          label="Clear"
          icon="fas fa-undo-alt"
          class="p-button-warning"
          @click="handleClear"
        />
        <Button
          label="Next"
          icon="fas fa-chevron-circle-right"
          class=""
          @click="handleNext"
        />
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { IM } from "@/vocabulary/IM";
import { defineComponent } from "vue";

export default defineComponent({
  name: "DefinitionForm",
  props: ["formData", "pageIndex"],
  emits: ["prevPage", "nextPage"],
  data() {
    return {
      name: "",
      iri: IM.NAMESPACE
    };
  },
  methods: {
    handleNext() {
      const formData = { name: this.name, iri: this.iri };
      this.$emit("nextPage", { formData: formData, pageIndex: this.pageIndex });
    },

    handleClear() {
      this.name = "";
      this.iri = IM.NAMESPACE;
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

.footer {
  display: flex;
  flex-flow: row nowrap;
  gap: 7px;
  justify-content: flex-end;
  align-items: center;
}
</style>
