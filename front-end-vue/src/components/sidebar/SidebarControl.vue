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
        <div class="p-field p-col-12 p-md-12">
          <span class="p-float-label">
            <MultiSelect
              id="status"
              v-model="selectedStatus"
              @change="search()"
              :options="statusOptions"
              placeholder="Select Status"
              display="chip"
            />
            <label for="status">Select Status:</label>
          </span>
        </div>

        <div class="p-field p-col-12 p-md-12">
          <span class="p-float-label">
            <MultiSelect
              id="scheme"
              v-model="selectedSchemes"
              @change="search()"
              :options="schemeOptions"
              optionLabel="name"
              placeholder="Select Schemes"
              display="chip"
            />
            <label for="scheme">Select Scheme:</label>
          </span>
        </div>
      </div>
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
import { ConceptType } from "@/models/search/ConceptType";
import { ConceptStatus } from "@/models/ConceptStatus";
import { ConceptSummary } from "@/models/search/ConceptSummary";
import store from "@/store/index";
import { mapState } from "vuex";

@Options({
  components: { Hierarchy, History, SearchResults }
})
export default class SidebarControl extends Vue {
  searchTerm = "";
  // results: SearchResponse = new SearchResponse();
  // selectedResult = {} as ConceptSummary;
  active = 0;
  // hoveredResult = {} as ConceptSummary | any;

  statusOptions = ["Active", "Draft", "Inactive"];
  schemeOptions = [
    {
      iri: ":891081000252108",
      name: "Barts Cerner code"
    },
    {
      iri: ":891051000252101",
      name: "CTV3 Code"
    },
    {
      iri: ":891071000252105",
      name: "Discovery code"
    },
    {
      iri: ":891031000252107",
      name: "EMIS local code"
    },
    {
      iri: ":581000252100",
      name: "Homerton Cerner code"
    },
    {
      iri: ":891021000252109",
      name: "ICD10 code"
    },
    {
      iri: ":891041000252103",
      name: "OPCS4 code"
    },
    {
      iri: ":891141000252104",
      name: "Read 2 code"
    },
    {
      iri: ":891101000252101",
      name: "Snomed-CT code"
    },
    {
      iri: ":631000252102",
      name: "TPP local codes"
    },
    {
      iri: ":891111000252103",
      name: "Term based code"
    }
  ];
  selectedStatus = ["Active", "Draft"];
  selectedSchemes = [
    {
      iri: ":891071000252105",
      name: "Discovery code"
    },
    {
      iri: ":891101000252101",
      name: "Snomed-CT code"
    },
    {
      iri: ":891111000252103",
      name: "Term based code"
    }
  ];

  async search() {
    const searchRequest = new SearchRequest();
    searchRequest.termFilter = this.searchTerm;
    searchRequest.sortBy = SortBy.Usage;
    searchRequest.page = 1;
    searchRequest.size = 100;
    searchRequest.schemeFilter = this.selectedSchemes;
    searchRequest.markIfDescendentOf = [
      ":DiscoveryCommonDataModel",
      ":SemanticConcept",
      ":VSET_ValueSet"
    ];

    searchRequest.statusFilter = [];
    this.selectedStatus.forEach(status => {
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

  // getPerspectiveByConceptType(conceptType: ConceptType): any {
  //   switch (conceptType) {
  //     case ConceptType.ValueSet:
  //       return { name: "Valueset", icon: "tasks" };
  //     case ConceptType.Record:
  //     case ConceptType.DataProperty:
  //     case ConceptType.ObjectProperty:
  //       return { name: "Datamodel", icon: "sitemap" };
  //     default:
  //       return { name: "Ontology", icon: "lightbulb" };
  //   }
  // }

  // onNodeSelect() {
  //   this.$router.push({
  //     name: "Concept",
  //     params: { selectedIri: this.selectedResult.iri }
  //   });
  // }

  // toggle(event: any, data: any) {
  //   this.hoveredResult = data
  //   const x = this.$refs.op as any;
  //   x.toggle(event);
  // }
}
</script>

<style>
.sidemenu .p-tabview-panels {
  height: calc(100vh - 270px);
}
</style>
