<template>
  <span class="p-input-icon-left" style="width: 100%">
    <i class="pi pi-search" />
    <InputText
      type="text"
      v-model="searchTerm"
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

      <DataTable :value="results" v-model:selection="selectedResult" @row-select="onNodeSelect" selectionMode="single" dataKey="iri" class="p-datatable-sm" style="height:50vh;overflow:auto;">
        <template #header>
            Results
        </template>
        <Column field="name" header="Name"></Column>
        <Column field="conceptType" header="Type"></Column>
        <Column field="scheme.name" header="Scheme"></Column>
    </DataTable>
      <!-- <SearchResults /> -->
    </TabPanel>
  </TabView>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Hierarchy from "@/components/sidebar/Hierarchy.vue";
import History from "@/components/sidebar/History.vue";
import SearchResults from "@/components/sidebar/SearchResults.vue";
import ConceptService from "@/services/ConceptService";
import { SearchRequest } from "@/models/search/SearchRequest";
import { SearchResponse } from "@/models/search/SearchResponse";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import { ConceptReference } from "@/models/ConceptReference";
import { SortBy } from "@/models/search/SortBy";
import { ConceptStatus } from "@/models/ConceptStatus";

@Options({
  components: { Hierarchy, History, SearchResults },
})
export default class SidebarControl extends Vue {
  searchTerm = "";
  results: SearchResponse = new SearchResponse();
  selectedResult = {} as ConceptReference;
  active = 0;

  async search() {
    this.active = 2;
    const searchRequest = new SearchRequest();
    searchRequest.termFilter = this.searchTerm;
    searchRequest.sortBy = SortBy.Usage;
    searchRequest.page = 1;
    searchRequest.size = 25;
    searchRequest.schemeFilter = [
    // {
    //     "iri":":891081000252108",
    //     "name":"Barts Cerner code",
    // },
    // {
    //     "iri":":891051000252101",
    //     "name":"CTV3 Code",
    // },
    {
        "iri":":891071000252105",
        "name":"Discovery code",
    },
    // {
    //     "iri":":891031000252107",
    //     "name":"EMIS local code",
    // },
    // {
    //     "iri":":581000252100",
    //     "name":"Homerton Cerner code",
    // },
    // {
    //     "iri":":891021000252109",
    //     "name":"ICD10 code",
    // },
    // {
    //     "iri":":891041000252103",
    //     "name":"OPCS4 code",
    // },
    // {
    //     "iri":":891141000252104",
    //     "name":"Read 2 code",
    // },
    {
        "iri":":891101000252101",
        "name":"Snomed-CT code",
    },
    // {
    //     "iri":":631000252102",
    //     "name":"TPP local codes",
    // },
    {
        "iri":":891111000252103",
        "name":"Term based code",
    }
  ];
    searchRequest.markIfDescendentOf = [":DiscoveryCommonDataModel", ":SemanticConcept", ":VSET_ValueSet"]
    // searchRequest.statusFilter = [ConceptStatus.Active, ConceptStatus.Draft];
    this.results = await (await ConceptService.advancedSearch(searchRequest)).data.concepts;
  }

  onNodeSelect() {
    const currentRoute = this.$route.name as RouteRecordName | undefined;
    console.log(this.selectedResult);
    this.$router.push({
      name: currentRoute,
      params: { selectedIri: this.selectedResult.iri }
    });
  }
}
</script>

<style>
.sidemenu .p-tabview-panels {
  height: calc(100vh - 270px);
}
</style>
