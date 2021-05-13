<template>
  <SideNav />
  <div class="layout-main">
    <div class="main-grid">
      <!-- <Header /> -->
      <SidebarControl />
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import SidebarControl from "@/components/sidebar/SidebarControl.vue";
import store from "@/store/index";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "Home",
  components: {
    SideNav,
    SidebarControl
  },
  emits: ["userPopupToggled"],
  async mounted() {
    // check for user and log them in if found or logout if not
    await store.dispatch("authenticateCurrentUser");
    this.updateRoute();
  },
  methods: {
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
})
</script>

<style scoped>
.main-grid {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "header header"
    "sidebar content";
  column-gap: 7px;
}
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
