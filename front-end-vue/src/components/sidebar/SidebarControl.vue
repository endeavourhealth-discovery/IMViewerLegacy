<template>
  <span class="p-input-icon-left" style="width: 100%">
    <i class="pi pi-search" />
    <InputText
      type="text"
      v-model="searchTerm"
      @input="this.active = 2"
      @change="search()"
      placeholder="Search"
      class="p-inputtext-lg"
      autoWidth="false"
      style="width: 100%"
    />
  </span>

  <TabView class="sidemenu" v-model:activeIndex="active">
    <TabPanel>
      <template #header>
        <font-awesome-icon
          :icon="['fas', 'project-diagram']"
          style="padding: 1px"
        />
        <span>Hierarchy</span>
      </template>
      <Hierarchy />
    </TabPanel>
    <TabPanel>
      <template #header>
        <font-awesome-icon :icon="['fas', 'history']" style="padding: 1px" />
        <span>History</span>
      </template>
      <History />
    </TabPanel>
    <TabPanel>
      <template #header>
        <font-awesome-icon :icon="['fas', 'search']" style="padding: 1px" />
        <span>Search results</span>
      </template>

      <div class="p-fluid p-grid">
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

@Options({
  components: { Hierarchy, History, SearchResults, Filters }
})
export default class SidebarControl extends Vue {
  searchTerm = "";
  active = 0;
  async search() {
    const searchRequest = new SearchRequest();
    searchRequest.termFilter = this.searchTerm;
    searchRequest.sortBy = SortBy.Usage;
    searchRequest.page = 1;
    searchRequest.size = 100;
    searchRequest.schemeFilter = store.state.filters.selectedSchemes;
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

    store.dispatch("fetchSearchResults", searchRequest);
  }
}
</script>

<style>
.sidemenu .p-tabview-panels {
  height: calc(100vh - 270px);
}
</style>
