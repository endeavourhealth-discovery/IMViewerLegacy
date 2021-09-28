<template>
  <DataTable
    :scrollHeight="tableHeight"
    :value="searchResults"
    v-model:selection="selectedResults"
    @row-select="onSearchResultSelect"
    @row-unselect="onSearchResultSelect"
    selectionMode="multiple"
    :metaKeySelection="false"
    dataKey="iri"
    class="p-datatable-sm"
    :scrollable="true"
    :paginator="searchResults.length > 25 ? true : false"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
    :rowsPerPageOptions="[25, 50, 100]"
    currentPageReportTemplate="Displaying {first} to {last} of {totalRecords} results"
    :rows="25"
    :loading="loading"
  >
    <template #empty>
      No results found
    </template>
    <template #loading>
      Loading...
    </template>
    <Column field="name" header="Results">
      <template #body="slotProps">
        <div class="result-container" @mouseover="showSearchResultOverlay($event, slotProps.data)" @mouseleave="hideOverlay">
          <div class="result-icon-container">
            <i
              :class="getPerspectiveByConceptType(slotProps.data.conceptType)"
              class="result-icon"
              :style="getColorByConceptType(slotProps.data.conceptType)"
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

  <OverlayPanel ref="memberOP" id="overlay-panel" style="width: 40vw">
    <div class="result-overlay">
      <div class="left-side" v-if="hoveredResult.iri">
        <p>
          <strong>Name: </strong>
          <span v-if="hoveredResult.status">
            {{ hoveredResult.name }}
          </span>
        </p>
        <p>
          <strong>Iri: </strong>
          <span v-if="hoveredResult.status" style="word-break: break-all;">
            {{ hoveredResult.iri }}
          </span>
        </p>
        <p>
          <strong>Code: </strong>
          <span v-if="hoveredResult.status">
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getColourFromType, getIconFromType } from "@/helpers/ConceptTypeMethods";
import { ConceptSummary } from "@/models/search/ConceptSummary";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "MemberSearchResults",
  props: ["searchResults", "loading"],
  emits: ["searchResultsSelected"],
  watch: {
    loading(newValue) {
      if (newValue) {
        this.setDataTableHeight();
      }
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      selectedResults: [] as any[],
      hoveredResult: {} as ConceptSummary | any,
      tableHeight: ""
    };
  },
  methods: {
    onResize(): void {
      this.setDataTableHeight();
    },

    onSearchResultSelect() {
      this.$emit("searchResultsSelected", this.selectedResults);
    },

    getPerspectiveByConceptType(conceptType: any): any {
      return getIconFromType(conceptType);
    },

    getColorByConceptType(conceptType: any): any {
      return "color:" + getColourFromType(conceptType);
    },

    async showSearchResultOverlay(event: any, data: any): Promise<void> {
      this.hoveredResult = data;
      const x = this.$refs.memberOP as any;
      x.show(event, event.target);
    },

    getConceptTypes(entity: any): any {
      return entity.entityType
        .map(function(type: any) {
          return type.name;
        })
        .join(", ");
    },

    hideOverlay(): void {
      const x = this.$refs.memberOP as any;
      x.hide();
    },

    setDataTableHeight(): void {
      const container = document.getElementById("member-search-results-container") as HTMLElement;
      const table = container.getElementsByClassName("p-datatable")[0] as HTMLElement;
      const filters = container.getElementsByClassName("filters-title-container")[0] as HTMLElement;
      const paginator = container.getElementsByClassName("p-paginator")[0] as HTMLElement;
      const tableHeader = container.getElementsByClassName("p-datatable-thead")[0] as HTMLElement;
      if (container && table) {
        let tableHeight = container.getBoundingClientRect().height;
        if (filters) {
          tableHeight -= filters.getBoundingClientRect().height;
        }
        if (tableHeader) {
          tableHeight -= tableHeader.getBoundingClientRect().height;
        }
        if (paginator) {
          tableHeight -= paginator.getBoundingClientRect().height;
        }
        this.tableHeight = tableHeight + "px";
      } else {
        LoggerService.error(undefined, "Failed to set member editor search results table height. Elements required not found");
      }
    }
  }
});
</script>

<style scoped>
.result-container {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

.result-icon-container {
  height: 100%;
  margin-right: 1em;
}

.result-text-container {
  height: fit-content;
}

.result-icon {
  font-size: 2.5rem;
  color: lightgrey;
  padding: 5px;
}

#overlay-panel:hover {
  transition-delay: 2s;
}

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
</style>
