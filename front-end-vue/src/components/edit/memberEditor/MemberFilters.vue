<template>
  <div class="filters-title-container">
    <p class="title">Search filters:</p>
    <div class="filters-container">
      <!-- <div class="quick-filters-container">
        <div class="quick-filter-container">
          <label>Include legacy:</label>
          <InputSwitch v-model="includeLegacy" />
        </div>
      </div> -->
      <div class="p-field">
        <span class="p-float-label">
          <MultiSelect id="status" v-model="selectedStatus" @change="checkForSearch" :options="statusOptions" optionLabel="name" display="chip" />
          <label for="status">Status:</label>
        </span>
      </div>

      <div class="p-field">
        <span class="p-float-label">
          <MultiSelect id="scheme" v-model="selectedSchemes" @change="checkForSearch" :options="schemeOptions" optionLabel="name" display="chip" />
          <label for="scheme">Scheme:</label>
        </span>
      </div>

      <div class="p-field">
        <span class="p-float-label">
          <MultiSelect id="conceptType" v-model="selectedTypes" @change="checkForSearch" :options="typeOptions" optionLabel="name" display="chip" />
          <label for="scheme">Concept type:</label>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ConfigService from "@/services/ConfigService";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MemberFilters",
  components: {},
  props: ["search", "filterOptions", "configs"],
  emits: ["selectedFiltersUpdated"],
  watch: {
    // includeLegacy(newValue) {
    //   this.setLegacy(newValue);
    // },
    selectedStatus() {
      this.$emit("selectedFiltersUpdated", { status: this.selectedStatus, scheme: this.selectedSchemes, type: this.selectedTypes });
    },
    selectedSchemes() {
      this.$emit("selectedFiltersUpdated", { status: this.selectedStatus, scheme: this.selectedSchemes, type: this.selectedTypes });
    },
    selectedTypes() {
      this.$emit("selectedFiltersUpdated", { status: this.selectedStatus, scheme: this.selectedSchemes, type: this.selectedTypes });
    }
  },
  async mounted() {
    this.statusOptions = this.filterOptions.status;
    this.schemeOptions = this.filterOptions.scheme;
    this.typeOptions = this.filterOptions.type;
    // await this.getFilterOptions();
    // this.setFilters();
    this.setDefaults();
  },
  data() {
    return {
      statusOptions: [] as any[],
      schemeOptions: [] as any[],
      typeOptions: [] as any[],
      selectedStatus: [] as any[],
      selectedSchemes: [] as any[],
      selectedTypes: [] as any[],
      includeLegacy: false
    };
  },
  methods: {
    checkForSearch() {
      // this.updateStoreSelectedFilters();
      this.search();
    },

    // setFilters() {
    //   this.$store.commit("updateFilterOptions", {
    //     status: this.statusOptions,
    //     scheme: this.schemeOptions,
    //     type: this.typeOptions
    //   });
    // },

    setDefaults() {
      if (!this.selectedStatus.length && !this.selectedSchemes.length && !this.selectedTypes.length) {
        this.selectedStatus = this.statusOptions.filter(item => this.configs.statusOptions.includes(item.name));
        this.selectedSchemes = this.schemeOptions.filter(item => this.configs.schemeOptions.includes(item.name));
        this.selectedTypes = this.typeOptions.filter(item => this.configs.typeOptions.includes(item.name));
        // this.updateStoreSelectedFilters();
      }

      // if (this.quickFiltersStatus.includeLegacy) {
      //   this.includeLegacy = this.quickFiltersStatus.includeLegacy;
      // }
    },

    // updateStoreSelectedFilters() {
    //   this.$store.commit("updateSelectedFilters", {
    //     status: this.selectedStatus,
    //     schemes: this.selectedSchemes,
    //     types: this.selectedTypes
    //   });
    // },



    // setLegacy(include: boolean) {
    //   const emisScheme = this.selectedSchemes.findIndex(scheme => scheme.iri === "http://endhealth.info/emis#");
    //   if (include) {
    //     if (emisScheme === -1) {
    //       this.selectedSchemes.push(this.schemeOptions.find(scheme => scheme.iri === "http://endhealth.info/emis#"));
    //     }
    //   } else {
    //     if (emisScheme > -1) {
    //       this.selectedSchemes.splice(emisScheme, 1);
    //     }
    //   }
    //   this.$store.commit("updateQuickFiltersStatus", {
    //     key: "includeLegacy",
    //     value: include
    //   });
    // }
  }
});
</script>

<style scoped>
.filters-container {
  padding: 1rem 1rem 0 1rem;
  display: flex;
  flex-flow: column nowrap;
  border: solid lightgrey 1px;
  border-radius: 3px;
}

.title {
  font-size: 1rem;
  font-weight: bold;
  padding: 1rem 0 0 0;
  margin: 0;
}

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
