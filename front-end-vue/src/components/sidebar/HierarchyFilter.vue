<template>
  <div class="p-grid">
    <div id="h-filter-container">
      Select scheme:
    </div>
    <div class="p-col-10">
      <MultiSelect
        id="scheme"
        v-model="selectedSchemes"
        @change="updateStoreSelectedFilters"
        :options="filterOptions.schemes"
        optionLabel="name"
        display="chip"
      />
    </div>
    <div class="p-col-1">
      <Button icon="pi pi-undo" @click="resetFilters" class="p-button-rounded p-button-text p-button-plain" v-tooltip="'Reset filters'" />
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
  margin-left: 1rem;
}
</style>
