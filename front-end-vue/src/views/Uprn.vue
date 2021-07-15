<template>
  <side-nav />
  <div class="layout-main">
    <div id="uprn-home">
      <TabView>
        <TabPanel header="Single address lookup">
          <AddressLookup />
        </TabPanel>
        <TabPanel header="Address file workflow">
          <FileWorkflow />
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import AddressLookup from "@/components/uprn/AddressLookup.vue";
import FileWorkflow from "@/components/uprn/FileWorkflow.vue";

export default defineComponent({
  name: "Uprn",
  components: {
    SideNav,
    AddressLookup,
    FileWorkflow
  }
});
</script>

<style scoped>
#uprn-home {
  height: 100%;
}

.p-tabview {
  height: 100%;
}

.p-tabview-panels {
  height: calc(100% - 3rem);
}
</style>
