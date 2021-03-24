<template>
  <div>
    <Panel header="Summary" :toggleable="true">
      <div class="p-grid">
        <div class="p-col-6" v-if="concept.name">
          <p><strong>Name:</strong> {{ concept.name }}</p>
          <p><strong>Iri:</strong> {{ concept.iri }}</p>
          <p><strong>Code:</strong> {{ concept.code }}</p>
        </div>
        <div class="p-col-6" v-if="concept.name">
          <p><strong>Status:</strong> {{ concept.status }}</p>
          <p><strong>Scheme:</strong> {{ concept.scheme.name }}</p>
          <p><strong>Type:</strong> {{ concept.conceptType }}</p>
        </div>
        <div class="p-col-6" v-if="concept.name">
          <ScrollPanel style="width: 100%; height: 100px">
            <p><strong>Description:</strong></p>
            <div>{{ concept.description }}</div>
          </ScrollPanel>
        </div>
        <div class="p-col-6" v-if="concept.name">
          <ScrollPanel style="width: 100%; height: 100px">
            <p><strong>Definition:</strong></p>
            <div v-for="(item, index) in definitionDisplay" :key="item">
              {{ index !== definitionDisplay.length - 1 ? item + ";" : item }}
            </div>
          </ScrollPanel>
        </div>
        <div class="p-col-10" v-if="concept.name"></div>
        <div class="p-col-2" v-if="concept.name">
          <SplitButton
            label="Edit"
            icon="pi pi-pencil"
            @click="openEditDialog()"
            :model="items"
          ></SplitButton>
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
import store from "@/store/index";
import { mapState } from "vuex";

@Options({
  components: { EditDialog },
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
  concept = {};
  definitionText = "";

  display = false;

  get definitionDisplay() {
    return this.definitionText.split(";");
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

  items = [
    {
      label: "Create new",
      icon: "pi pi-plus",
      command: () => {
        this.openAddDialog();
      }
    }
  ];
}
</script>
