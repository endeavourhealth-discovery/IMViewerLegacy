<template>
  <div id="h-filter-container" class="p-fluid">
    <div class="reset-button-container">
      <Button label="Reset filters" @click="resetFilters" />
    </div>
    <div class="p-field">
      <span class="p-float-label">
        <MultiSelect
          id="scheme"
          v-model="selectedSchemes"
          @change="updateStoreSelectedFilters"
          :options="filterOptions.schemes"
          optionLabel="name"
          display="chip"
        />
        <label for="scheme">Select scheme:</label>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { Namespace } from "@/models/Namespace";
import { isArrayHasLength } from "@/helpers/DataTypeCheckers";

export default defineComponent({
  name: "HierarchyFilters",
  computed: mapState(["filterOptions", "hierarchySelectedFilters", "filterDefaults"]),
  watch: {
    selectedSchemes() {
      this.updateStoreSelectedFilters();
    }
  },
  mounted() {
    this.setDefaults();
  },
  data() {
    return {
      selectedSchemes: [] as Namespace[]
    };
  },
  methods: {
    setDefaults(): void {
      if (!isArrayHasLength(this.hierarchySelectedFilters)) {
        this.resetFilters();
      } else {
        this.selectedSchemes = this.hierarchySelectedFilters;
      }
    },

    updateStoreSelectedFilters(): void {
      this.$store.commit("updateHierarchySelectedFilters", this.selectedSchemes);
    },

    resetFilters(): void {
      this.selectedSchemes = this.filterOptions.schemes.filter((item: Namespace) => this.filterDefaults.schemeOptions.includes(item.iri));
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
