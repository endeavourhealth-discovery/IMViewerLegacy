<template>
  <div class="concept-container">
    <Panel>
      <template #icons>
        <button class="p-panel-header-icon p-link p-mr-2" @click="toggle">
          <span class="pi pi-cog"></span>
        </button>
        <Menu id="config_menu" ref="menu" :model="items" :popup="true" />
      </template>
      <template #header>
        <PanelHeader :icon="icon" :header="header" />
      </template>
      <div id="concept-content">
        <div v-if="concept && isSet">
          <TabView>
            <TabPanel header="Definition">
              <Definition :concept="concept" />
            </TabPanel>
            <TabPanel header="Terms">
              <Terms :conceptIri="conceptIri" />
            </TabPanel>
            <TabPanel header="Used In">
              <UsedIn :conceptIri="conceptIri" />
            </TabPanel>
            <TabPanel header="Members">
              <Members :conceptIri="conceptIri" />
            </TabPanel>
          </TabView>
        </div>
        <div v-if="concept && !isSet">
          <TabView v-model:activeIndex="active">
            <TabPanel header="Definition">
              <Definition :concept="concept" />
            </TabPanel>
            <TabPanel header="Record structure">
              <Properties :conceptIri="conceptIri" />
            </TabPanel>
            <TabPanel header="Terms">
              <Terms :conceptIri="conceptIri" />
            </TabPanel>
            <TabPanel header="Used In">
              <UsedIn :conceptIri="conceptIri" />
            </TabPanel>
            <TabPanel header="Graph">
              <div v-if="active === 4">
                <Graph :conceptIri="conceptIri" />
              </div>
            </TabPanel>
          </TabView>
        </div>

        <EditDialog
          @closeDialog="closeDialog"
          :display="display"
          :concept="editorConcept"
          :header="dialogHeader"
          :definitionText="editorDefinitionText"
        />
        <DownloadDialog
          @closeDownloadDialog="closeDownloadDialog"
          :showDialog="showDownloadDialog"
          :conceptIri="conceptIri"
        />
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Properties from "../components/panels/Properties.vue";
import Graph from "../components/panels/Graph.vue";
import Terms from "../components/panels/Terms.vue";
import Definition from "../components/panels/Definition.vue";
import UsedIn from "../components/panels/UsedIn.vue";
import Members from "../components/panels/Members.vue";
import PanelHeader from "../components/panels/PanelHeader.vue";
import { getIconFromType, isValueSet } from "@/helpers/ConceptTypeMethods";
import { mapState } from "vuex";
import { RDFS } from "@/vocabulary/RDFS";
import { RDF } from "@/vocabulary/RDF";
import EditDialog from "@/components/edit/EditDialog.vue";
import DownloadDialog from "@/components/panels/DownloadDialog.vue";
import ConceptService from "@/services/ConceptService";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "Concept",
  components: {
    PanelHeader,
    Properties,
    Graph,
    Terms,
    UsedIn,
    Members,
    Definition,
    EditDialog,
    DownloadDialog
  },
  computed: {
    editorConcept(): any {
      return this.editDialogView ? this.concept : {};
    },

    editorDefinitionText(): any {
      return this.editDialogView ? this.definitionText : "type ";
    },

    isSet(): any {
      const conceptTypeElements = this?.concept?.[RDF.TYPE];
      return isValueSet(conceptTypeElements);
    },

    ...mapState(["conceptIri"])
  },
  watch: {
    async conceptIri(newValue) {
      this.concept = await this.getConcept(newValue);
      this.icon = getIconFromType(this.concept?.[RDF.TYPE]);
      this.header = this.concept?.[RDFS.LABEL];
    },
    windowWidth() {
      this.setContentHeight();
    },
    windowHeight() {
      this.setContentHeight();
    }
  },
  async mounted() {
    await this.init();

    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });

    this.setContentHeight();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      editDialogView: true,
      showDownloadDialog: false,
      concept: {} as any,
      definitionText: "",
      display: false,
      icon: "",
      header: "",
      dialogHeader: "",
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      active: 0,
      items: [
        // {
        //   label: "Edit Concept",
        //   icon: "pi pi-pencil",
        //   command: () => {
        //     this.openEditDialog();
        //   }
        // },
        {
          label: "Download Concept",
          icon: "pi pi-download",
          command: () => {
            this.openDownloadDialog();
          }
        }
        // {
        //   label: "Create New Concept",
        //   icon: "pi pi-plus",
        //   command: () => {
        //     this.openAddDialog();
        //   }
        // }
      ] as { label: string; icon: string; command: () => void }[]
    };
  },
  methods: {
    onResize(): void {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
    },

    setContentHeight(): void {
      const header = document.getElementsByClassName("p-panel-header")[0];
      const content = document.getElementById("concept-content");
      const container = document.getElementsByClassName("concept-container")[0];
      const currentFontSize = parseFloat(
        window
          .getComputedStyle(document.documentElement, null)
          .getPropertyValue("font-size")
      );
      if (content && header && container && currentFontSize) {
        content.style.minHeight =
          container.getBoundingClientRect().height -
          header.getBoundingClientRect().height -
          2 * currentFontSize -
          1 +
          "px";
      } else {
        LoggerService.error(
          "Content sizing error",
          "failed to get element(s) for concept content resizing"
        );
      }
    },

    async getConcept(iri: string) {
      return (await ConceptService.getConcept(iri)).data;
    },

    async init() {
      this.concept = await this.getConcept(this.conceptIri);
      this.icon = getIconFromType(this.concept?.[RDF.TYPE]);
      this.header = this.concept?.[RDFS.LABEL];
    },

    toggle(event: any): void {
      const x = this.$refs.menu as any;
      x.toggle(event);
    },

    closeDialog(): void {
      this.display = false;
    },

    openAddDialog(): void {
      this.editDialogView = false;
      this.dialogHeader = "Create";
      this.display = true;
    },

    openEditDialog(): void {
      this.editDialogView = true;
      this.display = true;
      this.dialogHeader = "Edit";
    },

    openDownloadDialog(): void {
      this.showDownloadDialog = true;
    },

    closeDownloadDialog(): void {
      this.showDownloadDialog = false;
    }
  }
});
</script>
<style scoped>
.concept-container {
  grid-area: content;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
}

.p-panel {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  height: 100%;
}
</style>
