<template>
  <div class="p-col-3" id="side-menu">
    <div id="tab">
      <span class="p-input-icon-left" id="search-bar" style="margin-bottom: 0.2em">
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
      <TabView v-model:activeIndex="active">
        <TabPanel>
          <template #header>
            <i style="padding: 1px" class="fas fa-search icon-header" aria-hidden="true" />
            <span>Search Results</span>
          </template>
          <CatalogueSearchResults :loading="loading" :searchResults="searchResults" />
          <CatalogueFilters v-if="typeOptions.length" :typeOptions="typeOptions" @typesSelected="updateTypes" />
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
  computed: { ...mapState(["catalogueSearchTerm"]) },
  // watch: {
  //   async catalogueSearchTerm() {
  //     await this.getSearchResult();
  //   }
  // },
  async mounted() {
    if (this.catalogueSearchTerm) {
      await this.getSearchResult();
    }
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
    }
  }
});
</script>

<style scoped></style>
