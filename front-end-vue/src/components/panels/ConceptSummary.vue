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
              <!-- div content injected by javascript -->
              <div id="description"></div>
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
          :header="dialogHeader"
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
import { RDF } from "@/vocabulary/RDF";
import { RDFS } from "@/vocabulary/RDFS";
import { IM } from "@/vocabulary/IM";

@Options({
  name: "ConceptSummary",
  components: { EditDialog, Definition, DownloadDialog },
  prop: {},
  computed: mapState(["conceptAggregate", "conceptIri"]),
  watch: {
    conceptAggregate(newValue) {
      this.concept = newValue.concept;
      this.descriptionHTML =
        "<p class='description-p'>" +
        this.convertTextToHTML(this.concept[RDFS.COMMENT]) +
        "</p>";
      const descContainer = document.getElementById("description");
      if (descContainer) {
        descContainer.innerHTML = this.descriptionHTML;
      }
      ConceptService.getConceptImLang(newValue.concept[IM.IRI])
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
          for (const data of res.data) {
            if (data !== this.concept[RDFS.LABEL]) {
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
  descriptionHTML = {} as any;
  display = false;
  synonyms: { synonym: string }[] = [];
  conceptIri!: string;
  dialogHeader = "";

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
  ];

  get conceptTypes() {
    if (this.concept[RDF.TYPE]) {
      return this.concept[RDF.TYPE]
        .map(function(type: any) {
          return type.name;
        })
        .join(", ");
    } else {
      return null;
    }
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
    this.dialogHeader = "Create";
    this.display = true;
  }

  openEditDialog() {
    this.editDialogView = true;
    this.display = true;
    this.dialogHeader = "Edit";
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

  convertTextToHTML(text: string) {
    return text?.replaceAll("<p>", "</p>\n<p class='description-p'>");
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

.description {
  height: 100%;
  width: 100%;
}
</style>
