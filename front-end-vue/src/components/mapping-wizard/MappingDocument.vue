<template>
  <div class="panel-content">
    <div v-for="mapping in mappings" :key="mapping.id">
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-12 p-md-6">
          <span class="p-float-label">
            <InputText type="text" v-model="mapping.name" />
            <label>Mapping Name</label>
          </span>
        </div>
        <div class="p-field p-col-12 p-md-6">
          <span class="p-float-label">
            <InputText type="text" v-model="mapping.iterator" :disabled="formObject.contentFileType==='text/csv'"/>
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
          <div class="p-field p-col">
            <span class="p-float-label">
              <InputText id="graph" type="text" v-model="predicate.property" />
              <label for="graph">ObjectMap Property</label>
            </span>
          </div>
          <div class="p-field p-col">
            <span class="p-float-label">
              <Dropdown
                inputId="subjectMapType"
                v-model="predicate.type"
                :options="objectMapOptions"
              />
              <label for="graph">ObjectMap Type</label>
            </span>
          </div>
          <div class="p-field p-col">
            <span class="p-float-label">
              <InputText id="graph" type="text" v-model="predicate.value" />
              <label for="graph">ObjectMap Value</label>
            </span>
          </div>
          <div class="p-field p-col-1">
            <Button
              icon="pi pi-times"
              class="p-button-danger p-button-raised p-button-rounded"
              @click="removeObjectMap(mapping, predicate.id)"
            />
          </div>
        </div>
      </div>

      <div class="p-fluid p-grid">
        <div class="p-field p-col-12 p-md-6 button">
          <Button
            label="Add ObjectMap"
            @click="addObjectMap(mapping)"
            class="p-button-success"
          >
          </Button>
        </div>
        <div class="p-field p-col-12 p-md-6 button">
          <Button
            label="Delete"
            :disabled="mappings.length == 1"
            @click="deleteMapping(mapping.id)"
            class="p-button-danger"
          />
        </div>
      </div>
    </div>
    <div class="p-fluid p-grid">
      <div class="p-field p-col button">
        <Button
          @click="addMapping"
          id="add-mapping"
          label="New RML Mapping"
          class="p-button-outlined p-button-lg p-button-plain"
        />
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
import { buildMapDocumentString } from "@/helpers/MapDocumentHelper";
import { defineComponent, PropType } from "vue";
import { PredicateObjectMap } from "@/models/mapping/PredicateObjectMap";
import { ReferenceFormulationEnum } from "@/models/mapping/ReferenceFormulationEnum";
import { MappingFormObject } from "@/models/mapping/MappingFormObject";

export default defineComponent({
  name: "MappingDocument",
  emits: ["next-page", "prev-page"],
  props: {
    formObject: {
      type: Object as PropType<MappingFormObject>,
      required: true,
    },
  },
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
      referenceFormulationOptions: Object.values(ReferenceFormulationEnum),
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
      this.mapDocumentString = buildMapDocumentString(
        this.formObject,
        this.mappings
      );
      this.$emit("next-page", {
        formData: {
          mapDocumentString: this.mapDocumentString,
        },
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

#add-mapping {
  border: dashed 2px #dee2e6;
  box-shadow: unset;
  vertical-align: middle;
}

#add-mapping:hover {
  border: dashed 2px #ff7a59;
  color: #ff7a59;
  background: #fff;
}

#button-bar {
  padding: 0 2rem 1rem 0;
  gap: 0.5rem;
}
</style>
