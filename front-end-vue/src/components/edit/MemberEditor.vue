<template>
  <div id="member-search-container">
    <span class="p-input-icon-left" id="member-search-bar">
      <i class="pi pi-search" aria-hidden="true" />
      <InputText type="text" v-model="searchTerm" @input="debounceForSearch" placeholder="Search" class="p-inputtext" />
    </span>
  </div>
  <div id="member-edit-content">
    <div class="left-side">
      <TabView v-model:activeIndex="activeIndexLeft">
        <TabPanel>
          <template #header>
            <i class="fas fa-search icon-header" aria-hidden="true" />
            <span>Search Results</span>
          </template>
          <div id="member-search-results-container" :style="panelLeftHeight">
            <MemberSearchResults :searchResults="searchResults" :loading="loading" @searchResultsSelected="updateSelectedSearchResults" />
            <MemberFilters v-if="Object.keys(filterOptions).length === 3" :search="search" :filterOptions="filterOptions" :configs="configs" @selectedFiltersUpdated="updateSelectedFilters" />
          </div>
        </TabPanel>
        <!-- <TabPanel>
          <template #header>
            <i class="fas fa-sitemap icon-header" aria-hidden="true" />
            <span>Hierarchy</span>
          </template>
          <div id="member-hierarchy-container" :style="panelLeftHeight">
            <p>Tree</p>
          </div>
        </TabPanel> -->
      </TabView>
    </div>
    <div class="center-buttons">
      <Button id="add-selected-to-members-panel-button" icon="pi pi-angle-right" @click="addToActiveMembersPanel()" />
      <!-- <Button icon="pi pi-angle-double-right" />
      <Button icon="pi pi-angle-left" />
      <Button icon="pi pi-angle-double-left" /> -->
    </div>
    <div class="right-side">
      <TabView v-model:activeIndex="activeIndexRight">
        <TabPanel>
          <template #header>
            <i class="fas fa-plus icon-header" aria-hidden="true" />
            <span>Included</span>
          </template>
          <div id="included-panel-content" :style="panelRightHeight">
            <MemberPickerTable :members="included" memberType="Included" />
          </div>
        </TabPanel>
        <TabPanel>
          <template #header>
            <i class="fas fa-minus icon-header" aria-hidden="true" />
            <span>Excluded</span>
          </template>
          <div id="excluded-panel-content" :style="panelRightHeight">
            <MemberPickerTable :members="excluded" memberType="Excluded" />
          </div>
        </TabPanel>
        <TabPanel>
          <template #header>
            <i class="fas fa-layer-group icon-header" aria-hidden="true" />
            <span>Subsets</span>
          </template>
          <div id="subset-panel-content" :style="panelRightHeight">
            <MemberPickerTable :members="subSets" memberType="Subsets" />
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
import axios from "axios";
import EntityService from "@/services/EntityService";
import ConfigService from "@/services/ConfigService";
import LoggerService from "@/services/LoggerService";
import { IM } from "@/vocabulary/IM";
import MemberPickerTable from "@/components/edit/memberEditor/MemberPickerTable.vue";
import MemberFilters from "@/components/edit/memberEditor/MemberFilters.vue";
import { mapState } from "vuex";
import { MemberType } from "@/models/MemberType";

