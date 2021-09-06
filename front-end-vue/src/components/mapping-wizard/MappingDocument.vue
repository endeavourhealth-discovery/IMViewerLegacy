<template>
  <div class="panel-content">
    <div v-for="mapping in mappings" :key="mapping.id">
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-12 p-md-4">
          <span class="p-float-label">
            <InputText type="text" v-model="mapping.name" />
            <label>Mapping Name</label>
          </span>
        </div>
        <div class="p-field p-col-12 p-md-4">
          <span class="p-float-label">
            <InputText type="text" v-model="mapping.referenceFormulation" />
            <label>Reference Formulation</label>
          </span>
        </div>
        <div class="p-field p-col-12 p-md-4">
          <span class="p-float-label">
            <InputText type="text" v-model="mapping.iterator" />
            <label>Iterator</label>
          </span>
        </div>

        <div class="p-field p-col-12 p-md-4">
          <span class="p-float-label">
            <Dropdown
              v-model="mapping.subjectMapType"
              :options="subjectMapOptions"
            />
            <label>SubjectMap Type</label>
          </span>
        </div>

        <div class="p-field p-col-12 p-md-4">
          <span class="p-float-label">
            <InputText type="text" v-model="mapping.subjectMapValue" />
            <label>SubjectMap Value</label>
          </span>
        </div>
        <div class="p-field p-col-12 p-md-4">
          <span class="p-float-label">
            <InputText type="text" v-model="mapping.class" />
            <label for="graph">Class</label>
          </span>
        </div>
      </div>

      <div v-for="predicate in mapping.objectMaps" :key="predicate.id">
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-3">
            <span class="p-float-label">
              <InputText id="graph" type="text" v-model="predicate.property" />
              <label for="graph">ObjectMap Property</label>
            </span>
          </div>
          <div class="p-field p-col-3">
            <span class="p-float-label">
              <Dropdown
                inputId="subjectMapType"
                v-model="predicate.type"
                :options="objectMapOptions"
              />
              <label for="graph">ObjectMap Type</label>
            </span>
          </div>
          <div class="p-field p-col-3">
            <span class="p-float-label">
              <InputText id="graph" type="text" v-model="predicate.value" />
              <label for="graph">ObjectMap Value</label>
            </span>
          </div>
          <div class="p-field p-col">
            <Button
              label="Remove ObjectMap"
              class="p-button-danger"
              @click="removeObjectMap(mapping, predicate.id)"
            >
            </Button>
          </div>
          <div class="p-field p-col">
            <Button
              label="Add ObjectMap"
              @click="addObjectMap(mapping)"
              class="p-button-success"
            >
            </Button>
          </div>
        </div>
      </div>

      <div class="p-fluid p-grid">
        <div class="p-field p-col-12 p-md-6 button">
          <Button
            label="Delete"
            :disabled="mappings.length == 1"
            @click="deleteMapping(mapping.id)"
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
import { ObjectMapTypeEnum } from "@/models/mapping/ObjectMapTypeEnum";
import { SubjectMapTypeEnum } from "@/models/mapping/SubjectMapTypeEnum";
import { RMLMapping } from "@/models/mapping/RMLMapping";
import { defineComponent } from "vue";
import { PredicateObjectMap } from "@/models/mapping/PredicateObjectMap";

export default defineComponent({
  name: "MappingDocument",
  computed: {
    isValid(): boolean {
      return true;
    },
  },
  data() {
    return {
      pageIndex: 1,
      mapDocumentString: "",
      mappings: [
        { id: 0, objectMaps: [{ id: 0 }] as PredicateObjectMap[] },
      ] as RMLMapping[],
      subjectMapOptions: Object.values(SubjectMapTypeEnum),
      objectMapOptions: Object.values(ObjectMapTypeEnum),
    };
  },
  methods: {
    addObjectMap(mapping: RMLMapping) {
      mapping.objectMaps.push({
        id: mapping.objectMaps.length,
      } as PredicateObjectMap);
    },
    removeObjectMap(mapping: RMLMapping, predicateId: number) {
      const newObjectMaps = mapping.objectMaps.filter((obj) => {
        return obj.id !== predicateId;
      });
      mapping.objectMaps = newObjectMaps;
    },
    addMapping() {
      this.mappings.push({
        id: this.mappings.length,
        objectMaps: [{ id: 0 }] as PredicateObjectMap[],
      } as RMLMapping);
    },
    deleteMapping(id: number) {
      const newMappings = this.mappings.filter((obj) => {
        return obj.id !== id;
      });
      this.mappings = newMappings;
    },
    nextPage() {
      this.$emit("next-page", {
        pageIndex: this.pageIndex,
      });
    },
    prevPage() {
      this.$emit("prev-page", {
        pageIndex: this.pageIndex,
      });
    },
  },
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
