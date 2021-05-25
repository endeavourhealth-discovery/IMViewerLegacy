<template>
  <div class="p-col-3">
    <span class="p-input-icon-left" style="width: 100%">
      <i class="pi pi-search" aria-hidden="true" />
      <InputText
        type="text"
        v-model="searchTerm"
        @input="this.active = 2"
        @change="search()"
        placeholder="Search"
        class="p-inputtext-lg"
        autoWidth="false"
        style="width: 100%"
      />
    </span>
    <TabView class="sidemenu" v-model:activeIndex="active">
      <TabPanel>
        <template #header>
          <i
            class="fas fa-project-diagram"
            style="padding: 1px;"
            aria-hidden="true"
          />
          <span>Workflows</span>
        </template>

        <Listbox
          v-model="workflow"
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

<script>
import { defineComponent } from "vue"

export default defineComponent({
  name: "SidebarWorkflow",
  props: ["selectedWorkflow", "workflows"],
  data() {
    return {
      searchTerm: "",
      active: 0,
      workflow: this.selectedWorkflow
    }
  }

});
</script>

<style>

</style>