export default defineComponent({
  name: "MemberEditor",
  props: {
    iri: { type: String, required: true },
    contentHeight: { type: String, required: true },
    updatedMembers: { type: Object, required: true }
  },
  components: { MemberSearchResults, MemberPickerTable, MemberFilters },
  emits: ["members-updated"],
  watch: {
    contentHeight() {
      this.setPanelHeights();
    },

    members() {
      this.separateMembersByType();
    }
  },
  mounted() {
    this.getFilterOptions();
    this.separateMembersByType();
    this.setPanelHeights();
  },
  data() {
    return {
      members: JSON.parse(JSON.stringify(this.updatedMembers.members)),
      included: [] as any[],
      excluded: [] as any[],
      subSets: [] as any[],
      complex: [] as any[],
      panelLeftHeight: "",
      panelRightHeight: "",
      loading: false,
      debounce: 0,
      searchTerm: "",
      request: null as any,
      searchResults: [] as any[],
      activeIndexLeft: 0,
      activeIndexRight: 0,
      selectedSearchResults: [] as any[],
      filterOptions: {} as any,
      selectedFilters: {} as any,
      configs: {} as any
    };
  },
  methods: {
    async getFilterOptions() {
      await ConfigService.getFilterDefaults()
        .then(res => {
          this.configs = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get filter configs from server", err));
        });

      await EntityService.getNamespaces()
        .then(res => {
          this.filterOptions.scheme = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get scheme filter options from server", err));
        });

      await EntityService.getEntityChildren("http://endhealth.info/im#Status")
        .then(res => {
          this.filterOptions.status = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get status filter options from server", err));
        });

      await EntityService.getEntityChildren("http://endhealth.info/im#ModellingEntityType")
        .then(res => {
          this.filterOptions.type = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get type filter options from server", err));
        });
    },

    separateMembersByType() {
      this.members.forEach((member: any) => {
        switch (member.type) {
          case MemberType.INCLUDED:
            this.included.push(member);
            break;
          case MemberType.EXCLUDED:
            this.excluded.push(member);
            break;
          case MemberType.COMPLEX:
            this.complex.push(member);
            break;
          case MemberType.SUBSET:
            this.subSets.push(member);
            break;
          default:
            console.log(`Unknown member type "${member.type}" encountered in memberEditor separateMembersByType`);
            break;
        }
      });
    },

    async search(): Promise<void> {
      if (this.searchTerm.length > 2) {
        this.loading = true;
      }
      const searchRequest = new SearchRequest();
      searchRequest.termFilter = this.searchTerm;
      searchRequest.sortBy = SortBy.Usage;
      searchRequest.page = 1;
      searchRequest.size = 100;
      searchRequest.schemeFilter = this.selectedFilters.scheme.map((scheme: any) => scheme.iri);
      searchRequest.statusFilter = this.selectedFilters.status.map((status: any) => status["@id"]);
      searchRequest.typeFilter = this.selectedFilters.type.map((type: any) => type["@id"]);

      if (this.request) {
        await this.request.cancel();
      }

      const axiosSource = axios.CancelToken.source();
      this.request = { cancel: axiosSource.cancel, msg: "Loading..." };

      await EntityService.advancedSearch(searchRequest, axiosSource.token)
        .then(res => {
          this.searchResults = res.data.entities;
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
      const container = document.getElementById("member-editor-container") as HTMLElement;
      const nav = container.getElementsByClassName("p-tabview-nav")[0] as HTMLElement;
      const search = document.getElementById("member-search-bar") as HTMLElement;
      const currentFontSize = parseFloat(window.getComputedStyle(document.documentElement, null).getPropertyValue("font-size"));
      if (container && nav && currentFontSize && search) {
        const optimumRightHeight = container.getBoundingClientRect().height - nav.getBoundingClientRect().height - currentFontSize * 2 - 8;
        const optimumLeftHeight =
          container.getBoundingClientRect().height - nav.getBoundingClientRect().height - search.getBoundingClientRect().height - currentFontSize * 2 - 8;
        this.panelRightHeight = "height: " + optimumLeftHeight + "px; max-height: " + optimumRightHeight + "px;";
        this.panelLeftHeight = "height: " + optimumLeftHeight + "px; max-height: " + optimumLeftHeight + "px;";
      } else {
        LoggerService.error("Failed to set member editor panel heights. Required element not found.");
      }
    },

    membersUpdated(): void {
      this.$emit("members-updated", {
        included: this.included,
        excluded: this.excluded,
        subSets: this.subSets
      });
    },

    updateSelectedSearchResults(selectedSearchResults: any) {
      this.selectedSearchResults = selectedSearchResults;
    },

    generateNewMembers(type: string) {
      return this.selectedSearchResults.map((result: any) => {
        return {
          code: result.code,
          entity: {
            name: result.name,
            "@id": result.iri
          },
          scheme: result.scheme,
          type: type
        };
      });
    },

    addToActiveMembersPanel() {
      switch (this.activeIndexRight) {
        case 0:
          this.included = this.included.concat(this.generateNewMembers(MemberType.INCLUDED));
          break;
        case 1:
          this.excluded = this.excluded.concat(this.generateNewMembers(MemberType.EXCLUDED));
          break;
        case 2:
          this.subSets = this.subSets.concat(this.generateNewMembers(MemberType.SUBSET));
          break;
      }
    },

    updateSelectedFilters(data: any) {
      this.selectedFilters.status = data.status;
      this.selectedFilters.type = data.type;
      this.selectedFilters.scheme = data.scheme;
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
  display: flex;
  flex-flow: column nowrap;
}

.right-side {
  max-width: calc(50% - 2.357rem);
  height: 100%;
  flex-grow: 1;
}

.icon-header {
  margin-right: 0.25rem;
}

#member-search-results-container {
  height: 100%;
}

#included-panel-content ::v-deep(.p-datatable) {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
}

#included-panel-content ::v-deep(.p-datatable-wrapper) {
  flex-grow: 6;
}

#excluded-panel-content ::v-deep(.p-datatable) {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
}

#excluded-panel-content ::v-deep(.p-datatable-wrapper) {
  flex-grow: 6;
}
</style>
