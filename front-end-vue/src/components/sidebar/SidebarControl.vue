<template>
  <span class="p-input-icon-left search-bar">
    <i class="pi pi-search" />
    <InputText
      type="text"
      v-model="searchTerm"
      @input="debounceForSearch"
      placeholder="Search"
      class="p-inputtext-lg search-input"
      autoWidth="false"
    />
  </span>

  <TabView class="p-d-flex p-flex-column p-jc-start side-menu" v-model:activeIndex="active">
    <TabPanel>
      <template #header>
        <i class="fas fa-project-diagram icon-header" />
        <span>Hierarchy</span>
      </template>
      <Hierarchy />
    </TabPanel>
    <TabPanel>
      <template #header>
        <i class="fas fa-history icon-header" />
        <span>History</span>
      </template>
      <History />
    </TabPanel>
    <TabPanel>
      <template #header>
        <i class="fas fa-search icon-header" />
        <span>Search results</span>
      </template>

      <div class="p-fluid p-d-flex p-flex-column p-jc-between results-filter-container">
        <SearchResults />
        <Filters :search="search" />
      </div>
    </TabPanel>
  </TabView>
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
}
</script>

<style scoped>

.side-menu {
  flex-grow: 6;
}

.side-menu >>> .p-tabview-panels {
  flex-grow: 6;
}

.side-menu >>> .p-tabview-panel {
  height: 100%;
  overflow-y: auto;
}

.results-filter-container {
  height: 100%;
}

.search-bar {
  width: 100%;
}

.search-input {
  width: 100%;
}

.icon-header {
  padding: 1px;
}

.p-tabview-panel {
  overflow-x: hidden;
}
</style>
