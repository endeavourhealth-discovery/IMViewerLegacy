<template>
  <span id="member-search-bar">
    <i class="pi pi-search" aria-hidden="true" />
    <InputText
      type="text"
      v-model="searchTerm"
      @input="debounceForSearch"
      placeholder="Search"
      class="p-inputtext"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SearchRequest } from "@/models/search/SearchRequest";
import { SortBy } from "@/models/search/SortBy";
import { ConceptStatus } from "@/models/ConceptStatus";
import { ConceptType } from "@/models/search/ConceptType";
import { IM } from "@/vocabulary/IM";
import axios from "axios";
import LoggerService from "@/services/LoggerService";
import ConceptService from "@/services/ConceptService";

export default defineComponent({
  name: "AddMember",
  data() {
    return {
      searchTerm: "",
      debounce: 0,
      loading: false,
      request: null as any,
      searchResults: null as any
    };
  },
  methods: {
    async search(): Promise<void> {
      if (this.searchTerm.length > 2) {
        this.loading = true;
        const searchRequest = new SearchRequest();
        searchRequest.termFilter = this.searchTerm;
        searchRequest.sortBy = SortBy.Usage;
        searchRequest.page = 1;
        searchRequest.size = 100;

        searchRequest.schemeFilter = [
          IM.DISCOVERY_CODE,
          IM.CODE_SCHEME_SNOMED,
          IM.CODE_SCHEME_TERMS
        ];
        searchRequest.markIfDescendentOf = [
          ":DiscoveryCommonDataModel",
          ":SemanticConcept",
          ":VSET_ValueSet"
        ];
        searchRequest.statusFilter = [
          ConceptStatus.Active,
          ConceptStatus.Draft
        ];
        searchRequest.typeFilter = [ConceptType.Class];

        if (this.request) {
          await this.request.cancel();
        }

        const axiosSource = axios.CancelToken.source();
        this.request = { cancel: axiosSource.cancel, msg: "Loading..." };

        await ConceptService.advancedSearch(searchRequest, axiosSource.token)
          .then(res => {
            this.searchResults = res.data.concepts;
            this.loading = false;
          })
          .catch(err => {
            if (!err.message) {
              LoggerService.info(undefined, "axios request cancelled");
            } else {
              LoggerService.error(undefined, err);
            }
            this.loading = false;
          });
      }
    },

    debounceForSearch(): void {
      clearTimeout(this.debounce);
      this.debounce = window.setTimeout(() => {
        this.search();
      }, 600);
    }
  }
});
</script>

<style scoped></style>
