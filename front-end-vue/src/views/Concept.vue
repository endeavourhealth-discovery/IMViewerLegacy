<template>
  <div id="concept-main-container">
    <Panel>
      <template #icons>
        <div class="icons-container">
          <button class="p-panel-header-icon p-link p-mr-2" @click="focusTree" v-tooltip.left="'Focus hierarchy tree to this concept'">
            <i class="fas fa-sitemap" aria-hidden="true"></i>
          </button>
          <div v-if="isObjectHasKeysWrapper(concept, ['axioms'])" class="copy-container">
            <Button
              icon="far fa-copy"
              class="p-button-rounded p-button-text p-button-secondary"
              v-clipboard:copy="copyConceptToClipboardVueWrapper(concept, configs)"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError"
              v-tooltip="'Copy concept to clipboard \n (right click to copy individual properties)'"
              @contextmenu="onCopyRightClick"
            />
            <ContextMenu ref="copyMenu" :model="copyMenuItems" />
          </div>
          <button class="p-panel-header-icon p-link p-mr-2" @click="openDownloadDialog" v-tooltip.bottom="'Download concept'">
            <i class="fas fa-cloud-download-alt" aria-hidden="true"></i>
          </button>
          <button class="p-panel-header-icon p-link p-mr-2" v-tooltip.bottom="'Export concept'" @click="exportConcept">
            <i class="fas fa-file-export" aria-hidden="true"></i>
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
        </div>
      </template>
      <template #header>
        <PanelHeader :types="types" :header="header" />
      </template>
      <div id="concept-content-dialogs-container">
        <div id="concept-panel-container">
          <TabView v-model:activeIndex="active" :lazy="true">
            <TabPanel header="Definition">
              <div v-if="loading" class="loading-container" :style="contentHeight">
                <ProgressSpinner />
              </div>
              <div v-else class="concept-panel-content" id="definition-container" :style="contentHeight">
                <Definition :concept="concept" :configs="configs" />
              </div>
            </TabPanel>
            <TabPanel header="Maps" v-if="showMappings">
              <div class="concept-panel-content" id="mappings-container" :style="contentHeight">
                <Mappings :conceptIri="conceptIri" />
              </div>
            </TabPanel>
            <TabPanel header="Used in">
              <div class="concept-panel-content" id="usedin-container" :style="contentHeight">
                <UsedIn :conceptIri="conceptIri" />
              </div>
            </TabPanel>
            <TabPanel header="Graph" v-if="showGraph">
              <div class="concept-panel-content" id="graph-container" :style="contentHeight">
                <Graph :conceptIri="conceptIri" />
              </div>
            </TabPanel>
            <TabPanel header="Properties" v-if="isRecordModel">
              <div class="concept-panel-content" id="properties-container" :style="contentHeight">
                <Properties :conceptIri="conceptIri" />
              </div>
            </TabPanel>
            <TabPanel header="Members" v-if="isSet">
              <div class="concept-panel-content" id="members-container" :style="contentHeight">
                <Members :conceptIri="conceptIri" @memberClick="active = 0" />
              </div>
            </TabPanel>
            <TabPanel header="Hierarchy position">
              <div class="concept-panel-content" id="secondary-tree-container" :style="contentHeight">
                <SecondaryTree :conceptIri="conceptIri" />
              </div>
            </TabPanel>
          </TabView>
        </div>
        <DownloadDialog v-if="showDownloadDialog" @closeDownloadDialog="closeDownloadDialog" :showDialog="showDownloadDialog" :conceptIri="conceptIri" />
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Graph from "../components/concept/Graph.vue";
import Definition from "../components/concept/Definition.vue";
import UsedIn from "../components/concept/UsedIn.vue";
import Members from "../components/concept/Members.vue";
import PanelHeader from "../components/concept/PanelHeader.vue";
import Mappings from "../components/concept/Mappings.vue";
import { isOfTypes, isValueSet } from "@/helpers/ConceptTypeMethods";
import { mapState } from "vuex";
import DownloadDialog from "@/components/concept/DownloadDialog.vue";
import EntityService from "@/services/EntityService";
import ConfigService from "@/services/ConfigService";
import LoggerService from "@/services/LoggerService";
import SecondaryTree from "../components/concept/SecondaryTree.vue";
import { IM } from "@/vocabulary/IM";
import { RDF } from "@/vocabulary/RDF";
import { RDFS } from "@/vocabulary/RDFS";
import { MODULE_IRIS } from "@/helpers/ModuleIris";
import { OWL } from "@/vocabulary/OWL";
import { SHACL } from "@/vocabulary/SHACL";
import Properties from "@/components/concept/Properties.vue";
import { DefinitionConfig } from "@/models/configs/DefinitionConfig";
import { TTIriRef } from "@/models/TripleTree";
import { copyConceptToClipboard, conceptObjectToCopyString } from "@/helpers/CopyConceptToClipboard";
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";

