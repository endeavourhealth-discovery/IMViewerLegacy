<template>
  <div class="p-d-flex p-flex-row p-jc-center" v-if="loading">
    <div class="spinner">
      <ProgressSpinner />
    </div>
  </div>
  <Listbox
    v-else
    :listStyle="listHeight"
    :filter="true"
    emptyMessage="No results found"
    emptyFilterMessage="No results found"
    v-model="selectedUsage"
    @change="onNodeSelect(selectedUsage)"
    :options="usages"
    optionLabel="name"
  ></Listbox>
</template>
<script lang="ts">
import ConceptService from "@/services/ConceptService";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "UsedIn",
  components: {},
  props: {
    conceptIri: String
  },
  watch: {
    async conceptIri(newValue) {
      await this.getUsages(newValue);
    }
  },
  async mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.setListboxHeight);
    });
    this.setListboxHeight();
    if (this.conceptIri) {
      await this.getUsages(this.conceptIri);
    }
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setListboxHeight);
  },
  data() {
    return {
      selectedUsage: {},
      usages: [],
      loading: false,
      listHeight: ""
    };
  },
  methods: {
    async getUsages(iri: string) {
      this.loading = true;
      this.usages = (await ConceptService.getConceptUsages(iri)).data;
      this.loading = false;
    },

    onNodeSelect(concept: any) {
      this.$router.push({
        name: "Concept",
        params: { selectedIri: concept["@id"] }
      });
    },

    setListboxHeight(): void {
      const conceptContainer = document.getElementsByClassName(
        "concept-container"
      )[0] as HTMLElement;
      const header = conceptContainer.getElementsByClassName(
        "p-panel-header"
      )[0];
      const nav = conceptContainer.getElementsByClassName(
        "p-tabview-nav"
      )[0];
      const listHeader = conceptContainer.getElementsByClassName(
        "p-listbox-header"
      )[0] as HTMLElement;
      const currentFontSize = parseFloat(
        window
          .getComputedStyle(document.documentElement, null)
          .getPropertyValue("font-size")
      );
      console.log(conceptContainer)
      console.log(header)
      console.log(nav)
      console.log(listHeader)
      if (conceptContainer && header && nav && listHeader && currentFontSize) {
        const newHeight =
          conceptContainer.getBoundingClientRect().height -
          header.getBoundingClientRect().height -
          nav.getBoundingClientRect().height -
          listHeader.getBoundingClientRect().height -
          currentFontSize * 4 -
          1;
        this.listHeight =
          "height: " + newHeight
          "px;"
      }
    }
  }
});
</script>

<style scoped>
.usage-mapping-container {
  width: 100%;
}

.mapping-container {
  width: 50%;
}

.usage-container {
  width: 50%;
}
</style>
