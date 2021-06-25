<template>
  <div
    class="p-d-flex p-flex-row p-jc-center"
    v-if="loading"
  >
    <div class="p-text-center">
      <ProgressSpinner />
    </div>
  </div>
  <DataTable
    v-else
    :value="searchResults"
    v-model:selection="selectedResult"
    @row-select="onSearchResultSelect"
    selectionMode="single"
    dataKey="iri"
    class="p-datatable-sm"
    :scrollable="true"
    :paginator="true"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
    :rowsPerPageOptions="[15,25,50]"
    currentPageReportTemplate="Displaying {first} to {last} of {totalRecords} results"
    :rows="15"
  >
    <Column field="name" header="Results">
      <template #body="slotProps">
        <div
          class="result-container"
          @mouseenter="showSearchResultOverlay($event, slotProps.data)"
        >
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

  <OverlayPanel
    ref="memberOP"
    id="overlay-panel"
    style="width: 25vw"
    :showCloseIcon="true"
    :dismissable="true"
  >
    <div class="result-overlay">
      <div class="left-side" v-if="hoveredResult.iri">
        <p>
          <strong>Name: </strong>
          <span
            v-if="hoveredResult.status"
          >
            {{ hoveredResult.name }}
          </span>
        </p>
        <p>
          <strong>Iri: </strong>
          <span
            v-if="hoveredResult.status"
            style="word-break: break-all;"
          >
            {{ hoveredResult.iri }}
          </span>
        </p>
        <p>
          <strong>Code: </strong>
          <span
            v-if="hoveredResult.status"
          >
            {{ hoveredResult.code }}
          </span>
        </p>
      </div>
      <div class="right-side" v-if="hoveredResult.iri">
        <p>
          <strong>Status: </strong>
          <span
            v-if="hoveredResult.status"
          >
            {{ hoveredResult.status.name }}
          </span>
        </p>
        <p>
          <strong>Scheme: </strong>
          <span
            v-if="hoveredResult.scheme"
          >
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
import {
  getColourFromType,
  getIconFromType
} from "@/helpers/ConceptTypeMethods";
import { ConceptSummary } from "@/models/search/ConceptSummary";

export default defineComponent({
  name: "MemberSearchResults",
  props: ["searchResults", "loading"],
  data() {
    return {
      selectedResult: null as any,
      hoveredResult: {} as ConceptSummary | any
    };
  },
  methods: {
    onSearchResultSelect() {
      console.log("searchResultSelected");
    },

    getPerspectiveByConceptType(conceptType: any): any {
      return getIconFromType(conceptType);
    },

    getColorByConceptType(conceptType: any): any {
      return "color:" + getColourFromType(conceptType);
    },

    async showSearchResultOverlay(event: any, data: any): Promise<void> {
      this.hideOverlay();
      await this.$nextTick();
      this.hoveredResult = data;
      const x = this.$refs.memberOP as any;
      x.show(event, event.target);
    },

    getConceptTypes(concept: any): any {
      return concept.conceptType
        .map(function(type: any) {
          return type.name;
        })
        .join(", ");
    },

    hideOverlay(): void {
      const x = this.$refs.memberOP as any;
      x.hide();
    },
  }
})
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
</style>