export default defineComponent({
  name: "Concept",
  components: {
    PanelHeader,
    Graph,
    UsedIn,
    Members,
    Definition,
    DownloadDialog,
    SecondaryTree,
    Mappings,
    Properties
  },
  computed: {
    isSet(): boolean {
      return isValueSet(this.types);
    },

    showGraph(): boolean {
      return isOfTypes(this.types, OWL.CLASS, SHACL.NODESHAPE);
    },

    showMappings(): boolean {
      return isOfTypes(this.types, OWL.CLASS) && !isOfTypes(this.types, SHACL.NODESHAPE);
    },

    isClass(): boolean {
      return isOfTypes(this.types, OWL.CLASS);
    },

    isQuery(): boolean {
      return isOfTypes(this.types, IM.QUERY_TEMPLATE);
    },

    isRecordModel(): boolean {
      return isOfTypes(this.types, SHACL.NODESHAPE);
    },

    isFolder(): boolean {
      return isOfTypes(this.types, IM.FOLDER);
    },

    isProperty(): boolean {
      return isOfTypes(this.types, OWL.OBJECT_PROPERTY, IM.DATA_PROPERTY, OWL.DATATYPE_PROPERTY);
    },

    ...mapState(["conceptIri", "selectedEntityType", "conceptActivePanel", "activeModule"])
  },
  watch: {
    async conceptIri() {
      this.init();
    },

    selectedEntityType(newValue, oldValue) {
      this.setActivePanel(newValue, oldValue);
    },

    active(newValue) {
      this.$store.commit("updateConceptActivePanel", newValue);
    }
  },
  async mounted() {
    await this.init();
    window.addEventListener("resize", this.onResize);
    this.setContentHeight();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      loading: false,
      editDialogView: true,
      showDownloadDialog: false,
      concept: {} as any,
      definitionText: "",
      display: false,
      types: [] as TTIriRef[],
      header: "",
      dialogHeader: "",
      active: 0,
      contentHeight: "",
      contentHeightValue: 0,
      copyMenuItems: [] as any,
      configs: [] as DefinitionConfig[]
    };
  },
  methods: {
    onResize(): void {
      this.setContentHeight();
    },

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

    async getConcept(iri: string): Promise<void> {
      const predicates = this.configs
        .filter((c: DefinitionConfig) => c.type !== "Divider")
        .filter((c: DefinitionConfig) => c.predicate !== "subtypes")
        .filter((c: DefinitionConfig) => c.predicate !== "inferred")
        .filter((c: DefinitionConfig) => c.predicate !== "termCodes")
        .filter((c: DefinitionConfig) => c.predicate !== "axioms")
        .map((c: DefinitionConfig) => c.predicate);

      this.concept = await EntityService.getPartialEntity(iri, predicates);

      this.concept["subtypes"] = await EntityService.getEntityChildren(iri);

      this.concept["termCodes"] = await EntityService.getEntityTermCodes(iri);
    },

    async getInferred(iri: string): Promise<void> {
      const result = await EntityService.getInferredBundle(iri);
      if (isObjectHasKeys(result, ["entity"]) && isObjectHasKeys(result.entity, [IM.IS_A, IM.ROLE_GROUP])) {
        this.concept["inferred"] = { entity: { "http://endhealth.info/im#isA": result.entity[IM.IS_A] }, predicates: result.predicates };
        this.concept["inferred"].entity[IM.IS_A].push({ "http://endhealth.info/im#roleGroup": result.entity[IM.ROLE_GROUP] });
      } else {
        this.concept["inferred"] = result;
      }
    },

    async getStated(iri: string): Promise<void> {
      this.concept["axioms"] = await EntityService.getAxiomBundle(iri);
    },

    async getConfig(name: string): Promise<void> {
      const configReturn = await ConfigService.getComponentLayout(name);
      if (configReturn) {
        this.configs = configReturn;
        this.configs.sort((a: DefinitionConfig, b: DefinitionConfig) => {
          return a.order - b.order;
        });
      }
    },

    async init(): Promise<void> {
      this.loading = true;
      await this.getConfig("definition");
      await this.getConcept(this.conceptIri);
      await this.getInferred(this.conceptIri);
      await this.getStated(this.conceptIri);
      this.types = isObjectHasKeys(this.concept, [RDF.TYPE]) ? this.concept[RDF.TYPE] : ([] as TTIriRef[]);
      this.header = this.concept[RDFS.LABEL];
      this.setCopyMenuItems();
      this.setStoreType();
      this.loading = false;
    },

    setStoreType(): void {
      let type;
      if (this.isSet) {
        type = "Sets";
      } else if (this.isClass && !this.isRecordModel) {
        type = "Ontology";
      } else if (this.isQuery) {
        type = "Queries";
      } else if (this.isRecordModel) {
        type = "DataModel";
      } else if (this.isProperty) {
        type = "Property";
      } else {
        type = this.activeModule;
      }
      this.$store.commit("updateSelectedEntityType", type);
      if (!MODULE_IRIS.includes(this.conceptIri)) {
        this.$store.commit("updateModuleSelectedEntities", {
          module: this.isProperty ? "DataModel" : type,
          iri: this.conceptIri
        });
      }
    },

    setActivePanel(newType: string, oldType: string): void {
      if (newType === oldType) {
        this.active = this.conceptActivePanel;
      } else {
        if (this.isSet) {
          this.active = 2;
        } else if (this.isRecordModel) {
          this.active = 3;
        } else {
          this.active = 0;
        }
      }
    },

    setContentHeight(): void {
      const container = document.getElementById("concept-main-container") as HTMLElement;
      const header = container?.getElementsByClassName("p-panel-header")[0] as HTMLElement;
      const nav = container?.getElementsByClassName("p-tabview-nav")[0] as HTMLElement;
      const currentFontSize = parseFloat(window.getComputedStyle(document.documentElement, null).getPropertyValue("font-size"));
      if (header && container && nav && currentFontSize) {
        const calcHeight =
          container.getBoundingClientRect().height - header.getBoundingClientRect().height - nav.getBoundingClientRect().height - 4 * currentFontSize - 1;
        this.contentHeight = "height: " + calcHeight + "px;max-height: " + calcHeight + "px;";
        this.contentHeightValue = calcHeight;
      } else {
        this.contentHeight = "height: 800px; max-height: 800px;";
        this.contentHeightValue = 800;
        LoggerService.error("Content sizing error", "failed to get element(s) for concept content resizing");
      }
    },

    openDownloadDialog(): void {
      this.showDownloadDialog = true;
    },

    closeDownloadDialog(): void {
      this.showDownloadDialog = false;
    },

    copyConceptToClipboardVueWrapper(concept: any, configs: DefinitionConfig[]) {
      return copyConceptToClipboard(concept, configs);
    },

    onCopy(): void {
      this.$toast.add(LoggerService.success("Value copied to clipboard"));
    },

    onCopyError(): void {
      this.$toast.add(LoggerService.error("Failed to copy value to clipboard"));
    },

    onCopyRightClick(event: any): void {
      const x = this.$refs.copyMenu as any;
      x.show(event);
    },

    setCopyMenuItems(): void {
      this.copyMenuItems = [
        {
          label: "Copy",
          disabled: true
        },
        {
          separator: true
        },
        {
          label: "All",
          command: async () => {
            await navigator.clipboard
              .writeText(copyConceptToClipboard(this.concept, this.configs))
              .then(() => {
                this.$toast.add(LoggerService.success("Concept copied to clipboard"));
              })
              .catch(err => {
                this.$toast.add(LoggerService.error("Failed to copy concept to clipboard", err));
              });
          }
        }
      ];

      let key: string;
      let value: any;
      for ([key, value] of Object.entries(this.concept)) {
        let result = conceptObjectToCopyString(key, value, 0, 1, this.configs);
        if (!result || !result.value) continue;
        const label = result.label;
        const text = result.value;
        this.copyMenuItems.push({
          label: label,
          command: async () => {
            await navigator.clipboard
              .writeText(text)
              .then(() => {
                this.$toast.add(LoggerService.success(label + " copied to clipboard"));
              })
              .catch(err => {
                this.$toast.add(LoggerService.error("Failed to copy " + label + " to clipboard", err));
              });
          }
        });
      }
    },

    isObjectHasKeysWrapper(object: any, keys: string[]) {
      return isObjectHasKeys(object, keys);
    },
    async exportConcept() {
      const modIri = this.conceptIri.replace(/\//gi, "%2F").replace(/#/gi, "%23");
      const url = process.env.VUE_APP_API + "api/entity/exportConcept?iri=" + modIri;
      const popup = window.open(url);
      if (!popup) {
        this.$toast.add(LoggerService.error("Download failed from server"));
      } else {
        this.$toast.add(LoggerService.success("Download will begin shortly"));
      }
      this.closeDownloadDialog();
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
  background-color: #ffffff;
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

.copy-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

.icons-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.loading-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
</style>
