<template>
  <div class="panel-content">
    <h2>New predicates that will be created.</h2>

    <Listbox v-model="selectedCity" :options="newPredicates" />
  </div>
  <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
    <Button label="Back" @click="prevPage" />
    <Button label="Next" @click="nextPage" />
  </div>
</template>

<script lang="ts">
import { MappingFormObject } from "@/models/mapping/MappingFormObject";
import MappingService from "@/services/MappingService";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "PredicateValidation",
  props: {
    formObject: {
      type: Object as PropType<MappingFormObject>,
      required: true,
    },
  },
  computed: {},
  data() {
    return {
      pageIndex: 3,
      newPredicates: [
        
      ],
    };
  },
  async mounted() {
    this.newPredicates = await this.getNewPredicates();
  },
  methods: {
    async getNewPredicates() {
      return await MappingService.getNewPredicates(this.getFormData());
    },
    getFormData(): FormData {
      const formData = new FormData();
      formData.append("mapDocument", this.formObject.mapDocument);
      return formData;
    },
    nextPage() {
      this.$emit("next-page", {
        pageIndex: this.pageIndex,
      });
    },
    prevPage() {
      this.$emit("prev-page", {
        pageIndex: this.pageIndex,
      });
    },
  },
});
</script>

<style scoped>
#container {
  margin: 1rem;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
}

.loading-container {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

#button-bar {
  padding: 0 2rem 1rem 0;
  gap: 0.5rem;
}
</style>
