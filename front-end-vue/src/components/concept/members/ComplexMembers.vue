<template>
  <div v-if="loading">
    <ProgressSpinner />
  </div>
  <div v-else v-for="member in complexMembers" :key="member" id="complex-strings-container">
    <p id="html-container" v-html="member"></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "ComplexMembers",
  props: {
    conceptIri: { type: String, required: true }
  },
  watch: {
    async conceptIri() {
      await this.init();
    }
  },
  async mounted() {
    await this.init();
  },
  data() {
    return {
      complexMembers: {} as any,
      loading: false
    };
  },
  methods: {
    init() {
      this.getComplexMembers();
    },

    async getComplexMembers() {
      this.loading = true;
      const result = await EntityService.getComplexMembers(this.conceptIri);
      if (result) this.complexMembers = result.data;
      this.loading = false;
    }
  }
});
</script>

<style scoped>
#complex-strings-container {
  width: 100%;
  padding: 1rem;
}

#complex-strings-container ::v-deep(p) {
  margin-bottom: 0 !important;
}
</style>
