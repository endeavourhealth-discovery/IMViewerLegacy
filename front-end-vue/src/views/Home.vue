<template>
  <side-nav />
  <div class="layout-main">
    <div class="home">
      <div class="p-grid">
        <div class="p-col-12" id="header-home"><Header /></div>
        <div class="p-col-3" style="height: calc(100vh - 123px);"><SidebarControl /></div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import SideNav from "@/components/home/SideNav.vue";
import Header from "@/components/home/Header.vue";
import SidebarControl from "@/components/sidebar/SidebarControl.vue";
import store from "@/store/index";
import LoggerService from "@/services/LoggerService";

@Options({
  name: "Home",
  components: {
    SideNav,
    Header,
    SidebarControl
  }
})
export default class Home extends Vue {
  async mounted() {
    // check for user and log them in if found or logout if not
    store.dispatch("authenticateCurrentUser");
    this.updateRoute();
  }

  updated() {
    this.updateRoute();
  }

  updateRoute() {
    if (this.$route.name === "Home" || this.$route.name === "Dashboard") {
      store.commit(
        "updateConceptIri",
        "http://endhealth.info/im#DiscoveryOntology"
      );
    } else if (this.$route.name === "Concept") {
      store.commit(
        "updateConceptIri",
        this.$route.params.selectedIri as string
      );
    }
    store
      .dispatch("fetchConceptAggregate", store.state.conceptIri)
      .then(res => {
        if (!res) {
          this.$toast.add(
            LoggerService.error("Concept aggregate server request failed")
          );
        }
      });
    store.dispatch("fetchConceptMapped", store.state.conceptIri).then(res => {
      if (!res) {
        this.$toast.add(
          LoggerService.error("Concept mapped server request failed")
        );
      }
    });
    store.dispatch("fetchConceptUsages", store.state.conceptIri).then(res => {
      if (!res) {
        this.$toast.add(
          LoggerService.error("Concept usages server request failed")
        );
      }
    });
  }
}
</script>

<style>
.header-grow {
  flex-grow: 1;
}

.user-menu {
  height: 100%;
  margin-left: 5px;
  width: 12.5rem;
}

.p-menubar {
  height: 100%;
}
</style>
