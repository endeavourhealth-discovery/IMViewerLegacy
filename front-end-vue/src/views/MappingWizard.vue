<template>
  <SideNav />
  <div id="container">
    <Panel header="Mapping Wizard">
      <TabPanel>
        <Steps :model="items" />
        <router-view />
      </TabPanel>
    </Panel>
    <div v-if="loading" class="loading-container">
      <ProgressSpinner />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";

export default defineComponent({
  name: "MappingWizard",
  components: {
    SideNav
  },
  computed: {},
  data() {
    return {
      items: [
        {
          label: "Personal",
          to: "/steps"
        },
        {
          label: "Seat",
          to: "/steps/seat"
        },
        {
          label: "Payment",
          to: "/steps/payment"
        },
        {
          label: "Confirmation",
          to: "/steps/confirmation"
        }
      ]
    };
  },
  methods: {}
});
</script>

<style scoped>
#container {
  margin: 1rem;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
}

.loading-container {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

#button-bar {
  padding: 0 2rem 1rem 0;
  gap: 0.5rem;
}
</style>
