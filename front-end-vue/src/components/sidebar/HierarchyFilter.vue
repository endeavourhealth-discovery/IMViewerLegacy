<template>
  <div id="h-filter-container" class="p-fluid">
    <div class="reset-button-container">
      <Button label="Reset filters" @click="resetFilters" />
    </div>
    <div class="p-field">
      <span class="p-float-label">
        <MultiSelect id="scheme" v-model="selectedSchemes" @change="updateStoreSelectedFilters" :options="schemeOptions" optionLabel="name" display="chip" />
        <label for="scheme">Select scheme:</label>
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
    selectedSchemes() {
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
      selectedSchemes: [] as Namespace[],
      configs: {} as FilterDefaultsConfig
    };
  },
  methods: {
    async init(): Promise<void> {
      if (!isArrayHasLength(this.filterOptions.schemes)) {
        await this.getFilterOptions();
        this.setFilters();
      }
      this.setDefaults();
    },

    setFilters(): void {
      this.$store.commit("updateFilterOptions", {
        status: this.statusOptions,
        scheme: this.schemeOptions,
        type: this.typeOptions
      });
    },

    setDefaults(): void {
      if (!isArrayHasLength(this.hierarchySelectedFilters.schemes)) {
        this.resetFilters();
      } else {
        this.selectedSchemes = this.hierarchySelectedFilters.schemes;
      }
    },

    updateStoreSelectedFilters(): void {
      this.$store.commit("updateHierarchySelectedFilters", this.selectedSchemes);
    },

    async getFilterOptions(): Promise<void> {
      this.configs = await ConfigService.getFilterDefaults();

      this.schemeOptions = await EntityService.getNamespaces();

      this.statusOptions = await EntityService.getEntityChildren(IM.STATUS);

      this.typeOptions = await EntityService.getEntityChildren(IM.MODELLING_ENTITY_TYPE);
    },

    resetFilters(): void {
      this.selectedSchemes = this.schemeOptions.filter(item => this.configs.schemeOptions.includes(item.iri));
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
</style>
