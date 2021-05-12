<template>
  <div>
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
        </div>
        <p class="break-text">
          <strong>Iri:</strong>
          {{ concept["@id"] }}
        </p>
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
          <strong>Types: </strong>
          <span
            v-if="concept['http://www.w3.org/1999/02/22-rdf-syntax-ns#type']"
          >
            {{ conceptTypes }}
          </span>
        </p>
      </div>
    </div>
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
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ConceptService from "@/services/ConceptService";
import EditDialog from "@/components/edit/EditDialog.vue";
import { mapState } from "vuex";
import Definition from "./Definition.vue";
import LoggerService from "@/services/LoggerService";
import { RDF } from "@/vocabulary/RDF";
import { RDFS } from "@/vocabulary/RDFS";
import { IM } from "@/vocabulary/IM";

@Options({
  name: "ConceptSummary",
  components: { EditDialog, Definition },
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
export default class Summary extends Vue {
  editDialogView = true;
  showDownloadDialog = false;
  concept = {} as any;
  definitionText = "";
  descriptionHTML = {} as any;
  display = false;
  synonyms: { synonym: string }[] = [];
  conceptIri!: string;
  dialogHeader = "";
  resize = false;

  handleResize() {
    this.resize = !this.resize;
  }

  unmounted() {
    window.onresize = null;
  }

  mounted() {
    window.onresize = this.handleResize;
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
