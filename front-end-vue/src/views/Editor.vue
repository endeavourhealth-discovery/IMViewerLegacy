<template>
  <SideNav />
  <ConfirmDialog></ConfirmDialog>
  <div id="editor-main-container">
    <Panel header="Editor">
      <TabView v-model:activeIndex="active">
        <TabPanel header="Form">
          <div class="panel-content" :style="contentHeight">
            <FormEditor v-if="active === 0" :concept="concept" />
          </div>
        </TabPanel>
        <TabPanel header="IMLang">
          <div class="panel-content" :style="contentHeight">
            <!-- <MonacoEditor v-if="active === 1" /> -->
            <p class="placeholder">Monoco Editor placeholder</p>
          </div>
        </TabPanel>
        <TabPanel v-if="hasMembers" header="Members">
          <div class="panel-content" :style="contentHeight">
            <MemberEditor v-if="active === 2" :concept="concept" />
          </div>
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
      active: 0,
      contentHeight: ""
    };
  },
  async mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.setContentHeight);
    });
    const iri = this.$route.params.iri?.toString();
    if (iri) {
      this.concept = (await ConceptService.getConcept(iri)).data;
    }
    this.setContentHeight();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setContentHeight);
  },
  methods: {
    setContentHeight(): void {
      const container = document.getElementById(
        "editor-main-container"
      ) as HTMLElement;
      const header = container.getElementsByClassName(
        "p-panel-header"
      )[0] as HTMLElement;
      const nav = container.getElementsByClassName(
        "p-tabview-nav"
      )[0] as HTMLElement;
      const currentFontSize = parseFloat(
        window
          .getComputedStyle(document.documentElement, null)
          .getPropertyValue("font-size")
      );
      if (container && header && nav && currentFontSize) {
        const height =
          container.getBoundingClientRect().height -
          header.getBoundingClientRect().height -
          nav.getBoundingClientRect().height -
          currentFontSize * 4;
        this.contentHeight = "height: " + height + "px;";
      }
    }
  }
});
</script>

<style scoped>
#editor-main-container {
  margin: 1rem;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
  background-color: #ffffff;
}

.placeholder {
  height: 100%;
}
</style>
