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

      <div class="p-fluid p-grid" style="height:100%;overflow:auto">
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
    searchRequest.schemeFilter = store.state.filters.selectedSchemes.map(s => s.iri);
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

    store.dispatch("fetchSearchResults", searchRequest);
  }
}
</script>

<style>
.sidemenu .p-tabview-panel {
  height: calc(100vh - 250px);
}
</style>
