<template>
  <div id="query-search-container">
    <h3>Expression constraints language search</h3>
    <h5 class="info">ECL expression:</h5>
    <div class="text-copy-container">
      <Textarea v-model="queryString" id="query-string-container" placeholder="Enter expression here or use the ECL builder to generate your search..." />
      <Button
        icon="far fa-copy"
        v-tooltip.left="'Copy to clipboard'"
        v-clipboard:copy="copyToClipboard()"
        v-clipboard:success="onCopy"
        v-clipboard:error="onCopyError"
      />
    </div>
    <div class="button-container">
      <Button label="ECL builder" @click="showBuilder" class="p-button-help" />
      <Button label="Search" @click="search" class="p-button-primary" :disabled="!queryString.length" />
    </div>
    <div class="results-container">
      <SearchResults :searchResults="searchResults" :loading="loading" />
    </div>
  </div>
  <Builder :showDialog="showDialog" @ECLSubmitted="updateECL" @closeDialog="showDialog = false" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Builder from "@/components/sidebar/expressionConstraintsSearch/Builder.vue";
import SearchResults from "@/components/sidebar/SearchResults.vue";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "ExpressionConstraintsSearch",
  components: {
    Builder,
    SearchResults
  },
  data() {
    return {
      queryString: "",
      showDialog: false,
      searchResults: [] as any[],
      loading: false
    };
  },
  methods: {
    updateECL(data: string) {
      this.queryString = data;
      this.showDialog = false;
    },

    showBuilder() {
      this.showDialog = true;
    },

    async search() {
      console.log("Searching...");
      if (this.queryString) {
        this.loading = true;
        this.searchResults = await EntityService.ECLSearch(this.queryString);
        console.log(this.searchResults);
        this.loading = false;
      }
    },

    copyToClipboard(): string {
      return this.queryString;
    },

    onCopy(): void {
      this.$toast.add(LoggerService.success("Value copied to clipboard"));
    },

    onCopyError(): void {
      this.$toast.add(LoggerService.error("Failed to copy value to clipboard"));
    }
  }
});
</script>

<style scoped>
#query-search-container {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
}

#query-builder-container {
  width: 100%;
  flex-grow: 100;
  overflow: auto;
}

#query-build {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  margin: 0 0 1rem 0;
}

#next-option-container {
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-content: center;
}

#query-string-container {
  width: 100%;
  height: 10rem;
  overflow: auto;
  flex-grow: 100;
}

.info {
  align-self: flex-start;
  margin: 0 0 0.5rem 0;
}

.button-container {
  display: flex;
  flex-flow: row;
  gap: 1rem;
  margin: 0 0 1rem 0;
}

.results-container {
  width: 100%;
  flex-grow: 10;
}

.text-copy-container {
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  margin: 0 0 1rem 0;
}
</style>
