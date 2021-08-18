<template>
  <InputText
    type="text"
    v-model="searchTerm"
    @input="debounceForSearch"
    @keydown="checkKey($event)"
    placeholder="Search"
    class="p-inputtext-lg search-input"
    autoWidth="true"
  />
  <div class="search-results-container">
    <DataTable
      v-if="searchResults.length"
      :value="searchResults"
      v-model:selection="selectedResult"
      @row-select="onNodeSelect"
      selectionMode="single"
      class="p-datatable-sm"
      :scrollable="true"
      removableSort
      :paginator="true"
      paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      :rows="15"
      @page="scrollToTop"
      :loading="loading"
    >
      <template #empty>
        None
      </template>
      <template #loading>
        Loading...
      </template>
      <Column field="name" header="Results">
        <template #body="slotProps">
          <div
            class="result-container"
            @mouseenter="showDetailsOverlay($event, slotProps.data)"
            @mouseleave="hideDetailsOverlay()"
          >
            <div class="result-icon-container">
              <i
                :class="getPerspectiveByConceptType(slotProps.data.entityType)"
                class="result-icon"
                :style="getColorByConceptType(slotProps.data.entityType)"
                aria-hidden="true"
              />
            </div>
            <div class="result-text-container">
              {{ slotProps.data.match }}<br />
              <small style="color:lightgrey">{{ slotProps.data.name }}</small>
            </div>
          </div>
        </template>
      </Column>
    </DataTable>

    <OverlayPanel
      ref="detailsOP"
      id="overlay-panel"
      style="width: 25vw"
      :dismissable="true"
    >
      <div class="result-overlay">
        <div class="left-side" v-if="hoveredResult.iri">
          <p>
            <strong>Name: </strong>
            <span>
              {{ hoveredResult.name }}
            </span>
          </p>
          <p>
            <strong>Iri: </strong>
            <span style="word-break:break-all;">
              {{ hoveredResult.iri }}
            </span>
          </p>
          <p>
            <strong>Code: </strong>
            <span>
              {{ hoveredResult.code }}
            </span>
          </p>
        </div>
        <div class="right-side" v-if="hoveredResult.iri">
          <p>
            <strong>Status: </strong>
            <span v-if="hoveredResult.status">
              {{ hoveredResult.status.name }}
            </span>
          </p>
          <p>
            <strong>Scheme: </strong>
            <span v-if="hoveredResult.scheme">
              {{ hoveredResult.scheme.name }}
            </span>
          </p>
          <p>
            <strong>Type: </strong>
            <span>
              {{ getConceptTypes(hoveredResult) }}
            </span>
          </p>
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { mapState } from "vuex";
import { SearchRequest } from "@/models/search/SearchRequest";
import { SortBy } from "@/models/search/SortBy";
import axios from "axios";
import LoggerService from "@/services/LoggerService";
import EntityService from "@/services/EntityService";
import {
  getColourFromType,
  getIconFromType
} from "@/helpers/ConceptTypeMethods";

export default defineComponent({
  name: "SearchMiniOverlay",
  emits: ["searchResultSelected"],
  computed: mapState(["filterOptions", "selectedFilters"]),
  data() {
    return {
      searchTerm: "",
      debounce: 0,
      request: null as any,
      loading: false,
      searchResults: [] as any[],
      selectedResult: {} as any,
      hoveredResult: {} as any
    };
  },
  methods: {
    debounceForSearch(): void {
      clearTimeout(this.debounce);
      this.debounce = window.setTimeout(() => {
        this.search();
      }, 600);
    },

    checkKey(event: any) {
      if (event.code === "Enter") {
        this.search();
      }
    },

    async search(): Promise<void> {
      if (this.searchTerm.length > 2) {
        const searchRequest = new SearchRequest();
        searchRequest.termFilter = this.searchTerm;
        searchRequest.sortBy = SortBy.Usage;
        searchRequest.page = 1;
        searchRequest.size = 100;
        searchRequest.schemeFilter = this.selectedFilters.schemes.map(
          (scheme: any) => scheme.iri
        );

        searchRequest.statusFilter = [];
        this.selectedFilters.status.forEach((status: any) => {
          searchRequest.statusFilter.push(status["@id"]);
        });

        searchRequest.typeFilter = [];
        this.selectedFilters.types.forEach((type: any) => {
          searchRequest.typeFilter.push(type["@id"]);
        });
        if (this.request) {
          await this.request.cancel();
        }
        const axiosSource = axios.CancelToken.source();
        this.request = { cancel: axiosSource.cancel, msg: "Loading..." };
        this.fetchSearchResults(searchRequest, axiosSource.token);
      }
    },

    async fetchSearchResults(searchRequest: SearchRequest, cancelToken: any) {
      await EntityService.advancedSearch(searchRequest, cancelToken)
        .then(res => {
          this.searchResults = res.data.entities;
        })
        .catch(err => {
          if (!err.message) {
            LoggerService.info(undefined, "axios request cancelled");
          } else {
            LoggerService.error("Search results server request failed", err);
          }
        });
    },

    getPerspectiveByConceptType(conceptType: any): any {
      return getIconFromType(conceptType);
    },

    getColorByConceptType(conceptType: any): any {
      return "color:" + getColourFromType(conceptType);
    },

    onNodeSelect(): void {
      this.$emit("searchResultSelected", this.selectedResult);
    },

    scrollToTop(): void {
      const resultsContainer = document.getElementById(
        "search-results-container"
      ) as HTMLElement;
      const scrollBox = resultsContainer?.getElementsByClassName(
        "p-datatable-wrapper"
      )[0] as HTMLElement;
      if (scrollBox) {
        scrollBox.scrollTop = 0;
      }
    },

    hideDetailsOverlay(): void {
      const x = this.$refs.detailsOP as any;
      x.hide();
    },

    showDetailsOverlay(event: any, data: any) {
      this.hoveredResult = data;
      const x = this.$refs.detailsOP as any;
      x.show(event, event.target);
    },

    getConceptTypes(concept: any): any {
      return concept.entityType
        .map(function(type: any) {
          return type.name;
        })
        .join(", ");
    }
  }
});
</script>

<style scoped>
.search-input {
  width: 15rem;
}

.add-expression-button {
  border-style: dashed !important;
}

.p-button-label {
  padding-left: 0.5rem;
}

.search-results-container {
  flex-grow: 5;
  overflow-y: auto;
}

.search-results-container ::v-deep(.p-datatable) {
  height: 40vh;
  width: 20rem;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

.search-results-container ::v-deep(.p-datatable-wrapper) {
  flex-grow: 6;
}

.result-container {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

.result-icon-container {
  height: 100%;
}

.result-text-container {
  height: fit-content;
  flex-grow: 10;
}

.result-icon {
  font-size: 2rem;
  color: lightgrey;
  padding: 5px;
}

@media screen and (min-width: 1024px) {
  .result-overlay {
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    width: 100%;
    gap: 7px;
  }

  .left-side,
  .right-side {
    max-width: 50%;
    flex-grow: 2;
  }

  .button-container {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    width: fit-content;
  }
}

#overlay-panel:hover {
  transition-delay: 2s;
}

@media screen and (max-width: 1023px) {
  .result-overlay {
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    width: 100%;
    gap: 7px;
  }

  .left-side,
  .right-side {
    width: 100%;
    flex-grow: 2;
  }
}
</style>
