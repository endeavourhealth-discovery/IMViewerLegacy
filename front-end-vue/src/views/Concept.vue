<template>
  <div id="concept-main-container">
    <Panel>
      <template #icons>
        <div class="icons-container">
          <button
            class="p-panel-header-icon p-link p-mr-2"
            @click="focusTree"
            v-tooltip.left="'Focus hierarchy tree to this concept'"
          >
            <i class="fas fa-sitemap" aria-hidden="true"></i>
          </button>
          <div v-if="'iri' in concept" class="copy-container">
            <Button
              icon="far fa-copy"
              class="p-button-rounded p-button-text p-button-secondary"
              v-clipboard:copy="copyConceptToClipboard(concept)"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError"
              v-tooltip="
                'Copy concept to clipboard \n (right click to copy individual properties)'
              "
              @contextmenu="onCopyRightClick"
            />
            <ContextMenu ref="copyMenu" :model="copyMenuItems" />
          </div>
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
        </div>
      </template>
      <template #header>
        <PanelHeader :types="types" :header="header" />
      </template>
      <div id="concept-content-dialogs-container">
        <div
          v-if="Object.keys(concept).length && isSet"
          id="concept-panel-container"
        >
          <TabView v-model:activeIndex="active">
            <TabPanel header="Definition">
              <div
                class="concept-panel-content"
                id="definition-container"
                :style="contentHeight"
              >
                <Definition
                  :concept="concept"
                  :properties="properties"
                  :contentHeight="contentHeightValue"
                  v-if="active === 0"
                />
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
            <TabPanel header="Hierarchy position">
              <div
                class="concept-panel-content"
                id="secondary-tree-container"
                :style="contentHeight"
              >
                <SecondaryTree :conceptIri="conceptIri" v-if="active === 4" />
              </div>
            </TabPanel>
          </TabView>
        </div>
        <div
          v-if="Object.keys(concept).length && !isSet"
          id="concept-panel-container"
        >
          <TabView v-model:activeIndex="active">
            <TabPanel header="Definition">
              <div
                class="concept-panel-content"
                id="definition-container"
                :style="contentHeight"
              >
                <Definition
                  :concept="concept"
                  :properties="properties"
                  :contentHeight="contentHeightValue"
                  v-if="active === 0"
                />
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
    async conceptIri() {
      this.init();
    },
    concept(newValue) {
      if (Object.keys(newValue).length) {
        this.setCopyMenuItems(newValue);
      }
    }
  },
  async mounted() {
    await this.init();

    this.$nextTick(() => {
      window.addEventListener("resize", this.setContentHeight);
    });

    this.setContentHeight();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setContentHeight);
  },
  data() {
    return {
      editDialogView: true,
      showDownloadDialog: false,
      concept: {} as any,
      properties: [] as any[],
      definitionText: "",
      display: false,
      types: [],
      header: "",
      dialogHeader: "",
      active: 0,
      contentHeight: "",
      contentHeightValue: 0,
      copyMenuItems: [] as any
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
        this.contentHeightValue = calcHeight;
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

    async getProperties(iri: string) {
      return (await ConceptService.getRecordStructure(iri)).data;
    },

    async init() {
      this.properties = await this.getProperties(this.conceptIri);
      this.concept = await this.getConcept(this.conceptIri);
      this.types = this.concept?.types;
      this.header = this.concept?.name;
    },

    openDownloadDialog(): void {
      this.showDownloadDialog = true;
    },

    closeDownloadDialog(): void {
      this.showDownloadDialog = false;
    },

    copyConceptToClipboard(concept: any): string {
      let isasString = "";
      let subTypesString = "";
      let propertiesString = "";
      if (concept.isa.length > 0) {
        isasString = concept.isa.map((item: any) => item.name).join(",\n\t");
      }
      if (concept.subtypes.length > 0) {
        subTypesString = concept.subtypes
          .map((item: any) => item.name)
          .join(",\n\t");
      }
      if (this.properties.length > 0) {
        propertiesString = this.properties
          .map((item: any) => item.property.name)
          .join(",\n\t");
      }
      let returnString =
        "Name: " +
        concept.name +
        ",\nIri: " +
        concept.iri +
        ",\nStatus: " +
        concept.status +
        ",\nType: " +
        concept.types[0].name +
        ",\nIs-a: " +
        "[\n\t" +
        isasString +
        "\n]" +
        ",\nSub-types: " +
        "[\n\t" +
        subTypesString +
        "\n]" +
        ",\nProperties: " +
        "[\n\t" +
        propertiesString +
        "\n]";
      if (concept.description) {
        returnString = returnString + ",\nDescription: " + concept.description;
      }
      return returnString;
    },

    onCopy(): void {
      this.$toast.add(LoggerService.success("Value copied to clipboard"));
    },

    onCopyError(): void {
      this.$toast.add(LoggerService.error("Failed to copy value to clipboard"));
    },

    onCopyRightClick(event: any) {
      const x = this.$refs.copyMenu as any;
      x.show(event);
    },

    setCopyMenuItems(concept: any) {
      let isasString = "";
      let subTypesString = "";
      let propertiesString = "";
      if ("isa" in concept && concept.isa.length > 0) {
        isasString = concept.isa.map((item: any) => item.name).join(",\n\t");
      }
      if ("subtypes" in concept && concept.subtypes.length > 0) {
        subTypesString = concept.subtypes
          .map((item: any) => item.name)
          .join(",\n\t");
      }
      if (this.properties.length > 0) {
        propertiesString = this.properties
          .map((item: any) => item.property.name)
          .join(",\n\t");
      }
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
              .writeText(this.copyConceptToClipboard(concept))
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Concept copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error(
                    "Failed to copy concept to clipboard",
                    err
                  )
                );
              });
          }
        },
        {
          label: "Name",
          command: async () => {
            await navigator.clipboard
              .writeText("Name: " + concept.name)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Name copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy name to clipboard", err)
                );
              });
          }
        },
        {
          label: "Iri",
          command: async () => {
            await navigator.clipboard
              .writeText("Iri: " + concept.iri)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Iri copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy iri to clipboard", err)
                );
              });
          }
        },
        {
          label: "Status",
          command: async () => {
            await navigator.clipboard
              .writeText("Status: " + concept.status)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Status copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy status to clipboard", err)
                );
              });
          }
        },
        {
          label: "Type",
          command: async () => {
            await navigator.clipboard
              .writeText("Types: " + concept.types[0].name)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Type copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy type to clipboard", err)
                );
              });
          }
        },
        {
          label: "Is a",
          command: async () => {
            await navigator.clipboard
              .writeText("Is-a: [\n\t" + isasString + "\n]")
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Is-a's copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy is-a's to clipboard", err)
                );
              });
          }
        },
        {
          label: "Sub-types",
          command: async () => {
            await navigator.clipboard
              .writeText("Subtypes: [\n\t" + subTypesString + "\n]")
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Subtypes copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error(
                    "Failed to copy subtypes to clipboard",
                    err
                  )
                );
              });
          }
        },
        {
          label: "Properties",
          command: async () => {
            await navigator.clipboard
              .writeText("Properties: [\n\t" + propertiesString + "\n]")
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Properties copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error(
                    "Failed to copy properties to clipboard",
                    err
                  )
                );
              });
          }
        }
      ];
      if (concept.description) {
        this.copyMenuItems.push({
          label: "Description",
          command: async () => {
            await navigator.clipboard
              .writeText(concept.description)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Description copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error(
                    "Failed to copy description to clipboard",
                    err
                  )
                );
              });
          }
        });
      }
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
</style>
