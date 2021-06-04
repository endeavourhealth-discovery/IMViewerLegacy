<template>
  <div class="concept-container">
    <Panel>
      <template #icons>
        <button
          class="p-panel-header-icon p-link p-mr-2"
          @click="focusTree"
          v-tooltip.left="'Focus hierarchy tree to this concept'"
        >
          <i class="fas fa-sitemap" aria-hidden="true"></i>
        </button>
        <button
          class="p-panel-header-icon p-link p-mr-2"
          @click="openDownloadDialog"
          v-tooltip.bottom="'Download concept'"
        >
          <i class="fas fa-cloud-download-alt" aria-hidden="true"></i>
        </button>
<!--        <button
          class="p-panel-header-icon p-link p-mr-2"
          @click="directToCreateRoute"
          v-tooltip.bottom="'Create new concept'"
        >
          <i class="fas fa-plus-circle" aria-hidden="true"></i>
        </button>
        <button
          class="p-panel-header-icon p-link p-mr-2"
          @click="directToEditRoute"
          v-tooltip.bottom="'Edit concept'"
        >
          <i class="fas fa-pencil-alt" aria-hidden="true"></i>
        </button>-->
      </template>
      <template #header>
        <PanelHeader :types="types" :header="header" />
      </template>
      <div id="concept-content-dialogs-container">
        <div v-if="concept && isSet" id="concept-panel-container">
          <TabView v-model:activeIndex="active">
            <TabPanel header="Definition">
              <Definition :concept="concept" v-if="active === 0" />
            </TabPanel>
            <TabPanel header="Terms">
              <Terms :conceptIri="conceptIri" v-if="active === 1" />
            </TabPanel>
            <TabPanel header="Used in">
              <UsedIn :conceptIri="conceptIri" v-if="active === 2" />
            </TabPanel>
            <TabPanel header="Members">
              <Members :conceptIri="conceptIri" v-if="active === 3" />
            </TabPanel>
          </TabView>
        </div>
        <div v-if="concept && !isSet" id="concept-panel-container">
          <TabView v-model:activeIndex="active">
            <TabPanel header="Definition">
              <Definition :concept="concept" v-if="active === 0" />
            </TabPanel>
            <TabPanel header="Record structure">
              <Properties :conceptIri="conceptIri" v-if="active === 1" />
            </TabPanel>
            <TabPanel header="Terms">
              <Terms :conceptIri="conceptIri" v-if="active === 2" />
            </TabPanel>
            <TabPanel header="Maps">
              <ComplexMappings :conceptIri="conceptIri" v-if="active === 3" />
            </TabPanel>
            <TabPanel header="Used In">
              <UsedIn :conceptIri="conceptIri" v-if="active === 4" />
            </TabPanel>
            <TabPanel header="Graph">
              <Graph :conceptIri="conceptIri" v-if="active === 5" />
            </TabPanel>
          </TabView>
        </div>
        <DownloadDialog
          v-if="showDownloadDialog"
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
import ComplexMappings from "../components/panels/ComplexMappings.vue";
import { isValueSet } from "@/helpers/ConceptTypeMethods";
import { mapState } from "vuex";
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
    DownloadDialog,
    ComplexMappings
  },
  computed: {
    isSet(): any {
      const conceptTypeElements = this?.concept?.types;
      return isValueSet(conceptTypeElements);
    },

    ...mapState(["conceptIri"])
  },
  watch: {
    async conceptIri(newValue) {
      this.concept = await this.getConcept(newValue);
      this.types = this.concept.types;
      this.header = this.concept.name;
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
      types: [],
      header: "",
      dialogHeader: "",
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      active: 0
    };
  },
  methods: {
    focusTree(): void {
      this.$store.commit("updateFocusTree", true);
    },
    directToEditRoute(): void {
      this.$router.push({
        name: "Edit",
        params: { iri: this.concept["@id"] }
      });
    },
    directToCreateRoute(): void {
      this.$router.push({ name: "Create" });
    },
    onResize(): void {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
    },

    setContentHeight(): void {
      const header = document.getElementsByClassName("p-panel-header")[0];
      const content = document.getElementById(
        "concept-content-dialogs-container"
      );
      const container = document.getElementsByClassName("concept-container")[0];
      const currentFontSize = parseFloat(
        window
          .getComputedStyle(document.documentElement, null)
          .getPropertyValue("font-size")
      );
      if (content && header && container && currentFontSize) {
        const calcHeight =
          container.getBoundingClientRect().height -
          header.getBoundingClientRect().height -
          2 * currentFontSize -
          1 +
          "px";
        content.style.minHeight = calcHeight;
      } else {
        LoggerService.error(
          "Content sizing error",
          "failed to get element(s) for concept content resizing"
        );
      }
    },

    async getConcept(iri: string) {
      return (await ConceptService.getConceptDefinitionDto(iri)).data;
    },

    async init() {
      this.concept = await this.getConcept(this.conceptIri);
      this.types = this.concept?.types;
      this.header = this.concept?.name;
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

.p-tabview-panel {
  min-height: 100%;
}

.p-panel {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  height: 100%;
}
</style>
