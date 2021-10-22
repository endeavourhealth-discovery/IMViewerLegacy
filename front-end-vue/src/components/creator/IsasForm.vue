<template>
  <Card id="create-isas-container">
    <template #title>
      <span class="title">Isa's</span>
    </template>
    <template #content>
      <p>Isas content placeholder</p>
      <!-- <div class="p-fluid form-content">
        <div class="p-field">
          <label for="name">Name</label>
          <InputText v-model="name" id="name" type="text" @blur="setIri" />
        </div>
        <div class="p-field">
          <label for="scheme">Iri</label>
          <InputText v-model="iri" id="iri" type="text" disabled />
        </div>
      </div> -->
    </template>
    <template #footer>
      <div class="footer">
        <StepsButtonBar :pageIndex="pageIndex" @clearForm="handleClear" @nextPage="handleNext" @previousPage="handlePrev" />
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import StepsButtonBar from "@/components/creator/StepsButtonBar.vue";

export default defineComponent({
  name: "IsasForm",
  props: { formData: { type: Object as PropType<any> }, pageIndex: { type: Number } },
  emits: ["prevPage", "nextPage"],
  components: { StepsButtonBar },
  data() {
    return {
      isa: ""
    };
  },
  methods: {
    handleNext() {
      const data = { isa: this.isa };
      this.$emit("nextPage", data);
    },

    handleClear() {
      console.log("clear");
    },

    handlePrev() {
      const data = { isa: this.isa };
      this.$emit("prevPage", data);
    }
  }
});
</script>

<style scoped>
#create-isas-container {
  height: calc(100% - 53px);
}

#create-isas-container ::v-deep(.p-card-body) {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
}

#create-isas-container ::v-deep(.p-card-content) {
  flex-grow: 100;
  overflow-y: auto;
}
</style>
