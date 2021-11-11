<template>
  <SideNav />
  <div class="layout-main">
    <div class="catalogue-grid">
      <CatalogueSideBar :typeOptions="types" :history="history" @updateHistory="updateHistory" />
      <router-view :instanceIri="instanceIri" :instance="instance" :history="history" :types="types" @updateHistory="updateHistory" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import CatalogueService from "@/services/CatalogueService";
import CatalogueSideBar from "@/components/catalogue/CatalogueSideBar.vue";
import { mapState } from "vuex";
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import { IM } from "@/vocabulary/IM";

export default defineComponent({
  name: "Catalogue",
  components: {
    SideNav,
    CatalogueSideBar
  },
  watch: {
    async instanceIri() {
      this.init();
    }
  },
  computed: { ...mapState(["catalogueSearchTerm", "instanceIri"]) },
  data() {
    return {
      instance: {} as any,
      history: [] as any[],
      location: "",
      types: [] as any[],
      dash: true,
      loading: false,
      isEditing: false
    };
  },
  async mounted() {
    this.$store.commit("updateSideNavHierarchyFocus", {
      name: "Catalogue",
      fullName: "Catalogue",
      route: "Catalogue",
      iri: IM.MODULE_CATALOGUE
    });
    await this.init();
  },
  methods: {
    async init() {
      await this.getTypesCount();
      if (this.instanceIri.length) {
        this.getInstance();
        this.$router.push({ name: "Individual", params: { selectedIri: this.instanceIri } });
      } else {
        this.$router.push({ name: "CatalogueDashboard" });
      }
    },

    async getTypesCount() {
      const result = await CatalogueService.getTypesCount();
      this.types = result;
    },

    async getInstance() {
      const result = await CatalogueService.getPartialInstance(this.instanceIri);
      if (result) this.instance = result;
      else this.instance = {} as any;
    },

    isObjectHasKeysWrapper(object: any) {
      return isObjectHasKeys(object);
    },

    updateHistory(historyItem: any) {
      if (!this.history.includes(historyItem)) {
        this.history.push(historyItem);
      }
    }
  }
});
</script>
<style scoped>
.catalogue-grid {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: "sidebar content";
  column-gap: 7px;
}
</style>
