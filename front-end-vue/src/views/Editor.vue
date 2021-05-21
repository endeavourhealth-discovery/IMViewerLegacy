<template>
  <SideNav />
  <ConfirmDialog></ConfirmDialog>
  <div class="edit-panel">
    <Panel header="Editor">
      <TabView>
        <TabPanel header="Form">
          <FormEditor :concept="concept" />
        </TabPanel>
        <TabPanel header="IMLang">
          <MonacoEditor />
        </TabPanel>
      </TabView>
    </Panel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import FormEditor from "@/components/edit/FormEditor.vue";
import ConceptService from "@/services/ConceptService";
// import MonacoEditor from "@/components/edit/MonacoEditor.vue";
import ConfirmDialog from "primevue/confirmdialog";

export default defineComponent({
  name: "Edit",
  components: {
    SideNav,
    // MonacoEditor,
    ConfirmDialog,
    FormEditor
  },
  beforeRouteLeave(to, from, next) {
    this.$confirm.require({
      message:
        "All unsaved changes will be lost. Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        next();
      }
    });
  },
  data() {
    return {
      concept: {} as any
    };
  },
  async mounted() {
    const iri = this.$route.params.iri?.toString();
    if (iri) {
      this.concept = (await ConceptService.getConcept(iri)).data;
    }
  }
});
</script>

<style scoped>
.edit-panel {
  grid-area: content;
  margin: 1rem;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
}
</style>
