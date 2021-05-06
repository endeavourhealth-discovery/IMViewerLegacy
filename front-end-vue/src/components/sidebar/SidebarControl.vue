<template>
  <div class="p-d-flex p-flex-column p-jc-start" id="side-bar">
    <span class="p-input-icon-left" id="search-bar">
      <i class="pi pi-search" aria-hidden="true" />
      <InputText
        type="text"
        v-model="searchTerm"
        @input="debounceForSearch"
        placeholder="Search"
        class="p-inputtext-lg search-input"
        autoWidth="false"
      />
    </span>

    <TabView
      class="p-d-flex p-flex-column p-jc-start"
      id="side-menu"
      v-model:activeIndex="active"
    >
      <TabPanel>
        <template #header>
          <i class="fas fa-project-diagram icon-header" aria-hidden="true" />
          <span>Hierarchy</span>
        </template>
        <Hierarchy />
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
          <i class="fas fa-search icon-header" aria-hidden="true" />
          <span>Search results</span>
        </template>

        <div
          class="p-fluid p-d-flex p-flex-column p-jc-between results-filter-container"
        >
          <SearchResults />
          <Filters :search="search" />
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Hierarchy from "@/components/sidebar/Hierarchy.vue";
import History from "@/components/sidebar/History.vue";
import SearchResults from "@/components/sidebar/SearchResults.vue";
import Filters from "@/components/sidebar/Filters.vue";
import { SearchRequest } from "@/models/search/SearchRequest";
import { SortBy } from "@/models/search/SortBy";
import { ConceptStatus } from "@/models/ConceptStatus";
import store from "@/store/index";
import { ConceptType } from "@/models/search/ConceptType";
import LoggerService from "@/services/LoggerService";
import axios from "axios";

@Options({
  name: "SidebarControl",
  components: { Hierarchy, History, SearchResults, Filters }
})
export default class SidebarControl extends Vue {
  searchTerm = "";
  active = 0;
  debounce = 0;
  request!: any;
  windowHeight = 0;
  windowWidth = 0;
  headerHeight = 0;

  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });

    this.setContainerHeights();
  }

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }

  onResize() {
    this.setContainerHeights();
  }

  async search() {
    if (this.searchTerm.length > 2) {
      store.commit("updateLoading", { key: "searchResults", value: true });
      this.active = 2;
      const searchRequest = new SearchRequest();
      searchRequest.termFilter = this.searchTerm;
      searchRequest.sortBy = SortBy.Usage;
      searchRequest.page = 1;
      searchRequest.size = 100;
      searchRequest.schemeFilter = store.state.filters.selectedSchemes.map(
        s => s.iri
      );
      searchRequest.markIfDescendentOf = [
        ":DiscoveryCommonDataModel",
        ":SemanticConcept",
        ":VSET_ValueSet"
      ];

      searchRequest.statusFilter = [];
      store.state.filters.selectedStatus.forEach(status => {
        if (status == "Active") {
          searchRequest.statusFilter.push(ConceptStatus.Active);
        }
        if (status == "Draft") {
          searchRequest.statusFilter.push(ConceptStatus.Draft);
        }
        if (status == "Inactive") {
          searchRequest.statusFilter.push(ConceptStatus.Inactive);
        }
      });

      searchRequest.typeFilter = [];
      store.state.filters.selectedTypes.forEach(type => {
        if (type == "Class") {
          searchRequest.typeFilter.push(ConceptType.Class);
        }
        if (type == "ObjectProperty") {
          searchRequest.typeFilter.push(ConceptType.ObjectProperty);
        }
        if (type == "DataProperty") {
          searchRequest.typeFilter.push(ConceptType.DataProperty);
        }
        if (type == "DataType") {
          searchRequest.typeFilter.push(ConceptType.DataType);
        }
        if (type == "Annotation") {
          searchRequest.typeFilter.push(ConceptType.Annotation);
        }
        if (type == "Individual") {
          searchRequest.typeFilter.push(ConceptType.Individual);
        }
        if (type == "Record") {
          searchRequest.typeFilter.push(ConceptType.Record);
        }
        if (type == "ValueSet") {
          searchRequest.typeFilter.push(ConceptType.ValueSet);
        }
        if (type == "Folder") {
          searchRequest.typeFilter.push(ConceptType.Folder);
        }
        if (type == "Legacy") {
          searchRequest.typeFilter.push(ConceptType.Legacy);
        }
      });
      if (this.request) {
        await this.request.cancel();
      }
      const axiosSource = axios.CancelToken.source();
      this.request = { cancel: axiosSource.cancel, msg: "Loading..." };
      store
        .dispatch("fetchSearchResults", {
          searchRequest: searchRequest,
          cancelToken: axiosSource.token
        })
        .then(res => {
          if (res === "false") {
            store.commit("updateLoading", {
              key: "searchResults",
              value: false
            });
            this.$toast.add(
              LoggerService.error("Search results server request failed")
            );
          } else if (res === "true") {
            store.commit("updateLoading", {
              key: "searchResults",
              value: false
            });
          }
        });
    } else {
      this.active = 0;
    }
  }

  debounceForSearch() {
    clearTimeout(this.debounce);
    this.debounce = window.setTimeout(() => {
      this.search();
    }, 600);
  }

  setContainerHeights() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    const html = document.documentElement;
    const currentFontSize = parseFloat(
      window.getComputedStyle(html, null).getPropertyValue("font-size")
    );
    const header = document.getElementById("header-home");
    if (header) {
      this.headerHeight = header.offsetHeight;
    }
    const sidebar = document.getElementById("side-bar");
    if (sidebar) {
      sidebar.style.maxHeight =
        this.windowHeight - this.headerHeight - currentFontSize * 2 + "px";
    }
    const fixedSidebar = document.getElementById("side-bar");
    const searchBar = document.getElementById("search-bar");
    const sideMenu = document.getElementById("side-menu");
    if (searchBar && fixedSidebar && sideMenu) {
      sideMenu.style.maxHeight =
        fixedSidebar.offsetHeight - searchBar.offsetHeight + "px";
    }
  }
}
</script>

<style scoped>
#side-bar {
  /* padding: 7px; */
  grid-area: sidebar;
  height: 100%;
  width: 30vw;
}

#side-menu {
  /* max-height: calc(100% - 41px); */
  flex-grow: 100;
}

#side-menu ::v-deep(.p-tabview-panels) {
  flex-grow: 6;
  overflow-y: auto;
}

#side-menu ::v-deep(.p-tabview-panel) {
  height: 100%;
  /* overflow-y: auto; */
}

.results-filter-container {
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

.p-tabview-panel {
  overflow-x: hidden;
}
</style>
