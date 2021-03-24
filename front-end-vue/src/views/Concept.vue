<template>
  <div class="p-grid">
    <div class="p-col-12"><Header /></div>
    <div class="p-col-4"><SidebarControl /></div>
    <div class="p-col-8"><PanelControl /></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import PanelControl from "@/components/panels/PanelControl.vue"; // @ is an alias to /src
import Header from "@/components/Header.vue";
import SidebarControl from "@/components/sidebar/SidebarControl.vue";
import store from "@/store/index";

@Options({
  components: {
    PanelControl,
    Header,
    SidebarControl
  }
})
export default class Concept extends Vue {
  async mounted() {
    store.commit("updateConceptIri", this.$route.params.selectedIri as string);
    store.dispatch("fetchConceptAggregate", store.state.conceptIri);
    store.dispatch("fetchConceptMapped", store.state.conceptIri);
    store.dispatch("fetchConceptUsages", store.state.conceptIri);
  }
}
</script>
