<template>
  <SideNav />
  <ConfirmDialog></ConfirmDialog>
  <div id="edit-panel">
    <Panel header="Editor">
      <TabView v-model:activeIndex="active">
        <TabPanel header="Form">
          <FormEditor v-if="active === 0" :concept="concept" />
        </TabPanel>
        <TabPanel header="IMLang">
          <!-- <MonacoEditor v-if="active === 1" /> -->
          <p>Monoco Editor placeholder</p>
        </TabPanel>
        <TabPanel v-if="hasMembers" header="Members">
          <MemberEditor v-if="active === 2" :concept="concept" />
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
import MemberEditor from "@/components/edit/MemberEditor.vue";
import { IM } from "@/vocabulary/IM";

export default defineComponent({
  name: "Editor",
  components: {
    SideNav,
    // MonacoEditor,
    ConfirmDialog,
    FormEditor,
    MemberEditor
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
  computed: {
    hasMembers(): any {
      return IM.HAS_MEMBERS in this.concept ? true : false;
    }
  },
  data() {
    return {
      concept: {} as any,
      active: 0
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
#edit-panel {
  grid-area: content;
  margin: 1rem;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
}
</style>
