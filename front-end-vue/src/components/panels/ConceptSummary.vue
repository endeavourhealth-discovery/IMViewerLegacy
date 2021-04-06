<template>
  <div>
    <Panel header="Summary" :toggleable="true">
      <template #icons>
        <button class="p-panel-header-icon p-link p-mr-2" @click="toggle">
          <span class="pi pi-cog"></span>
        </button>
        <Menu id="config_menu" ref="menu" :model="items" :popup="true" />
      </template>
      <div class="p-grid">
        <div
          class="p-col-6"
          v-if="concept['http://www.w3.org/2000/01/rdf-schema#label']"
        >
          <p>
            <strong>Name:</strong>
            {{ concept["http://www.w3.org/2000/01/rdf-schema#label"] }}
          </p>
          <p><strong>Iri:</strong> {{ concept["@id"] }}</p>
          <p>
            <strong>Code:</strong>
            {{ concept["http://endhealth.info/im#code"] }}
          </p>
          <p><strong>Description:</strong></p>
          <ScrollPanel style="width: 100%; height: 100px" class="custom">
            <div>
              {{ concept["http://www.w3.org/2000/01/rdf-schema#comment"] }}
            </div>
          </ScrollPanel>
        </div>
        <div
          class="p-col-6"
          v-if="concept['http://www.w3.org/2000/01/rdf-schema#label']"
        >
          <p>
            <strong>Status:</strong>
            {{ concept["http://endhealth.info/im#status"]["@id"] }}
          </p>
          <p>
            <strong>Scheme:</strong>
            {{ concept["http://endhealth.info/im#scheme"]["@id"] }}
          </p>
          <p>
            <strong>Types:</strong>
            {{ conceptTypes }}
          </p>
          <p><strong>Definition:</strong></p>
          <!-- <Definition
            :definition="this.definitionText"
            style="width: 95%; height: 100px;"
          /> -->
        </div>
        <EditDialog
          @closeDialog="closeDialog"
          :display="display"
          :concept="editorConcept"
          :definitionText="editorDefinitionText"
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

@Options({
  name: "ConceptSummary",
  components: { EditDialog, Definition },
  prop: {},
  computed: mapState(["conceptAggregate"]),
  watch: {
    async conceptAggregate(newValue, oldValue) {
      this.concept = newValue.concept;
      this.definitionText = this.definitionText = (
        await ConceptService.getConceptImLang(newValue.concept.iri)
      ).data;
    }
  }
})
export default class ConceptSummary extends Vue {
  editDialogView = true;
  concept = {} as any;
  definitionText = "";
  display = false;

  items = [
    {
      label: "Edit Concept",
      icon: "pi pi-pencil",
      command: () => {
        this.openEditDialog();
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
    const types: string[] = [];
    this.concept["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"].forEach(
      (typeObject: any) => {
        types.push(typeObject["@id"]);
      }
    );
    return types.join();
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

  toggle(event: any) {
    const x = this.$refs.menu as any;
    x.toggle(event);
  }
}
</script>

<style>
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
</style>
