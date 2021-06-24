<template>
  <div id="add-member-container">
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
    <PickList
      v-model="pickListData"
      dataKey="code"
      :responsive="false"
      listStyle="height:80vh"
      @move-to-target="selectedUpdated"
      @move-to-source="selectedUpdated"
      @move-all-to-source="selectedUpdated"
      @move-all-to-target="selectedUpdated"
    >
      <template #sourceHeader>
        <div class="header-container">
          <span>Search results</span>
        </div>
      </template>
      <template #targetHeader>
        <div class="header-container">
          <span>Selected members</span>
        </div>
      </template>
      <template v-if="!loading" #item="slotProps">
        <div class="member-container">
          <p class="member-name">{{ slotProps.item.concept.name }}</p>
        </div>
      </template>
      <template v-else #item>
        <div class="member-container">
          <ProgressSpinner />
        </div>
      </template>
    </PickList>
  </div>
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
  props: ["selectedColumn", "included", "excluded"],
  emits: ["selected-updated"],
  watch: {
    searchResults(newValue) {
      this.pickListData[0] = newValue;
    }
  },
  data() {
    return {
      searchTerm: "",
      debounce: 0,
      loading: false,
      request: null as any,
      searchResults: null as any,
      pickListData: [[], []] as any
    };
  },
  methods: {
    async search(): Promise<void> {
      if (this.searchTerm.length > 2) {
        this.loading = true;
        this.pickListData[0] = [{ code: "Loading", name: "Loading..." }];
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
            this.searchResults = this.removeDuplicates(res.data.concepts);
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
    },

    removeDuplicates(array: any): any[] {
      const added: any = [];
      return array
        .filter((obj: any) => {
          if (added.indexOf(obj.code) === -1) {
            added.push(obj.code);
            return obj;
          }
        })
        .map((obj: any) => {
          return {
            code: obj.code,
            concept: { "@id": obj.iri, name: obj.name },
            scheme: obj.scheme
          };
        });
    },

    selectedUpdated(): void {
      this.$emit("selected-updated", this.pickListData[1]);
    }
  }
});
</script>

<style scoped></style>
