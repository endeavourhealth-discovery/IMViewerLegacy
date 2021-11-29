<template>
  <div id="h-filter-container" class="p-fluid">
    <div class="reset-button-container">
      <Button label="Reset filters" @click="resetFilters" />
    </div>
    <div class="p-field">
      <span class="p-float-label">
        <MultiSelect id="status" v-model="selectedStatus" @change="checkForSearch" :options="statusOptions" optionLabel="name" display="chip" />
        <label for="status">Select status:</label>
      </span>
    </div>

    <div class="p-field">
      <span class="p-float-label">
        <MultiSelect id="scheme" v-model="selectedSchemes" @change="checkForSearch" :options="schemeOptions" optionLabel="name" display="chip" />
        <label for="scheme">Select scheme:</label>
      </span>
    </div>

    <div class="p-field">
      <span class="p-float-label">
        <MultiSelect id="conceptType" v-model="selectedTypes" @change="checkForSearch" :options="typeOptions" optionLabel="name" display="chip" />
        <label for="scheme">Select concept type:</label>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import ConfigService from "@/services/ConfigService";
import EntityService from "@/services/EntityService";
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { Namespace } from "@/models/Namespace";
import { EntityReferenceNode } from "@/models/EntityReferenceNode";
import { FilterDefaultsConfig } from "@/models/configs/FilterDefaultsConfig";
import { isArrayHasLength } from "@/helpers/DataTypeCheckers";
import { IM } from "@/vocabulary/IM";

export default defineComponent({
  name: "HierarchyFilters",
  computed: mapState(["filterOptions", "hierarchySelectedFilters"]),
  watch: {
    selectedStatus() {
      this.updateStoreSelectedFilters();
    },
    selectedSchemes() {
      this.updateStoreSelectedFilters();
    },
    selectedTypes() {
      this.updateStoreSelectedFilters();
    }
  },
  async mounted() {
    await this.init();
  },
  data() {
    return {
      statusOptions: [] as EntityReferenceNode[],
      schemeOptions: [] as Namespace[],
      typeOptions: [] as EntityReferenceNode[],
      selectedStatus: [] as EntityReferenceNode[],
      selectedSchemes: [] as Namespace[],
      selectedTypes: [] as EntityReferenceNode[],
      configs: {} as FilterDefaultsConfig
    };
  },
  methods: {
    async init(): Promise<void> {
      if (!isArrayHasLength(this.filterOptions)) {
        await this.getFilterOptions();
        this.setFilters();
      }
      this.setDefaults();
    },

    checkForSearch(): void {
      this.updateStoreSelectedFilters();
    },

    setFilters(): void {
      this.$store.commit("updateFilterOptions", {
        status: this.statusOptions,
        scheme: this.schemeOptions,
        type: this.typeOptions
      });
    },

    setDefaults(): void {
      if (
        !isArrayHasLength(this.hierarchySelectedFilters.status) &&
        !isArrayHasLength(this.hierarchySelectedFilters.schemes) &&
        !isArrayHasLength(this.hierarchySelectedFilters.types)
      ) {
        this.resetFilters();
      } else {
        this.selectedStatus = this.hierarchySelectedFilters.status;
        this.selectedSchemes = this.hierarchySelectedFilters.schemes;
        this.selectedTypes = this.hierarchySelectedFilters.types;
      }
    },

    updateStoreSelectedFilters(): void {
      this.$store.commit("updateHierarchySelectedFilters", {
        status: this.selectedStatus,
        schemes: this.selectedSchemes,
        types: this.selectedTypes
      });
    },

    async getFilterOptions(): Promise<void> {
      this.configs = await ConfigService.getFilterDefaults();

      this.schemeOptions = await EntityService.getNamespaces();

      this.statusOptions = await EntityService.getEntityChildren(IM.STATUS);

      this.typeOptions = await EntityService.getEntityChildren(IM.MODELLING_ENTITY_TYPE);
    },

    resetFilters(): void {
      this.selectedStatus = this.statusOptions.filter(item => this.configs.statusOptions.includes(item["@id"]));
      this.selectedSchemes = this.schemeOptions.filter(item => this.configs.schemeOptions.includes(item.iri));
      this.selectedTypes = this.typeOptions.filter(item => this.configs.typeOptions.includes(item["@id"]));
      this.updateStoreSelectedFilters();
    }
  }
});
</script>

<style scoped>
#h-filter-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
}

.reset-button-container {
  width: fit-content;
  margin: 0.5rem 0 0.5rem 0;
}

label {
  font-size: 1rem !important;
}

.p-field {
  margin-top: 1rem;
  width: 100%;
}

.quick-filters-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
}

.quick-filter-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
}
</style>
