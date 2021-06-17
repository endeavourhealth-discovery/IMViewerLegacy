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
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
      :rowsPerPageOptions="[15, 25, 50]"
      currentPageReportTemplate="Displaying {first} to {last} of {totalRecords} results"
      :rows="15"
    >
      <Column field="name" header="Results">
        <template #body="slotProps">
          <div
            class="result-container"
            @mouseenter="showOverlay($event, slotProps.data)"
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
      ref="op"
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
              style="cursor:pointer"
              v-clipboard:copy="hoveredResult.name"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError"
            >
              {{ hoveredResult.name }}
            </span>
          </p>
          <p>
            <strong>Iri: </strong>
            <span
              v-if="hoveredResult.status"
              style="cursor:pointer; word-break: break-all;"
              v-clipboard:copy="hoveredResult.iri"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError"
            >
              {{ hoveredResult.iri }}
            </span>
          </p>
          <p>
            <strong>Code: </strong>
            <span
              v-if="hoveredResult.status"
              style="cursor:pointer"
              v-clipboard:copy="hoveredResult.code"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError"
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
              style="cursor:pointer"
              v-clipboard:copy="hoveredResult.status.name"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError"
            >
              {{ hoveredResult.status.name }}
            </span>
          </p>
          <p>
            <strong>Scheme: </strong>
            <span
              v-if="hoveredResult.scheme"
              style="cursor:pointer"
              v-clipboard:copy="hoveredResult.scheme.name"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError"
            >
              {{ hoveredResult.scheme.name }}
            </span>
          </p>
          <p>
            <strong>Type: </strong>
            <span
              style="cursor:pointer"
              v-clipboard:copy="getConceptTypes(hoveredResult)"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError"
            >
              {{ getConceptTypes(hoveredResult) }}
            </span>
          </p>
        </div>
        <div class="button-container">
          <Button
            icon="pi pi-copy"
            class="p-button-rounded p-button-text"
            v-clipboard:copy="copyHoveredResult()"
            v-clipboard:success="onCopy"
            v-clipboard:error="onCopyError"
            v-tooltip.right="'Copy concept to clipboard'"
          />
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script lang="ts">
import { ConceptSummary } from "@/models/search/ConceptSummary";
import { SearchResponse } from "@/models/search/SearchResponse";
import LoggerService from "@/services/LoggerService";
import { defineComponent } from "vue";
import { mapState } from "vuex";
import {
  getColourFromType,
  getIconFromType
} from "../../helpers/ConceptTypeMethods";

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
      results: new SearchResponse() as SearchResponse,
      selectedResult: {} as ConceptSummary,
      hoveredResult: {} as ConceptSummary | any,
      hoveredEvent: {} as any
    };
  },
  methods: {
    getPerspectiveByConceptType(conceptType: any): any {
      return getIconFromType(conceptType);
    },
    getColorByConceptType(conceptType: any): any {
      return "color:" + getColourFromType(conceptType);
    },
    onNodeSelect(): void {
      this.$router.push({
        name: "Concept",
        params: { selectedIri: this.selectedResult.iri }
      });
    },

    hideOverlay(): void {
      const x = this.$refs.op as any;
      x.hide();
    },

    async showOverlay(event: any, data: any): Promise<void> {
      this.hideOverlay();
      await this.$nextTick();
      this.hoveredResult = data;
      this.hoveredEvent = event;
      const x = this.$refs.op as any;
      x.show(event, event.target);
    },

    getConceptTypes(concept: any): any {
      return concept.conceptType
        .map(function(type: any) {
          return type.name;
        })
        .join(", ");
    },

    copyHoveredResult(): string {
      return (
        "Name: " +
        this.hoveredResult.name +
        ", Iri: " +
        this.hoveredResult.iri +
        ", Code: " +
        this.hoveredResult.code +
        ", Status: " +
        this.hoveredResult.status.name +
        ", Scheme: " +
        this.hoveredResult.scheme.name +
        ", Type: " +
        this.hoveredResult.conceptType[0].name
      );
    },

    onCopy(): void {
      this.$toast.add(LoggerService.success("Value copied to clipboard"));
    },

    onCopyError(): void {
      this.$toast.add(LoggerService.error("Failed to copy value to clipboard"));
    }
  }
});
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

#overlay-panel:hover {
  transition-delay: 2s;
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

  .button-container {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
}
</style>
