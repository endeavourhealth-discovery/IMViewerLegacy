<template>
  <div id="member-search-container">
    <span class="p-input-icon-left" id="member-search-bar">
      <i class="pi pi-search" aria-hidden="true" />
      <InputText
        type="text"
        v-model="searchTerm"
        @input="debounceForSearch"
        placeholder="Search"
        class="p-inputtext"
      />
    </span>
  </div>
  <div id="member-edit-content">
    <div class="left-side">
      <TabView :activeIndex="activeIndexLeft">
        <TabPanel>
          <template #header>
            <i class="fas fa-search icon-header" aria-hidden="true" />
            <span>Search Results</span>
          </template>
          <div id="member-search-results-container" :style="panelLeftHeight">
            <MemberSearchResults
              :searchResults="searchResults"
              :loading="loading"
            />
          </div>
        </TabPanel>
        <TabPanel>
          <template #header>
            <i class="fas fa-sitemap icon-header" aria-hidden="true" />
            <span>Hierarchy</span>
          </template>
          <div id="member-hierarchy-container" :style="panelLeftHeight">
            <p>Tree</p>
          </div>
        </TabPanel>
      </TabView>
    </div>
    <div class="center-buttons">
      <Button icon="pi pi-angle-right" />
      <Button icon="pi pi-angle-double-right" />
      <Button icon="pi pi-angle-left" />
      <Button icon="pi pi-angle-double-left" />
    </div>
    <div class="right-side">
      <TabView :activeIndex="activeIndexRight" lazy>
        <TabPanel>
          <template #header>
            <i class="fas fa-plus icon-header" aria-hidden="true" />
            <span>Included</span>
          </template>
          <div id="included-panel-content" :style="panelRightHeight">
            <DataTable
              :value="data[0]"
              v-model:selection="selectedIncluded"
              selectionMode="multiple"
              dataKey="code"
              :metaKeySelection="false"
              :paginator="true"
              :scrollable="true"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
              :rowsPerPageOptions="[25, 50, 100]"
              currentPageReportTemplate="Displaying {first} to {last} of {totalRecords} results"
              :rows="25"
            >
              <Column field="concept.name" header="Included" :sortable="true" />
            </DataTable>
          </div>
        </TabPanel>
        <TabPanel>
          <template #header>
            <i class="fas fa-minus icon-header" aria-hidden="true" />
            <span>Excluded</span>
          </template>
          <div id="excluded-panel-content" :style="panelRightHeight">
            <DataTable
              :value="data[1]"
              v-model:selection="selectedExcluded"
              selectionMode="multiple"
              dataKey="code"
              :metaKeySelection="false"
              :scrollable="true"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
              :rowsPerPageOptions="[25, 50, 100]"
              currentPageReportTemplate="Displaying {first} to {last} of {totalRecords} results"
              :rows="25"
            >
              <Column field="concept.name" header="Included" :sortable="true" />
            </DataTable>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MemberSearchResults from "@/components/edit/memberEditor/MemberSearchResults.vue";
import { SearchRequest } from "@/models/search/SearchRequest";
import { SortBy } from "@/models/search/SortBy";
import { ConceptStatus } from "@/models/ConceptStatus";
import { ConceptType } from "@/models/search/ConceptType";
import axios from "axios";
import ConceptService from "@/services/ConceptService";
import LoggerService from "@/services/LoggerService";
import { IM } from "@/vocabulary/IM";

export default defineComponent({
  name: "MemberEditor",
  props: ["iri", "contentHeight", "updatedMembers"],
  components: { MemberSearchResults },
  emits: ["members-updated"],
  watch: {
    contentHeight() {
      this.setPanelHeights();
    }
  },
  mounted() {
    this.setPanelHeights();
  },
  data() {
    return {
      members: JSON.parse(JSON.stringify(this.updatedMembers)),
      data: [
        JSON.parse(JSON.stringify(this.updatedMembers.included)),
        JSON.parse(JSON.stringify(this.updatedMembers.excluded))
      ] as any,
      panelLeftHeight: "",
      panelRightHeight: "",
      loading: false,
      debounce: 0,
      searchTerm: "",
      request: null as any,
      searchResults: null as any,
      activeIndexLeft: 0,
      activeIndexRight: 0,
      selectedIncluded: null as any,
      selectedExcluded: null as any
    };
  },
  methods: {
    async search(): Promise<void> {
      if (this.searchTerm.length > 2) {
        this.loading = true;
      }
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
      searchRequest.statusFilter = [ConceptStatus.Active, ConceptStatus.Draft];
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
    },

    debounceForSearch(): void {
      clearTimeout(this.debounce);
      this.debounce = window.setTimeout(() => {
        this.search();
      }, 600);
    },

    setPanelHeights(): void {
      const container = document.getElementById(
        "member-editor-container"
      ) as HTMLElement;
      const nav = container.getElementsByClassName(
        "p-tabview-nav"
      )[0] as HTMLElement;
      const search = document.getElementById(
        "member-search-bar"
      ) as HTMLElement;
      const currentFontSize = parseFloat(
        window
          .getComputedStyle(document.documentElement, null)
          .getPropertyValue("font-size")
      );
      if (container && nav && currentFontSize && search) {
        const optimumRightHeight =
          container.getBoundingClientRect().height -
          nav.getBoundingClientRect().height -
          currentFontSize * 2 -
          8;
        const optimumLeftHeight =
          container.getBoundingClientRect().height -
          nav.getBoundingClientRect().height -
          search.getBoundingClientRect().height -
          currentFontSize * 2 -
          8;
        this.panelRightHeight =
          "height: " +
          optimumLeftHeight +
          "px; max-height: " +
          optimumRightHeight +
          "px;";
        this.panelLeftHeight =
          "height: " +
          optimumLeftHeight +
          "px; max-height: " +
          optimumLeftHeight +
          "px;";
      }
    },

    membersUpdated(): void {
      this.$emit("members-updated", {
        included: this.data[0],
        excluded: this.data[1],
        valueSet: this.members.valueSet
      });
    }
  }
});
</script>

<style scoped>
.member-name {
  word-wrap: break-word;
}

.loading-container {
  height: 100%;
}

.header-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

#member-edit-content {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  width: 100%;
  gap: 1rem;
}

.center-buttons {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: fit-content;
  height: 100%;
}

.left-side {
  max-width: calc(50% - 2.357rem);
  height: 100%;
  flex-grow: 1;
}

.right-side {
  max-width: calc(50% - 2.357rem);
  height: 100%;
  flex-grow: 1;
}

.icon-header {
  margin-right: 0.25rem;
}

#member-search-results-container ::v-deep(.p-datatable) {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

#member-search-results-container ::v-deep(.p-datatable-wrapper) {
  flex-grow: 6;
}

#included-panel-content ::v-deep(.p-datatable) {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

#included-panel-content ::v-deep(.p-datatable-wrapper) {
  flex-grow: 6;
}

#excluded-panel-content ::v-deep(.p-datatable) {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

#excluded-panel-content ::v-deep(.p-datatable-wrapper) {
  flex-grow: 6;
}
</style>
