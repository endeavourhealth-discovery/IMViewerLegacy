<template>
  <DataTable
    :value="terms"
    :rowsPerPageOptions="[25, 50, 100]"
    :paginator="terms.length > 25 ? true : false"
    :rows="25"
    rowGroupMode="subheader"
    groupRowsBy="scheme.name"
    sortMode="single"
    sortField="scheme.name"
    :sortOrder="1"
    scrollable
    showGridlines
    :scrollHeight="scrollHeight"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
    currentPageReportTemplate="Displaying {first} to {last} of {totalRecords} results"
    class="p-datatable-sm"
    id="terms-table"
  >
    <Column field="scheme.name" header="Scheme"></Column>
    <Column field="term" header="Term" style="flex: 0 0 75%"></Column>
    <Column field="code" header="Code" style="flex: 0 0 25%"></Column>
    <template #groupheader="slotProps">
      <span style="font-weight: 700; color:rgba(51,153,255,0.8)">
        Scheme : {{ slotProps.data.scheme.name }}
      </span>
    </template>
  </DataTable>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import ConceptService from "@/services/ConceptService";

export default defineComponent({
  name: "Terms",
  components: {},
  props: {
    conceptIri: String
  },
  watch: {
    async conceptIri(newValue) {
      await this.getTerms(newValue);
    }
  },
  async mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
    if (this.conceptIri) {
      await this.getTerms(this.conceptIri);
    }
    this.setScrollHeight();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      selected: {},
      loading: false,
      terms: [],
      scrollHeight: ""
    };
  },
  methods: {
    onResize(): void {
      this.setScrollHeight();
      this.setTableWidth();
    },
    async getTerms(iri: string) {
      this.loading = true;
      // TODO call to get the terms
      this.terms = (await ConceptService.getConceptTermCodes(iri)).data;
      this.loading = false;
    },
    onNodeSelect(concept: any) {
      if (concept?.["@id"]) {
        this.$router.push({
          name: "Concept",
          params: { selectedIri: concept["@id"] }
        });
      }
    },
    setScrollHeight(): void {
      const container = document.getElementsByClassName(
        "concept-container"
      )[0] as HTMLElement;
      const header = container.getElementsByClassName(
        "p-panel-header"
      )[0] as HTMLElement;
      const nav = container.getElementsByClassName(
        "p-tabview-nav"
      )[0] as HTMLElement;
      const terms = document.getElementById("terms-table") as HTMLElement;
      const paginator = terms.getElementsByClassName(
        "p-paginator"
      )[0] as HTMLElement;
      const currentFontSize = parseFloat(
        window
          .getComputedStyle(document.documentElement, null)
          .getPropertyValue("font-size")
      );
      const paginatorHeight =
        paginator?.getBoundingClientRect().height === 0
          ? currentFontSize * 3.7
          : paginator?.getBoundingClientRect().height;
      this.scrollHeight =
        container?.getBoundingClientRect().height -
        header?.getBoundingClientRect().height -
        nav?.getBoundingClientRect().height -
        paginatorHeight -
        currentFontSize * 4 -
        1 +
        "px";
    },

    setTableWidth(): void {
      const container = document.getElementById("terms-table") as HTMLElement;
      const table = container.getElementsByClassName(
        "p-datatable-table"
      )[0] as HTMLElement;
      table.style.width = "100%";
    }
  }
});
</script>

<style scoped></style>
