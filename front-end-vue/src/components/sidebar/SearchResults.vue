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
            @mouseleave="hideOverlay()"
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
            <div class="button-container">
              <Button
                icon="pi pi-copy"
                class="p-button-rounded p-button-text"
                v-clipboard:copy="copyConceptToClipboard(slotProps.data)"
                v-clipboard:success="onCopy"
                v-clipboard:error="onCopyError"
                v-tooltip.right="
                  'Copy concept to clipboard \n (right click to copy individual properties)'
                "
                @contextmenu="onCopyRightClick"
              />
              <ContextMenu ref="copyMenu" :model="copyMenuItems" />
            </div>
          </div>
        </template>
      </Column>
    </DataTable>

    <OverlayPanel
      ref="op"
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
            <span>
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
      copyMenuItems: [] as any
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
      this.hoveredResult = data;
      this.setCopyMenuItems();
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

    copyConceptToClipboard(data: any): string {
      return (
        "Name: " +
        data.name +
        ", Iri: " +
        data.iri +
        ", Code: " +
        data.code +
        ", Status: " +
        data.status.name +
        ", Scheme: " +
        data.scheme.name +
        ", Type: " +
        data.conceptType[0].name
      );
    },

    onCopy(): void {
      this.$toast.add(LoggerService.success("Value copied to clipboard"));
    },

    onCopyError(): void {
      this.$toast.add(LoggerService.error("Failed to copy value to clipboard"));
    },

    onCopyRightClick(event: any) {
      const x = this.$refs.copyMenu as any;
      x.show(event);
    },

    setCopyMenuItems() {
      this.copyMenuItems = [
        {
          label: "Copy",
          disabled: true
        },
        {
          separator: true
        },
        {
          label: "All",
          command: async () => {
            await navigator.clipboard.writeText(
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
            this.$toast.add(
              LoggerService.success("Concept copied to clipboard")
            );
          }
        },
        {
          label: "Name",
          command: async () => {
            await navigator.clipboard.writeText(this.hoveredResult.name);
            this.$toast.add(LoggerService.success("Name copied to clipboard"));
          }
        },
        {
          label: "Iri",
          command: async () => {
            await navigator.clipboard.writeText(this.hoveredResult.iri);
            this.$toast.add(LoggerService.success("Iri copied to clipboard"));
          }
        },
        {
          label: "Code",
          command: async () => {
            await navigator.clipboard.writeText(this.hoveredResult.code);
            this.$toast.add(LoggerService.success("Code copied to clipboard"));
          }
        },
        {
          label: "Status",
          command: async () => {
            await navigator.clipboard.writeText(this.hoveredResult.status.name);
            this.$toast.add(
              LoggerService.success("Status copied to clipboard")
            );
          }
        },
        {
          label: "Scheme",
          command: async () => {
            await navigator.clipboard.writeText(this.hoveredResult.scheme.name);
            this.$toast.add(
              LoggerService.success("Scheme copied to clipboard")
            );
          }
        },
        {
          label: "Type",
          command: async () => {
            await navigator.clipboard.writeText(
              this.getConceptTypes(this.hoveredResult)
            );
            this.$toast.add(LoggerService.success("Type copied to clipboard"));
          }
        }
      ];
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
  flex-grow: 10;
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
