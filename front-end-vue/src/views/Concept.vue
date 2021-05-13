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
      <div v-if="conceptAggregate.concept && isSet">
        <TabView>
          <TabPanel header="Definition">
            <Definition :concept="concept" />
          </TabPanel>
          <TabPanel header="Terms">
            <Terms />
          </TabPanel>
          <TabPanel header="Used In">
            <UsedIn :conceptIri="concept['@id']" />
          </TabPanel>
          <TabPanel header="Members">
            <Members :conceptIri="concept['@id']" />
          </TabPanel>
        </TabView>
      </div>
      <div v-if="conceptAggregate.concept && !isSet">
        <TabView>
          <TabPanel header="Definition">
            <Definition :concept="concept" />
          </TabPanel>
          <TabPanel header="Record structure">
            <Properties :conceptIri="concept['@id']" />
          </TabPanel>
          <TabPanel header="Terms">
            <Terms />
          </TabPanel>
          <TabPanel header="Used In">
            <UsedIn :conceptIri="concept['@id']" />
          </TabPanel>
          <TabPanel header="Graph">
            <Graph :graph="conceptAggregate.graph" />
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
        :conceptAggregate="conceptAggregate"
      />
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
      const conceptTypeElements = this.conceptAggregate?.concept?.[RDF.TYPE];
      return isValueSet(conceptTypeElements);
    },

    ...mapState(["conceptAggregate", "conceptIri"])
  },
  watch: {
    conceptAggregate(newValue): void {
      this.concept = newValue.concept;
      this.icon = getIconFromType(this.concept?.[RDF.TYPE]);
      this.header = this.conceptAggregate?.concept?.[RDFS.LABEL];
    }
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
      items: [
        {
          label: "Edit Concept",
          icon: "pi pi-pencil",
          command: () => {
            this.openEditDialog();
          }
        },
        {
          label: "Download Concept",
          icon: "pi pi-download",
          command: () => {
            this.openDownloadDialog();
          }
        },
        {
          label: "Create New Concept",
          icon: "pi pi-plus",
          command: () => {
            this.openAddDialog();
          }
        }
      ] as { label: string; icon: string; command: () => void }[]
    };
  },
  methods: {
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
  /* height: calc(100vh - 123px); */

  grid-area: content;
  height: 100%;
  width: 100%;
  overflow-y: auto;
}
</style>
