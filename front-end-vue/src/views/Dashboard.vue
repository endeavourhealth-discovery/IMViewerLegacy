<template>
  <div class="p-d-flex p-flex-row p-jc-center p-ai-center loading -container" v-if="loading">
    <ProgressSpinner />
  </div>
  <div v-if="!loading" class="dashboard-container">
    <template v-for="(cardData, index) in cardsData" :key="index">
      <component :is="cardData.component" :inputData="cardData.inputData" :name="cardData.name" :description="cardData.description" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ReportTable from "@/components/dashboard/ReportTable.vue";
import ReportPieChart from "@/components/dashboard/ReportPieChart.vue";
import ConfigService from "@/services/ConfigService";
import { IM } from "@/vocabulary/IM";
import { DashboardLayout } from "@/models/configs/DashboardLayout";
import EntityService from "@/services/EntityService";
import { RDFS } from "@/vocabulary/RDFS";
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";

export default defineComponent({
  name: "Dashboard",
  components: {
    ReportTable,
    ReportPieChart
  },
  async mounted() {
    await this.init();
  },
  data() {
    return {
      loading: false,
      configs: [] as DashboardLayout[],
      cardsData: [] as { name: string; description: string; inputData: any; component: string }[]
    };
  },
  methods: {
    async init(): Promise<void> {
      this.loading = true;
      await this.getConfigs();
      await this.getCardsData();
      this.loading = false;
    },

    async getConfigs(): Promise<void> {
      this.configs = await ConfigService.getDashboardLayout("conceptDashboard");
    },

    async getCardsData(): Promise<void> {
      this.configs.forEach(async config => {
        const result = await EntityService.getPartialEntity(config.iri, [RDFS.LABEL, RDFS.COMMENT, IM.STATS_REPORT_ENTRY]);
        if (!isObjectHasKeys(result)) return;
        const cardData = {
          name: result[RDFS.LABEL],
          description: result[RDFS.COMMENT],
          inputData: result[IM.STATS_REPORT_ENTRY],
          component: config.type
        };
        this.cardsData.push(cardData);
      });
    }
  }
});
</script>

<style scoped>
.dashboard-container {
  grid-area: content;
  display: grid;
  column-gap: 7px;
  row-gap: 7px;
  width: 100%;
  height: calc(100vh - 2rem);
  overflow-y: auto;
  overflow-x: hidden;
}

@media screen and (min-width: 1024px) {
  .dashboard-container {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
      "overview types"
      "schemes status";
  }
}

@media screen and (max-width: 1023px) {
  .dashboard-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-areas:
      "overview"
      "types"
      "schemes"
      "status";
  }
}
</style>
