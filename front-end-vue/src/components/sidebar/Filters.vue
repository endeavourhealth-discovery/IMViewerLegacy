<template>
  <div class="quick-filters-container">
    <div class="quick-filter-container">
      <label>Include legacy:</label>
      <InputSwitch v-model="includeLegacy" />
    </div>
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
import { NAMESPACES } from "@/vocabulary/NAMESPACES";

export default defineComponent({
  name: "Filters",
  props: { search: { type: Function, required: true } },
  computed: mapState(["filterOptions", "selectedFilters", "quickFiltersStatus"]),
  watch: {
    includeLegacy(newValue) {
      this.setLegacy(newValue);
    },
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
    await this.getFilterOptions();
    this.setFilters();
    this.setDefaults();
  },
  data() {
    return {
      statusOptions: [] as EntityReferenceNode[],
      schemeOptions: [] as Namespace[],
      typeOptions: [] as EntityReferenceNode[],
      selectedStatus: [] as EntityReferenceNode[],
      selectedSchemes: [] as Namespace[],
      selectedTypes: [] as EntityReferenceNode[],
      configs: {} as FilterDefaultsConfig,
      includeLegacy: false
    };
  },
  methods: {
    checkForSearch(): void {
      this.updateStoreSelectedFilters();
      this.search();
    },

    setFilters(): void {
      this.$store.commit("updateFilterOptions", {
        status: this.statusOptions,
        scheme: this.schemeOptions,
        type: this.typeOptions
      });
    },

    setDefaults(): void {
      if (!isArrayHasLength(this.selectedFilters.status) && !isArrayHasLength(this.selectedFilters.schemes) && !isArrayHasLength(this.selectedFilters.types)) {
        this.selectedStatus = this.statusOptions.filter(item => this.configs.statusOptions.includes(item.name));
        this.selectedSchemes = this.schemeOptions.filter(item => this.configs.schemeOptions.includes(item.name));
        this.selectedTypes = this.typeOptions.filter(item => this.configs.typeOptions.includes(item.name));
        this.updateStoreSelectedFilters();
      } else {
        this.selectedStatus = this.selectedFilters.status;
        this.selectedSchemes = this.selectedFilters.schemes;
        this.selectedTypes = this.selectedFilters.types;
      }

      if (this.quickFiltersStatus.includeLegacy) {
        this.includeLegacy = this.quickFiltersStatus.includeLegacy;
      }
    },

    updateStoreSelectedFilters(): void {
      this.$store.commit("updateSelectedFilters", {
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

    setLegacy(include: boolean): void {
      const emisScheme = this.selectedSchemes.findIndex(scheme => scheme.iri === NAMESPACES.EMIS);
      if (include) {
        if (emisScheme === -1) {
          const found = this.schemeOptions.find(scheme => scheme.iri === NAMESPACES.EMIS);
          if (found) this.selectedSchemes.push(found);
        }
      } else {
        if (emisScheme > -1) {
          this.selectedSchemes.splice(emisScheme, 1);
        }
      }
      this.$store.commit("updateQuickFiltersStatus", {
        key: "includeLegacy",
        value: include
      });
    }
  }
});
</script>

<style scoped>
label {
  font-size: 1rem !important;
}

.p-field {
  margin-top: 1rem;
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
