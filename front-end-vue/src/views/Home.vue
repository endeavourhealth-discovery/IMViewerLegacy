<template>
  <div class="p-grid">
    <div class="p-col-12"><Header /></div>
    <div class="p-col-4"><Sidebar /></div>
    <div class="p-col-8"><Dashboard /></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Dashboard from "@/components/Dashboard.vue"; // @ is an alias to /src
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import store from "@/store/index";


@Options({
  components: {
    Dashboard,
    Header,
    Sidebar
  }
})
export default class Home extends Vue {
  async mounted() {
    store.dispatch('fetchConceptAggregate', store.state.homeIri);
  }
}
</script>
