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

export default defineComponent({
  name: "Catalogue",
  components: {
    SideNav,
    CatalogueSideBar
  },
  watch: {
    async instanceIri() {
      this.getInstance();
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
    await this.getTypesCount();
    if (this.instanceIri) {
      this.getInstance();
      this.$router.push({ name: "Individual", params: this.instanceIri });
    } else {
      this.$router.push({ name: "CatalogueDashboard" });
    }
  },
  methods: {
    async getTypesCount() {
      const result = await CatalogueService.getTypesCount();
      this.types = result;
    },

    async getInstance() {
      this.instance = await CatalogueService.getPartialInstance(this.instanceIri);
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
