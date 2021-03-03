<template>
  <span class="p-input-icon-left" style="width: 100%">
    <i class="pi pi-search" />
    <InputText
      type="text"
      v-model="searchResult"
      placeholder="Search"
      class="p-inputtext-lg"
      autoWidth="false"
      style="width: 100%"
    />
  </span>

  <TabView class="sidemenu">
    <TabPanel>
      <template #header>
        <font-awesome-icon
          :icon="['fas', 'project-diagram']"
          style="padding: 1px"
        />
        <span>Hierarchy</span>
      </template>
      <Hierarchy />
    </TabPanel>
    <TabPanel>
      <template #header>
        <font-awesome-icon :icon="['fas', 'history']" style="padding: 1px" />
        <span>History</span>
      </template>
      <History />
    </TabPanel>
    <TabPanel>
      <template #header>
        <font-awesome-icon :icon="['fas', 'search']" style="padding: 1px" />
        <span>Search results</span>
      </template>
      <SearchResults />
    </TabPanel>
  </TabView>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Hierarchy from "@/components/sidebar/Hierarchy.vue";
import History from "@/components/sidebar/History.vue";
import SearchResults from "@/components/sidebar/SearchResults.vue";

@Options({
  components: { Hierarchy, History, SearchResults },
})
export default class SidebarControl extends Vue {}
</script>

<style>
.sidemenu .p-tabview-panels {
  height: calc(100vh - 270px);
}
</style>
