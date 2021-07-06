<template>
  <side-nav />
  <div class="layout-main">
    <div class="home">
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

<style>
.home {
  height: 100%;
}

.p-tabview {
  height: 100%;
}

.p-tabview-panels {
  height: calc(100% - 3rem);
}

.map {
  width: 100%;
  height: calc(100vh - 7rem) !important;
  background-color: azure;
}

.uprn-form {
  z-index: 10;
  position: absolute;
  top: 6rem;
  left: 23rem;
  width: calc(100% - 30rem);
}

.uprn-form .p-inputtext {
  width: 100%;
}

.btn-search {
  background-color: white !important;
  color: gray !important;
  border-color: lightgray !important;
}

table td,
table td * {
  vertical-align: top;
}

#activity {
  height: calc(100vh - 32rem);
  overflow-y: auto;
}

table {
  width: 100%;
}

.file-upload-instructions-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  gap: 7px;
}

.p-fileupload-row div:first-of-type {
  display: none;
}

.scroll-panel {
  width: 100%;
  height: calc(100vh - 10rem);
  overflow-y: auto;
}
</style>
