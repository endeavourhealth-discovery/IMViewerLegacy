<template>
  <div id="query-search-container">
    <h3 class="title">Expression constraints language search</h3>
    <h5 class="info">ECL expression:</h5>
    <div class="text-copy-container">
      <Textarea
        v-model="queryString"
        id="query-string-container"
        placeholder="Enter expression here or use the ECL builder to generate your search..."
        :class="eclError ? 'p-invalid' : ''"
      />
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
      <p v-if="searchResults.length > 1000" class="result-summary">{{ totalCount }} results found. Display limited to first 1000.</p>
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
import { ConceptSummary } from "@/models/search/ConceptSummary";
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";

export default defineComponent({
  name: "ExpressionConstraintsSearch",
  components: {
    Builder,
    SearchResults
  },
  watch: {
    queryString() {
      this.eclError = false;
    }
  },
  async mounted() {
    window.addEventListener("resize", this.onResize);
    await this.onResize();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      queryString: "",
      showDialog: false,
      searchResults: [] as ConceptSummary[],
      totalCount: 0,
      eclError: false,
      loading: false
    };
  },
  methods: {
    async onResize() {
      await this.$nextTick();
      this.setResultsHeight();
    },

    updateECL(data: string) {
      this.queryString = data;
      this.showDialog = false;
    },

    showBuilder() {
      this.showDialog = true;
    },

    async search() {
      if (this.queryString) {
        this.loading = true;
        const result = await EntityService.ECLSearch(this.queryString, false, 1000);
        if (isObjectHasKeys(result, ["entities", "count", "page"])) {
          this.searchResults = result.entities;
          this.totalCount = result.count;
        } else {
          this.eclError = true;
        }
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
    },

    setResultsHeight(): void {
      const container = document.getElementById("query-search-container") as HTMLElement;
      if (!container) {
        LoggerService.error(undefined, "Failed to set ecl results table height");
        return;
      }
      const html = document.documentElement;
      const currentFontSize = parseFloat(window.getComputedStyle(html, null).getPropertyValue("font-size"));
      const title = container.getElementsByClassName("title")[0] as HTMLElement;
      const subTitle = container.getElementsByClassName("info")[0] as HTMLElement;
      const eclContainer = container.getElementsByClassName("text-copy-container")[0] as HTMLElement;
      const buttonContainer = container.getElementsByClassName("button-container")[0] as HTMLElement;
      const resultsContainer = container.getElementsByClassName("results-container")[0] as HTMLElement;
      let height = container.getBoundingClientRect().height;
      if (title) {
        height -= title.getBoundingClientRect().height;
      }
      if (subTitle) {
        height -= subTitle.getBoundingClientRect().height;
      }
      if (eclContainer) {
        height -= eclContainer.getBoundingClientRect().height;
      }
      if (buttonContainer) {
        height -= buttonContainer.getBoundingClientRect().height;
      }
      if (currentFontSize) {
        height -= currentFontSize * 3;
      }
      if (resultsContainer) {
        resultsContainer.style.height = height + "px";
        resultsContainer.style.maxHeight = height + "px";
      }
    }
  }
});
</script>

<style scoped>
#query-search-container {
  height: 100%;
  /* overflow: auto; */
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
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
}

.text-copy-container {
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  margin: 0 0 1rem 0;
}
</style>
