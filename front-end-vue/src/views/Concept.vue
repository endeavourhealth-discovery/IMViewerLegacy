<template>
  <div id="concept-main-container">
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
        <!--<button
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
              <div
                class="concept-panel-content"
                id="definiton-container"
                :style="contentHeight"
              >
                <Definition :concept="concept" v-if="active === 0" />
              </div>
            </TabPanel>
            <TabPanel header="Terms">
              <div
                class="concept-panel-content"
                id="terms-container"
                :style="contentHeight"
              >
                <Terms :conceptIri="conceptIri" v-if="active === 1" />
              </div>
            </TabPanel>
            <TabPanel header="Used in">
              <div
                class="concept-panel-content"
                id="usedin-container"
                :style="contentHeight"
              >
                <UsedIn :conceptIri="conceptIri" v-if="active === 2" />
              </div>
            </TabPanel>
            <TabPanel header="Members">
              <div
                class="concept-panel-content"
                id="members-container"
                :style="contentHeight"
              >
                <Members :conceptIri="conceptIri" v-if="active === 3" />
              </div>
            </TabPanel>
          </TabView>
        </div>
        <div v-if="concept && !isSet" id="concept-panel-container">
          <TabView v-model:activeIndex="active">
            <TabPanel header="Definition">
              <div
                class="concept-panel-content"
                id="definiton-container"
                :style="contentHeight"
              >
                <Definition :concept="concept" v-if="active === 0" />
              </div>
            </TabPanel>
            <TabPanel header="Terms">
              <div
                class="concept-panel-content"
                id="terms-container"
                :style="contentHeight"
              >
                <Terms :conceptIri="conceptIri" v-if="active === 1" />
              </div>
            </TabPanel>
            <TabPanel header="Maps">
              <div
                class="concept-panel-content"
                id="complex-mappings-container"
                :style="contentHeight"
              >
                <ComplexMappings :conceptIri="conceptIri" v-if="active === 2" />
              </div>
            </TabPanel>
            <TabPanel header="Used In">
              <div
                class="concept-panel-content"
                id="usedin-container"
                :style="contentHeight"
              >
                <UsedIn :conceptIri="conceptIri" v-if="active === 3" />
              </div>
            </TabPanel>
            <TabPanel header="Graph">
              <div
                class="concept-panel-content"
                id="graph-container"
                :style="contentHeight"
              >
                <Graph :conceptIri="conceptIri" v-if="active === 4" />
              </div>
            </TabPanel>
            <TabPanel header="Hierarchy position">
              <div
                class="concept-panel-content"
                id="secondary-tree-container"
                :style="contentHeight"
              >
                <SecondaryTree :conceptIri="conceptIri" v-if="active === 5" />
              </div>
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
import Graph from "../components/concept/Graph.vue";
import Terms from "../components/concept/Terms.vue";
import Definition from "../components/concept/Definition.vue";
import UsedIn from "../components/concept/UsedIn.vue";
import Members from "../components/concept/Members.vue";
import PanelHeader from "../components/concept/PanelHeader.vue";
import ComplexMappings from "../components/concept/ComplexMappings.vue";
import { isValueSet } from "@/helpers/ConceptTypeMethods";
import { mapState } from "vuex";
import DownloadDialog from "@/components/concept/DownloadDialog.vue";
import ConceptService from "@/services/ConceptService";
import LoggerService from "@/services/LoggerService";
import SecondaryTree from "../components/concept/SecondaryTree.vue";

export default defineComponent({
  name: "Concept",
  components: {
    PanelHeader,
    Graph,
    Terms,
    UsedIn,
    Members,
    Definition,
    DownloadDialog,
    SecondaryTree,
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
      active: 0,
      contentHeight: ""
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
      this.setContentHeight();
    },

    setContentHeight(): void {
      const container = document.getElementById(
        "concept-main-container"
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
      if (header && container && currentFontSize) {
        const calcHeight =
          container.getBoundingClientRect().height -
          header.getBoundingClientRect().height -
          nav.getBoundingClientRect().height -
          4 * currentFontSize -
          1;
        this.contentHeight =
          "height: " + calcHeight + "px;max-height: " + calcHeight + "px;";
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
#concept-main-container {
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

.concept-panel-content {
  overflow: auto;
  background-color: #ffffff;
}
</style>
