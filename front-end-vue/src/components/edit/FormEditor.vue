<template>
  <ConfirmDialog></ConfirmDialog>
  <Card>
    <template #content>
      <div class="p-fluid editor-grid">
        <div class="p-field float-label-container iri">
          <span class="p-float-label">
            <InputText
              class="p-inputtext-lg"
              v-model="conceptDto.iri"
              type="text"
            />
            <label for="Iri">Iri</label>
          </span>
        </div>
        <div class="p-field float-label-container name">
          <span class="p-float-label">
            <InputText
              class="p-inputtext-lg"
              v-model="conceptDto.name"
              type="text"
            />
            <label for="Name">Name</label>
          </span>
        </div>
        <div class="p-field float-label-container code">
          <span class="p-float-label">
            <InputText
              class="p-inputtext-lg"
              v-model="conceptDto.code"
              type="text"
            />
            <label for="Code">Code</label>
          </span>
        </div>
        <div class="p-field float-label-container description">
          <span class="p-float-label">
            <Textarea
              class="p-inputtext-lg"
              v-model="conceptDto.description"
              rows="4"
            />
            <label for="address">Description</label>
          </span>
        </div>
        <div class="p-field float-label-container version">
          <span class="p-float-label">
            <InputText
              class="p-inputtext-lg"
              v-model="conceptDto.version"
              type="text"
            />
            <label for="Version">Version</label>
          </span>
        </div>
        <div class="p-field float-label-container status">
          <span class="p-float-label">
            <Dropdown
              class="p-inputtext-lg"
              v-model="conceptDto.status"
              :options="statusOptions"
            />
            <label>Status</label>
          </span>
        </div>
        <div class="p-field float-label-container scheme">
          <span class="p-float-label">
            <Dropdown
              class="p-inputtext-lg"
              v-model="conceptDto.scheme"
              optionValue="name"
              :options="schemeOptions"
              optionLabel="name"
            />
            <label>Scheme</label>
          </span>
        </div>
      </div>
    </template>
    <template #footer>
      <Button
        icon="pi pi-times"
        label="Cancel"
        class="p-button-secondary"
        @click="cancel"
      />
      <Button
        icon="pi pi-check"
        label="Save"
        class="save-button"
        @click="submit"
      />
    </template>
  </Card>
</template>

<script lang="ts">
import { ConceptReference } from "@/models/ConceptReference";
import { ConceptStatus } from "@/models/ConceptStatus";
import ConceptService from "@/services/ConceptService";
import { defineComponent } from "@vue/runtime-core";
import Dropdown from "primevue/dropdown";
import Card from "primevue/card";
import ConfirmDialog from "primevue/confirmdialog";

export default defineComponent({
  name: "FormEditor",
  components: { Dropdown, Card, ConfirmDialog },
  props: {
    concept: {} as any
  },
  watch: {
    concept() {
      this.conceptDto.iri = this.concept["@id"];
    }
  },
  data() {
    return {
      conceptDto: {} as any,
      schemeOptions: [] as ConceptReference[],
      statusOptions: Object.keys(ConceptStatus).filter(f =>
        isNaN(Number(f))
      ) as any
    };
  },
  async mounted() {
    this.schemeOptions = (await ConceptService.getSchemeOptions()).data;
  },
  methods: {
    cancel() {
      this.$confirm.require({
        message:
          "All unsaved changes will be lost. Are you sure you want to proceed?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.$router.go(-1);
        }
      });
    },
    submit() {
      //   console.log(this.conceptDto);
    }
  }
});
</script>

<style scoped>
.save-button {
  margin-left: 0.5em;
}

.p-tabview {
  padding-top: 3px;
}

.p-card {
  box-shadow: unset;
}

.editor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
  grid-template-areas:
    "iri name code"
    "description description description"
    "version status scheme"
    "imlang imlang imlang";
  column-gap: 7px;
  height: calc(100vh - 20rem);
}

.iri {
  grid-area: iri;
}

.name {
  grid-area: name;
}

.code {
  grid-area: code;
}

.description {
  grid-area: description;
}

.version {
  grid-area: version;
}

.status {
  grid-area: status;
}

.scheme {
  grid-area: scheme;
}

.imlang-container {
  grid-area: imlang;
}

.p-field {
  height: fit-content;
}

.float-label-container {
  margin-top: 1.5rem;
}
</style>
