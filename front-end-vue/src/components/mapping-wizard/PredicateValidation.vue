<template>
  <Card id="container">
    <template #title> New predicates that will be created </template>
    <template #content>
      <Listbox
        :options="newPredicates"
        :emptyMessage="loading ? 'Loading' : 'No new predicates'"
      />
    </template>
  </Card>
  <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
    <Button label="Back" @click="prevPage" />
    <Button label="Next" @click="nextPage" :loading="loading" />
  </div>
</template>

<script lang="ts">
import { MappingFormObject } from "@/models/mapping/MappingFormObject";
import LoggerService from "@/services/LoggerService";
import MappingService from "@/services/MappingService";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "PredicateValidation",
  emits: ["next-page", "prev-page"],
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
      newPredicates: [],
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    this.newPredicates = await this.getNewPredicates();
    this.loading = false;
  },
  methods: {
    async getNewPredicates() {
      return await MappingService.getNewPredicates(
        this.getNewPredicateFormData()
      );
    },
    getNewPredicateFormData(): FormData {
      const formData = new FormData();
      formData.append("mapDocument", this.formObject.mapDocument);
      return formData;
    },
    async nextPage() {
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
  height: calc(100vh - 19rem);
  width: 98%;
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
