<template>
  <Listbox
    v-model="selectedHistoryItem"
    :options="getHistory()"
    optionLabel="conceptName"
    @click="navigate"
    class="history-listbox"
  >
    <template #option="slotProps">
      <div>
        <span>{{ slotProps.option.conceptName }}</span>
      </div>
    </template>
  </Listbox>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { HistoryItem } from "@/models/HistoryItem";
import { mapState } from "vuex";

export default defineComponent({
  name: "History",
  computed: mapState(["history", "sideNavHierarchyFocus"]),
  data() {
    return {
      selectedHistoryItem: {} as HistoryItem
    };
  },
  methods: {
    getHistory(): any {
      const viewHistory = this.history.filter((obj: any) => {
        return !!obj.conceptName;
      });
      return viewHistory;
    },

    navigate(): void {
      if (this.selectedHistoryItem.url === "/") {
        switch (this.selectedHistoryItem.conceptName) {
          case "Ontologies":
            this.$store.commit("updateSideNavHierarchyFocus", {
              name: "Ontology",
              fullName: "Ontologies",
              iri: "http://endhealth.info/im#DiscoveryOntology"
            });
            break;
          case "Concept sets and value sets":
            this.$store.commit("updateSideNavHierarchyFocus", {
              name: "Sets",
              fullName: "Concept sets and value sets",
              iri: "http://endhealth.info/im#Sets"
            });
            break;
          case "":
            this.$store.commit("updateSideNavHierarchyFocus", {
              name: "Queries",
              fullName: "Query templates",
              iri: "http://endhealth.info/im#QT_QueryTemplates"
            });
            break;
        }
        this.$store.commit("updateConceptIri", this.sideNavHierarchyFocus.iri);
      }
      this.$router.push(this.selectedHistoryItem.url);
    }
  }
});
</script>

<style scoped>
.history-listbox {
  height: 100%;
  overflow: auto;
}
</style>
