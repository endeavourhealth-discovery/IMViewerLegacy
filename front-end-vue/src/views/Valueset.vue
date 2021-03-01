<template>
  <div class="p-grid">
    <div class="p-col-12"><Header /></div>
    <div class="p-col-4"><Sidebar selectedIri="hello!"/></div>
    <div class="p-col-8"><ConceptDisplayPanel /></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ConceptDisplayPanel from "@/components/panels/ConceptDisplayPanel.vue"; // @ is an alias to /src
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import store from "@/store/index";
import ConceptService from "@/services/ConceptService";

@Options({
  components: {
    ConceptDisplayPanel,
    Header,
    Sidebar
  }
})
export default class Valueset extends Vue {
  private conceptService = new ConceptService();
  async mounted() {
    console.log("Valueset: " + this.$route.params.selectedIri);
    store.state.valuesetIri = this.$route.params.selectedIri as string;
    store.dispatch('fetchConceptAggregate', store.state.valuesetIri);
    console.log(JSON.stringify(store.state));
  }
}
</script>
