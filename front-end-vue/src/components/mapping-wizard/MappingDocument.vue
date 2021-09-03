<template>
  <div class="panel-content">
    <div v-for="item in rmlMappingNum" :key="item">
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-12 p-md-4">
          <span class="p-float-label">
            <InputText type="text" v-model="source" />
            <label>Source</label>
          </span>
        </div>
        <div class="p-field p-col-12 p-md-4">
          <span class="p-float-label">
            <InputText type="text" v-model="referenceFormulation" />
            <label>Reference Formulation</label>
          </span>
        </div>
        <div class="p-field p-col-12 p-md-4">
          <span class="p-float-label">
            <InputText type="text" v-model="iterator" />
            <label>Iterator</label>
          </span>
        </div>
        <div class="p-field p-col-12 p-md-3">
          <span class="p-float-label">
            <InputText type="text" v-model="name" />
            <label>Mapping Name</label>
          </span>
        </div>
        <div class="p-field p-col-12 p-md-3">
          <span class="p-float-label">
            <Dropdown v-model="subjectMapType" :options="subjectMapOptions" />
            <label>SubjectMap Type</label>
          </span>
        </div>

        <div class="p-field p-col-12 p-md-3">
          <span class="p-float-label">
            <label>SubjectMap Value</label>
            <InputText type="text" v-model="subjectMapValue" />
          </span>
        </div>
        <div class="p-field p-col-12 p-md-3">
          <span class="p-float-label">
            <InputText type="text" v-model="clasz" />
            <label for="graph">Class</label>
          </span>
        </div>

        <div class="p-field p-col-12 p-md-3">
          <span class="p-float-label">
            <label for="graph">ObjectMap Property</label>
            <InputText id="graph" type="text" v-model="graph" />
          </span>
        </div>
        <div class="p-field p-col-12 p-md-3">
          <span class="p-float-label">
            <Dropdown
              inputId="subjectMapType"
              v-model="subjectMapType"
              :options="objectMapOptions"
            />
            <label for="graph">ObjectMap Type</label>
          </span>
        </div>
        <div class="p-field p-col-12 p-md-3">
          <span class="p-float-label">
            <InputText id="graph" type="text" v-model="graph" />
            <label for="graph">ObjectMap Value</label>
          </span>
        </div>
        <div class="p-field p-col-12 p-md-1">
          <Button
            class="p-button-danger"
            icon="pi pi-minus"
            @click="deleteObject"
          >
          </Button>
        </div>
        <div class="p-field p-col-12 p-md-1">
          <label> </label>
          <Button icon="pi pi-plus" @click="addObject" class="p-button-success">
          </Button>
        </div>
        <div class="p-field p-col-12 p-md-6 button">
          <Button
            label="Delete"
            :disabled="rmlMappingNum == 1"
            @click="deleteMapping"
            class="p-button-danger"
          />
        </div>
        <div class="p-field p-col-12 p-md-6">
          <Button label="Add" @click="addMapping" class="p-button-success" />
        </div>
      </div>
    </div>
  </div>
  <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
    <Button label="Back" @click="prevPage" />
    <Button label="Next" @click="nextPage" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MappingDocument",
  computed: {
    isValid(): boolean {
      return true;
    }
  },
  data() {
    return {
      rmlMappingNum: 1,
      pageIndex: 1,
      source: "",
      referenceFormulation: "",
      iterator: "",
      name: "",
      subjectMapType: "",
      subjectMapValue: "",
      clasz: "",
      objectMaps: "",
      subjectMapOptions: ["constant", "reference", "template", "functionValue"],
      objectMapOptions: [
        "constant",
        "reference",
        "template",
        "functionValue",
        "parentTriplesMap"
      ]
    };
  },
  methods: {
    addMapping() {
      this.rmlMappingNum++;
    },
    deleteMapping() {
      this.rmlMappingNum--;
    },
    nextPage() {
      this.$emit("next-page", {
        pageIndex: this.pageIndex
      });
    },
    prevPage() {
      this.$emit("prev-page", {
        pageIndex: this.pageIndex
      });
    }
  }
});
</script>

<style scoped>
#container {
  margin: 1rem;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
}

.loading-container {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

.p-field {
  margin-bottom: 30px;
}

#button-bar {
  padding: 0 2rem 1rem 0;
  gap: 0.5rem;
}
</style>
