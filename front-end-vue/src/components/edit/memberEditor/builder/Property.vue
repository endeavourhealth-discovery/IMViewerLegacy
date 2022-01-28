<template>
  <div class="property-item-container" :id="id">
    <div class="label-container">
      <span class="float-text">Property</span>
      <InputText
        ref="miniSearchInput"
        type="text"
        v-model="searchTerm"
        @input="search"
        @keyup.enter="search"
        @focus="showOverlay"
        @blur="hideOverlay"
        @change="showOverlay"
        placeholder="Search"
        class="p-inputtext search-input"
        autoWidth="true"
      />
    </div>
    <AddDeleteButtons :last="last" :position="position" @deleteClicked="deleteClicked" @addNextClicked="addNextClicked" />
  </div>
  <OverlayPanel class="search-op" ref="miniSearchOP">
    <SearchMiniOverlay :searchTerm="searchTerm" :searchResults="searchResults" :loading="loading" @searchResultSelected="updateSelectedResult" />
  </OverlayPanel>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import SearchMiniOverlay from "@/components/sidebar/expressionConstraintsSearch/SearchMiniOverlay.vue";
import { ConceptSummary } from "@/models/search/ConceptSummary";
import { ComponentDetails } from "@/models/definition/ComponentDetails";
import { mapState } from "vuex";
import { isArrayHasLength, isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import { TTIriRef } from "@/models/TripleTree";
import { SearchRequest } from "@/models/search/SearchRequest";
import { SortBy } from "@/models/search/SortBy";
import { Namespace } from "@/models/Namespace";
import { EntityReferenceNode } from "@/models/EntityReferenceNode";
import axios from "axios";
import EntityService from "@/services/EntityService";
import { DefinitionType } from "@/models/definition/DefinitionType";
import { DefinitionComponent } from "@/models/definition/DefinitionComponent";
import { NextComponentSummary } from "@/models/definition/NextComponentSummary";
import AddDeleteButtons from "@/components/edit/memberEditor/builder/AddDeleteButtons.vue";
import { IM } from "@/vocabulary/IM";
import { RDFS } from "@/vocabulary/RDFS";
import { RDF } from "@/vocabulary/RDF";

export default defineComponent({
  name: "Property",
  props: {
    id: { type: String, required: true },
    position: { type: Number, required: true },
    value: { type: String, required: false },
    last: { type: Boolean, required: true }
  },
  emits: {
    updateClicked: (payload: ComponentDetails) => true,
    addNextOptionsClicked: (payload: NextComponentSummary) => true,
    deleteClicked: (payload: ComponentDetails) => true,
    addClicked: (payload: any) => true
  },
  components: { SearchMiniOverlay, AddDeleteButtons },
  computed: mapState(["filterOptions", "selectedFilters"]),
  async mounted() {
    if (this.value) {
      await this.updateSelectedResult(this.value);
      await this.search();
    } else {
      this.selectedResult = {} as TTIriRef;
      this.searchTerm = "";
    }
  },
  data() {
    return {
      loading: false,
      debounce: 0,
      request: {} as { cancel: any; msg: string },
      selectedResult: {} as TTIriRef,
      searchTerm: "",
      searchResults: [] as ConceptSummary[]
    };
  },
  methods: {
    // debounceForSearch(): void {
    //   clearTimeout(this.debounce);
    //   this.debounce = window.setTimeout(() => {
    //     this.search();
    //   }, 600);
    // },

    checkKey(event: any) {
      if (event.code === "Enter") {
        this.search();
      }
    },

    async search(): Promise<void> {
      if (this.searchTerm.length > 0) {
        this.searchResults = [];
        this.loading = true;
        const searchRequest = new SearchRequest();
        searchRequest.termFilter = this.searchTerm;
        searchRequest.sortBy = SortBy.Usage;
        searchRequest.page = 1;
        searchRequest.size = 100;
        searchRequest.schemeFilter = this.filterOptions.schemes.map((scheme: Namespace) => scheme.iri);

        searchRequest.statusFilter = [];
        this.filterOptions.status.forEach((status: EntityReferenceNode) => {
          searchRequest.statusFilter.push(status["@id"]);
        });

        searchRequest.typeFilter = [];
        searchRequest.typeFilter.push(RDF.PROPERTY);
        if (isObjectHasKeys(this.request, ["cancel", "msg"])) {
          await this.request.cancel({ status: 499, message: "Search cancelled by user" });
        }
        const axiosSource = axios.CancelToken.source();
        this.request = { cancel: axiosSource.cancel, msg: "Loading..." };
        await this.fetchSearchResults(searchRequest, axiosSource.token);
        this.loading = false;
      }
    },

    async fetchSearchResults(searchRequest: SearchRequest, cancelToken: any) {
      const result = await EntityService.advancedSearch(searchRequest, cancelToken);
      if (result && isArrayHasLength(result)) {
        this.searchResults = result;
      } else {
        this.searchResults = [];
      }
    },

    hideOverlay(): void {
      const x = this.$refs.miniSearchOP as any;
      x.hide();
    },

    showOverlay(event: any): void {
      const x = this.$refs.miniSearchOP as any;
      x.show(event, event.target);
    },

    isTTIriRef(data: any): data is TTIriRef {
      if ((data as TTIriRef)["@id"]) return true;
      return false;
    },

    isConceptSummary(data: any): data is ConceptSummary {
      if ((data as ConceptSummary).iri) return true;
      return false;
    },

    async updateSelectedResult(result: ConceptSummary | string) {
      if (!result) return;
      let name = "";
      let iri = "";
      if (this.isConceptSummary(result)) {
        name = result.name;
        iri = result.iri;
      } else {
        iri = result;
        name = (await EntityService.getPartialEntity(result, [RDFS.LABEL]))[RDFS.LABEL];
      }
      this.selectedResult = { "@id": iri, name: name ? name : iri };
      this.searchTerm = name;
      this.$emit("updateClicked", this.createProperty());
      this.hideOverlay();
    },

    editClicked(event: any) {
      this.showOverlay(event);
    },

    createProperty(): ComponentDetails {
      return {
        value: this.selectedResult["@id"],
        id: this.id,
        position: this.position,
        type: DefinitionType.PROPERTY,
        json: this.selectedResult["@id"],
        component: DefinitionComponent.PROPERTY
      };
    },

    deleteClicked(): void {
      this.$emit("deleteClicked", {
        id: this.id,
        value: this.selectedResult["@id"],
        position: this.position,
        type: DefinitionType.PROPERTY,
        component: DefinitionComponent.PROPERTY,
        json: this.selectedResult["@id"]
      });
    },

    addNextClicked(): void {
      this.$emit("addNextOptionsClicked", {
        previousComponentType: DefinitionType.SET,
        previousPosition: this.position,
        parentGroup: DefinitionType.SET
      });
    }
  }
});
</script>

<style scoped>
.property-item-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

.label-container {
  margin: 0 1rem 0 0;
  padding: 1rem;
  border: 1px solid #ffc952;
  border-radius: 3px;
  position: relative;
  min-width: 15rem;
}

.label {
  cursor: pointer;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  background-color: #ffffff;
  padding: 0.25rem;
}

.float-text {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.75rem;
  color: #6c757d;
}

.search-input {
  width: 15rem;
}
</style>
