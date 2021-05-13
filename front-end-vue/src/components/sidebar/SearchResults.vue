<template>
  <div class="p-field results-container">
    <div
      class="p-d-flex p-flex-row p-jc-center"
      v-if="$store.state.loading.get('searchResults')"
    >
      <div class="p-text-center">
        <ProgressSpinner />
      </div>
    </div>
    <DataTable
      v-else
      :value="$store.state.searchResults"
      v-model:selection="selectedResult"
      @row-select="onNodeSelect"
      selectionMode="single"
      dataKey="iri"
      class="p-datatable-sm"
      :scrollable="true"
      removableSort
      :paginator="true"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[15, 25, 50]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      :rows="15"
    >
      <Column field="name" header="Results">
        <template #body="slotProps">
          <div
            class="result-container"
            @mouseenter="toggle($event, slotProps.data)"
            @mouseleave="toggle($event, slotProps.data)"
          >
            <div class="result-icon-container">
              <i
                :class="getPerspectiveByConceptType(slotProps.data.conceptType)"
                class="result-icon"
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
      ref="op"
      id="overlay_panel"
      style="width: 700px"
      :breakpoints="{ '960px': '75vw' }"
    >
      <div
        class="p-d-flex p-flex-row p-jc-start result-overlay"
        style="width: 100%; gap: 7px;"
      >
        <div class="left-side" style="width: 50%;" v-if="hoveredResult.name">
          <p><strong>Name:</strong> {{ hoveredResult.name }}</p>
          <p><strong>Iri:</strong> {{ hoveredResult.iri }}</p>
          <p><strong>Code:</strong> {{ hoveredResult.code }}</p>
        </div>
        <div class="right-side" style="width: 50%;" v-if="hoveredResult.name">
          <p>
            <strong>Status:</strong>
            <span v-if="hoveredResult.status">{{
              hoveredResult.status.name
            }}</span>
          </p>
          <p>
            <strong>Scheme:</strong>
            <span v-if="hoveredResult.scheme">{{
              hoveredResult.scheme.name
            }}</span>
          </p>
          <p><strong>Type:</strong> {{ getConceptTypes(hoveredResult) }}</p>
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script lang="ts">
import { ConceptSummary } from "@/models/search/ConceptSummary";
import { SearchResponse } from "@/models/search/SearchResponse";
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { getIconFromType } from "../../helpers/ConceptTypeMethods";

export default defineComponent({
  name: "SearchResults",
  components: {},
  computed: mapState(["searchResults"]),
  watch: {
    searchResults(newValue) {
      this.results = newValue;
    }
  },
  data() {
    return {
      results:  new SearchResponse() as SearchResponse,
      selectedResult: {} as ConceptSummary,
      hoveredResult: {} as ConceptSummary | any
    }
  },
  methods: {
    getPerspectiveByConceptType(conceptType: any): any {
      return getIconFromType(conceptType.elements);
    },

    onNodeSelect(): void {
      this.$router.push({
        name: "Concept",
        params: { selectedIri: this.selectedResult.iri }
      });
    },

    toggle(event: any, data: any): void {
      this.hoveredResult = data;
      const x = this.$refs.op as any;
      x.toggle(event);
    },

    getConceptTypes(concept: any): any {
      return concept.conceptType.elements
        .map(function(type: any) {
          return type.name;
        })
        .join(", ");
    }
  }
})
</script>

<style scoped>
.results-container {
  flex-grow: 5;
  overflow-y: auto;
}

.results-container ::v-deep(.p-datatable) {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

.results-container ::v-deep(.p-datatable-wrapper) {
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
</style>
