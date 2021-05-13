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
        <div>
          <i :class="icon" />
          {{ header }}
        </div>
      </template>
      <div v-if="conceptAggregate.concept && isSet">
        <TabView>
          <TabPanel header="Definition">
            <Definition :concept="concept" />
          </TabPanel>
          <TabPanel header="Record structure">
            <Properties />
          </TabPanel>
          <TabPanel header="Terms">
            <Terms />
          </TabPanel>
          <TabPanel header="Used In">
            <UsedIn />
          </TabPanel>
          <TabPanel header="Members">
            <Members />
          </TabPanel>
        </TabView>
      </div>
      <div v-if="conceptAggregate.concept && !isSet">
        <TabView>
          <TabPanel header="Definition">
            <Definition :concept="concept" />
          </TabPanel>
          <TabPanel header="Record structure">
            <Properties />
          </TabPanel>
          <TabPanel header="Terms">
            <Terms />
          </TabPanel>
          <TabPanel header="Used In">
            <UsedIn />
          </TabPanel>
          <TabPanel header="Graph">
            <Graph />
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
import { Options, Vue } from "vue-class-component";
import Properties from "../components/panels/Properties.vue";
import Graph from "../components/panels/Graph.vue";
import Terms from "../components/panels/Terms.vue";
import Definition from "../components/panels/Definition.vue";
import UsedIn from "../components/panels/UsedIn.vue";
import Members from "../components/panels/Members.vue";
import { ConceptAggregate } from "@/models/TTConcept/ConceptAggregate";
import { getIconFromType, isValueSet } from "@/helpers/ConceptTypeMethods";
import { mapState } from "vuex";
import { RDFS } from "@/vocabulary/RDFS";
import { RDF } from "@/vocabulary/RDF";
import EditDialog from "@/components/edit/EditDialog.vue";
import DownloadDialog from "@/components/panels/DownloadDialog.vue";

@Options({
  name: "Concept",
  components: {
    Properties,
    Graph,
    Terms,
    UsedIn,
    Members,
    Definition,
    EditDialog,
    DownloadDialog
  },
  computed: mapState(["conceptAggregate"]),
  watch: {
    conceptAggregate(newValue) {
      this.concept = newValue.concept;
    }
  }
})
export default class Concept extends Vue {
  private conceptAggregate!: ConceptAggregate;
  private editDialogView = true;
  private showDownloadDialog = false;
  private concept = {} as any;
  private definitionText = "";
  private display = false;
  private dialogHeader = "";

  items = [
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
  ];

  private toggle(event: any) {
    const x = this.$refs.menu as any;
    x.toggle(event);
  }

  private closeDialog() {
    this.display = false;
  }

  private openAddDialog() {
    this.editDialogView = false;
    this.dialogHeader = "Create";
    this.display = true;
  }

  private openEditDialog() {
    this.editDialogView = true;
    this.display = true;
    this.dialogHeader = "Edit";
  }

  private openDownloadDialog() {
    this.showDownloadDialog = true;
  }

  private closeDownloadDialog() {
    this.showDownloadDialog = false;
  }

  private get editorConcept() {
    return this.editDialogView ? this.concept : {};
  }

  private get editorDefinitionText() {
    return this.editDialogView ? this.definitionText : "type ";
  }

  private get header() {
    return this.conceptAggregate?.concept?.[RDFS.LABEL];
  }

  private get isSet() {
    const conceptTypeElements = this.conceptAggregate?.concept?.[RDF.TYPE];
    return isValueSet(conceptTypeElements);
  }

  private get icon() {
    const icon = getIconFromType(this.concept?.[RDF.TYPE]);
    return icon;
  }
}
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
