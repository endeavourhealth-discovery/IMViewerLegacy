<template>
  <div id="sidebar-workflow-container">
    <span id="workflow-searchbar" class="p-input-icon-left">
      <i class="pi pi-search" aria-hidden="true" />
      <InputText
        type="text"
        v-model="searchTerm"
        @input="this.active = 2"
        @change="search()"
        placeholder="Search"
        class="p-inputtext-lg search-input"
        autoWidth="false"
      />
    </span>
    <TabView
      id="workflow-sidemenu"
      class="sidemenu"
      v-model:activeIndex="active"
    >
      <TabPanel>
        <template #header>
          <i class="fas fa-project-diagram icon-header" aria-hidden="true" />
          <span>Workflows</span>
        </template>

        <Listbox
          v-model="selectedWorkflow"
          :options="workflows"
          optionLabel="name"
        >
          <template #option="slotProps">
            <div>
              <span>{{ slotProps.option.name }}</span>
              <Divider />
            </div>
          </template>
        </Listbox>
      </TabPanel>
    </TabView>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SidebarWorkflow",
  emits: ["workflow-selected"],
  watch: {
    selectedWorkflow(newValue) {
      if (newValue) {
        this.$emit("workflow-selected", newValue);
      }
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);

    this.setContainerHeights();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      searchTerm: "",
      active: 0,
      selectedWorkflow: {
        name: "Create New Concept Workflow",
        value: "createWorkflow"
      } as { name: string; value: string },
      workflows: [
        { name: "Create New Concept Workflow", value: "createWorkflow" },
        { name: "Update Concept Workflow", value: "updateWorkflow" }
      ] as { name: string; value: string }[]
    };
  },
  methods: {
    onResize(): void {
      this.setContainerHeights();
    },
    setContainerHeights(): void {
      const sidebar = document.getElementById("sidebar-workflow-container");
      const searchBar = document.getElementById("workflow-searchbar");
      const sideMenu = document.getElementById("workflow-sidemenu");
      if (sidebar && searchBar && sideMenu) {
        sideMenu.style.maxHeight =
          sidebar.offsetHeight - searchBar.offsetHeight + "px";
        sideMenu.style.minHeight =
          sidebar.offsetHeight - searchBar.offsetHeight + "px";
      }
    }
  }
});
</script>

<style scoped>
#sidebar-workflow-container {
  grid-area: sidebar-workflow;
  height: calc(100vh - 2rem);
  width: 30vw;
}

#workflow-sidemenu {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

#workflow-sidemenu ::v-deep(.p-tabview-panels) {
  flex-grow: 6;
  overflow-y: auto;
}

#workflow-searchbar {
  width: 100%;
}

.search-input {
  width: 100%;
}

.icon-header {
  margin: 0 4px 0 0;
}
</style>
