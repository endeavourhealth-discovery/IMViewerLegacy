<template>
  <side-nav />
  <div class="layout-main">
    <div class="_container">
      <div class="p-grid _container">
        <CatalogueSideBar :typeOptions="types" :history="history" @updateHistory="updateHistory" />
        <div class="p-col-9 full_height">
          <div v-if="!instanceIri" class="full_height">
            <CatalogueDashboard v-if="types.length" :types="types" class="full_height" />
          </div>
          <div v-else id="panel-container">
            <InstanceDetails v-if="isObjectHasKeysWrapper(instance)" :instance="instance" :instanceIri="instanceIri" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import CatalogueService from "@/services/CatalogueService";
import CatalogueDashboard from "@/components/catalogue/CatalogueDashboard.vue";
import CatalogueSideBar from "@/components/catalogue/CatalogueSideBar.vue";
import InstanceDetails from "@/components/catalogue/InstanceDetails.vue";
import { mapState } from "vuex";
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";

export default defineComponent({
  name: "Catalogue",
  components: {
    CatalogueDashboard,
    SideNav,
    CatalogueSideBar,
    InstanceDetails
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
#search-bar {
  width: 100%;
}
.search-input {
  width: 100%;
}
._container {
  position: relative;
  width: 100%;
  height: 100%;
}

.full_height {
  height: 100%;
}

#side-menu {
  flex-grow: 100;
}

#side-menu ::v-deep(.p-tabview-panels) {
  flex-grow: 6;
  overflow-y: auto;
}

#side-menu ::v-deep(.p-tabview-panel) {
  height: 100%;
}

#panel-container {
  width: 100%;
  display: grid;
  gap: 1rem 1rem;
  align-items: start;
  overflow: auto;
  background-color: #ffffff;
  height: 100%;
}

#tab {
  height: 100%;
  background-color: #ffffff;
}
</style>
