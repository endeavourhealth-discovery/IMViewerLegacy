<template>
  <div id="side-bar">
    <span class="p-input-icon-left search-bar">
      <i class="pi pi-search" aria-hidden="true" />
      <InputText
        type="text"
        v-model="searchTerm"
        @input="search"
        @keyup.enter="search"
        placeholder="Search"
        class="p-inputtext-lg search-input"
        autoWidth="false"
      />
    </span>

    <TabView class="side-menu" :style="'maxHeight: ' + sideMenuHeight + ';'" v-model:activeIndex="active" @tab-click="tabChange($event)">
      <TabPanel>
        <template #header>
          <i class="fas fa-sitemap icon-header" aria-hidden="true" />
          <span>Hierarchy</span>
        </template>
        <Hierarchy @showTree="active = 0" :active="active" />
      </TabPanel>
      <TabPanel>
        <template #header>
          <i class="fas fa-search icon-header" aria-hidden="true" />
          <span>Search results</span>
        </template>

        <div class="p-fluid results-filter-container">
          <SearchResults :searchResults="searchResults" :loading="loading" />
          <Filters :search="search" />
        </div>
      </TabPanel>
      <TabPanel>
        <template #header>
          <i class="fas fa-history icon-header" aria-hidden="true" />
          <span>History</span>
        </template>
        <History />
      </TabPanel>
      <TabPanel>
        <template #header>
          <i class="fas fa-search-plus icon-header" aria-hidden="true" />
          <span>ECL search</span>
        </template>
        <ExpressionConstraintsSearch />
      </TabPanel>
    </TabView>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Hierarchy from "@/components/sidebar/Hierarchy.vue";
import History from "@/components/sidebar/History.vue";
import SearchResults from "@/components/sidebar/SearchResults.vue";
import Filters from "@/components/sidebar/Filters.vue";
import ExpressionConstraintsSearch from "@/components/sidebar/ExpressionConstraintsSearch.vue";
import { SearchRequest } from "@/models/search/SearchRequest";
import { SortBy } from "@/models/search/SortBy";
import axios from "axios";
import { mapState } from "vuex";
import { TTIriRef } from "@/models/TripleTree";
import { EntityReferenceNode } from "@/models/EntityReferenceNode";
import { Namespace } from "@/models/Namespace";
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import { getContainerElementOptimalHeight } from "@/helpers/GetContainerElementOptimalHeight";

export default defineComponent({
  name: "SidebarControl",
  components: {
    Hierarchy,
    History,
    SearchResults,
    Filters,
    ExpressionConstraintsSearch
  },
  computed: mapState(["filterOptions", "selectedFilters", "searchResults", "focusHierarchy", "sidebarControlActivePanel"]),
  watch: {
    focusHierarchy(newValue) {
      if (newValue) {
        this.$store.commit("updateFocusHierarchy", false);
      }
    },
    sidebarControlActivePanel(newValue) {
      this.active = newValue;
    }
  },
  data() {
    return {
      loading: false,
      searchTerm: "",
      active: 0,
      debounce: 0,
      request: {} as { cancel: any; msg: string },
      sideMenuHeight: ""
    };
  },
  mounted() {
    window.addEventListener("resize", this.onResize);

    this.setContainerHeights();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    tabChange(event: any): void {
      this.$store.commit("updateSidebarControlActivePanel", event.index);
    },
    onResize(): void {
      this.setContainerHeights();
    },

    async search(): Promise<void> {
      // if (this.searchTerm.length > 2) {
        this.loading = true;
        this.$store.commit("updateSidebarControlActivePanel", 1);
        const searchRequest = new SearchRequest();
        searchRequest.termFilter = this.searchTerm;
        searchRequest.sortBy = SortBy.Usage;
        searchRequest.page = 1;
        searchRequest.size = 100;
        searchRequest.schemeFilter = this.selectedFilters.schemes.map((scheme: Namespace) => scheme.iri);

        searchRequest.statusFilter = [];
        this.selectedFilters.status.forEach((status: EntityReferenceNode) => {
          searchRequest.statusFilter.push(status["@id"]);
        });

        searchRequest.typeFilter = [];
        this.selectedFilters.types.forEach((type: TTIriRef) => {
          searchRequest.typeFilter.push(type["@id"]);
        });
        if (isObjectHasKeys(this.request, ["cancel", "msg"])) {
          await this.request.cancel({ status: 499, message: "Search cancelled by user" });
        }
        const axiosSource = axios.CancelToken.source();
        this.request = { cancel: axiosSource.cancel, msg: "Loading..." };
        await this.$store.dispatch("fetchSearchResults", {
          searchRequest: searchRequest,
          cancelToken: axiosSource.token
        });
        this.loading = false;
      // }
    },

    debounceForSearch(): void {
      clearTimeout(this.debounce);
      this.debounce = window.setTimeout(() => {
        this.search();
      }, 600);
    },

    setContainerHeights(): void {
      this.sideMenuHeight = getContainerElementOptimalHeight("side-bar", ["search-bar"], false);
    }
  }
});
</script>

<style scoped>
#side-bar {
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  max-height: calc(100vh - 2rem);
  grid-area: sidebar;
  height: calc(100vh - 2rem);
  width: 30vw;
}

.side-menu {
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  flex-grow: 100;
}

.side-menu ::v-deep(.p-tabview-panels) {
  flex-grow: 6;
  overflow-y: auto;
}

.side-menu ::v-deep(.p-tabview-panel) {
  height: 100%;
}

.results-filter-container {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  height: 100%;
}

.search-bar {
  width: 100%;
}

.search-input {
  width: 100%;
}

.icon-header {
  margin: 0 4px 0 0;
}

.p-tabview-panel {
  overflow-x: hidden;
}
</style>
