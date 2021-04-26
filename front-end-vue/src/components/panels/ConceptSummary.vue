<template>
  <div>
    <Panel header="Summary" :toggleable="true">
      <template #icons>
        <button class="p-panel-header-icon p-link p-mr-2" @click="toggle">
          <span class="pi pi-cog"></span>
        </button>
        <Menu id="config_menu" ref="menu" :model="items" :popup="true" />
      </template>
      <div class="p-d-flex p-flex-row p-jc-start summary-container">
        <div
          class="left-side"
          v-if="concept['http://www.w3.org/2000/01/rdf-schema#label']"
        >
          <div class="p-d-flex p-flex-row p-jc-start p-ai-center">
            <p>
              <strong>Name:</strong>
              {{ concept["http://www.w3.org/2000/01/rdf-schema#label"] }}
            </p>
            <Button
              id="synonyms-button"
              class="p-button-rounded"
              icon="pi pi-book"
              iconPos="right"
              aria:haspopup="true"
              aria-controls="overlay_panel"
              @click="handleSynonymsClick($event)"
            ></Button>
            <OverlayPanel
              ref="op"
              id="overlay_panel"
              style="width: fit-content;"
            >
              <DataTable
                :value="synonyms.length > 1 ? synonyms : [{ synonym: 'None' }]"
                :paginator="synonyms.length > 10 ? true : false"
                :rows="10"
                responsiveLayout="scroll"
              >
                <Column field="synonym" header="Synonyms"></Column>
              </DataTable>
            </OverlayPanel>
          </div>
          <p class="break-text">
            <strong>Iri:</strong>
            {{ concept["@id"] }}
          </p>
          <p>
            <strong>Code:</strong>
            {{ concept["http://endhealth.info/im#code"] }}
          </p>
          <div v-if="concept['http://www.w3.org/2000/01/rdf-schema#comment']">
            <p>
              <strong>Description:</strong>
            </p>
            <ScrollPanel style="width: 100%; height: 100px" class="custom">
              <div>
                {{ concept["http://www.w3.org/2000/01/rdf-schema#comment"] }}
              </div>
            </ScrollPanel>
          </div>
        </div>
        <div
          class="right-side"
          v-if="concept['http://www.w3.org/2000/01/rdf-schema#label']"
        >
          <p>
            <strong>Status: </strong>
            <span v-if="concept['http://endhealth.info/im#status']">
              {{ concept["http://endhealth.info/im#status"]["name"] }}
            </span>
          </p>
          <p>
            <strong>Scheme: </strong>
            <span v-if="concept['http://endhealth.info/im#scheme']">
              {{ concept["http://endhealth.info/im#scheme"]["name"] }}
            </span>
          </p>
          <p>
            <strong>Types: </strong>
            <span
              v-if="concept['http://www.w3.org/1999/02/22-rdf-syntax-ns#type']"
            >
              {{ conceptTypes }}
            </span>
          </p>
          <p>
            <strong>Definition:</strong>
          </p>
          <Definition
            :definition="definitionText"
            style="width: 95%; height: 100px;"
          />
        </div>
        <EditDialog
          @closeDialog="closeDialog"
          :display="display"
          :concept="editorConcept"
          :definitionText="editorDefinitionText"
        />
        <DownloadDialog
          @closeDownloadDialog="closeDownloadDialog"
          :showDialog="showDownloadDialog"
          :concept="concept"
        />
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ConceptService from "@/services/ConceptService";
import EditDialog from "@/components/edit/EditDialog.vue";
import { mapState } from "vuex";
import Definition from "./Definition.vue";
import LoggerService from "@/services/LoggerService";
import DownloadDialog from "@/components/downloader/DownloadDialog.vue";

@Options({
  name: "ConceptSummary",
  components: { EditDialog, Definition, DownloadDialog },
  prop: {},
  computed: mapState(["conceptAggregate", "conceptIri"]),
  watch: {
    conceptAggregate(newValue) {
      this.concept = newValue.concept;
      ConceptService.getConceptImLang(newValue.concept["@id"])
        .then(res => {
          this.definitionText = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error("Concept IM Lang server request failed", err)
          );
        });
    },
    conceptIri(newValue) {
      ConceptService.getConceptSynonyms(newValue)
        .then(res => {
          this.synonyms = [];
          const url = "http://www.w3.org/2000/01/rdf-schema#label";
          for (const data of res.data) {
            if (data !== this.concept[url]) {
              this.synonyms.push({ synonym: data });
            }
          }
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error("Concept synonyms server request failed", err)
          );
        });
    }
  }
})
export default class ConceptSummary extends Vue {
  editDialogView = true;
  showDownloadDialog = false;
  concept = {} as any;
  definitionText = "";
  display = false;
  synonyms = [] as any;
  conceptIri!: string;

  mounted() {
    ConceptService.getConceptSynonyms(this.conceptIri)
      .then(res => {
        this.synonyms = [];
        for (const data of res.data) {
          this.synonyms.push({ synonym: data });
        }
      })
      .catch(err => {
        this.$toast.add(
          LoggerService.error(
            "Concept synonyms server request failed at component mount",
            err
          )
        );
      });
  }

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

  get conceptTypes() {
    return this.concept["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]
      .map(function(type: any) {
        return type.name;
      })
      .join(", ");
  }

  get editorConcept() {
    return this.editDialogView ? this.concept : {};
  }

  get editorDefinitionText() {
    return this.editDialogView ? this.definitionText : "type ";
  }

  closeDialog() {
    this.display = false;
  }

  openAddDialog() {
    this.editDialogView = false;
    this.display = true;
  }

  openEditDialog() {
    this.editDialogView = true;
    this.display = true;
  }

  openDownloadDialog() {
    this.showDownloadDialog = true;
  }

  closeDownloadDialog() {
    this.showDownloadDialog = false;
  }

  toggle(event: any) {
    const x = this.$refs.menu as any;
    x.toggle(event);
  }

  handleSynonymsClick(event: any) {
    const y = this.$refs.op as any;
    y.toggle(event);
  }
}
</script>

<style scoped>
.summary-container {
  width: 100%;
  gap: 7px;
}

.left-side {
  width: 50%;
}

.right-side {
  width: 50%;
}

.custom .p-scrollpanel-wrapper {
  border-right: 9px solid #f4f4f4;
}

.custom .p-scrollpanel-bar {
  background-color: #1976d2 !important;
  opacity: 1;
  transition: background-color 0.3s;
}

.custom .p-scrollpanel-bar:hover {
  background-color: #135ba1 !important;
}

p {
  margin: 0;
}

#synonyms-button {
  margin-left: 0.5em;
}

.break-text {
  word-break: break-all;
}
</style>
