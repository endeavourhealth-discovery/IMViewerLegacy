<template>
  <div id="side-bar">
    <span class="p-input-icon-left" id="search-bar">
      <i class="pi pi-search" aria-hidden="true" />
      <InputText
        type="text"
        v-model="searchRequest"
        @keydown="checkKey($event.code)"
        @input="debounceForSearch"
        placeholder="Search"
        class="p-inputtext-lg search-input"
        autoWidth="false"
      />
    </span>
    <TabView v-model:activeIndex="active" id="side-menu">
      <TabPanel>
        <template #header>
          <i class="fas fa-search icon-header" aria-hidden="true" />
          <span>Search Results</span>
        </template>
        <div class="p-fluid results-filter-container">
          <CatalogueSearchResults :loading="loading" :searchResults="searchResults" @searchResultSelected="updateHistory" />
          <CatalogueFilters v-if="typeOptions.length" :typeOptions="typeOptions" @typesSelected="updateTypes" />
        </div>
      </TabPanel>
      <TabPanel>
        <template #header>
          <i class="fas fa-history icon-header" aria-hidden="true" />
          <span>History</span>
        </template>
        <CatalogueHistory :history="history" />
      </TabPanel>
    </TabView>
  </div>
</template>

<script lang="ts">
import CatalogueService from "@/services/CatalogueService";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapState } from "vuex";
import CatalogueSearchResults from "@/components/catalogue/catalogueSideBar/CatalogueSearchResults.vue";
import CatalogueFilters from "@/components/catalogue/catalogueSideBar/CatalogueFilters.vue";
import CatalogueHistory from "@/components/catalogue/catalogueSideBar/CatalogueHistory.vue";
import { isArrayHasLength, isObject } from "@/helpers/DataTypeCheckers";
import axios from "axios";

export default defineComponent({
  name: "CatalogueSideBar",
  props: { history: { type: Object as any, required: false }, typeOptions: { type: Array as PropType<any[]>, required: true } },
  components: { CatalogueSearchResults, CatalogueFilters, CatalogueHistory },
  emits: { updateHistory: (payload: any) => true },
  computed: { ...mapState(["catalogueSearchTerm"]) },
  // watch: {
  //   async catalogueSearchTerm() {
  //     await this.getSearchResult();
  //   }
  // },
  async mounted() {
    window.addEventListener("resize", this.onResize);
    if (this.catalogueSearchTerm) {
      await this.getSearchResult();
    }
    this.setContainerHeights();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      searchRequest: "",
      searchResults: [] as any[],
      selectedTypes: [] as any[],
      active: 0,
      selected: {} as any,
      debounce: 0,
      loading: false,
      request: {} as { cancel: any; msg: string }
    };
  },
  methods: {
    onResize(): void {
      this.setContainerHeights();
    },

    async getSearchResult() {
      this.loading = true;
      if (isObject(this.request) && isArrayHasLength(Object.keys(this.request))) {
        await this.request.cancel({ status: 499, message: "Search cancelled by user" });
      }
      const axiosSource = axios.CancelToken.source();
      this.request = { cancel: axiosSource.cancel, msg: "Loading..." };
      const selectedTypeIris = this.selectedTypes.map(type => type.iri);
      this.searchResults = await CatalogueService.getSearchResult(this.catalogueSearchTerm, selectedTypeIris, axiosSource.token);
      this.loading = false;
    },

    debounceForSearch(): void {
      clearTimeout(this.debounce);
      this.debounce = window.setTimeout(() => {
        this.getSearchResult;
      }, 600);
    },

    updateTypes(types: string[]) {
      this.selectedTypes = types;
    },

    checkKey(event: any) {
      if (this.searchRequest.length > 2 && event === "Enter") {
        this.$store.commit("updateCatalogueSearchTerm", this.searchRequest);
        this.getSearchResult();
      }
    },

    updateHistory(historyItem: any) {
      this.$emit("updateHistory", historyItem);
    },

    setContainerHeights(): void {
      const windowHeight = window.innerHeight;
      const html = document.documentElement;
      const currentFontSize = parseFloat(window.getComputedStyle(html, null).getPropertyValue("font-size"));
      const sidebar = document.getElementById("side-bar") as HTMLElement;
      if (sidebar) {
        sidebar.style.maxHeight = windowHeight - currentFontSize * 2 + "px";
      }
      const fixedSidebar = document.getElementById("side-bar") as HTMLElement;
      const searchBar = document.getElementById("search-bar") as HTMLElement;
      const sideMenu = document.getElementById("side-menu") as HTMLElement;
      if (searchBar && fixedSidebar && sideMenu) {
        sideMenu.style.maxHeight = fixedSidebar.getBoundingClientRect().height - searchBar.getBoundingClientRect().height + "px";
      }
    }
  }
});
</script>

<style scoped>
#side-bar {
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  max-height: 100%;
  grid-area: sidebar;
  height: 100%;
  width: 30vw;
}

#side-menu {
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  flex-grow: 100;
}

#side-menu ::v-deep(.p-tabview-panels) {
  flex-grow: 6;
  overflow-y: auto;
}

#side-menu ::v-deep(.p-tabview-panel) {
  height: 100%;
}

.results-filter-container {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  height: 100%;
}

#search-bar {
  width: 100%;
}

.search-input {
  width: 100%;
}

.icon-header {
  margin: 0 4px 0 0;
}
</style>
