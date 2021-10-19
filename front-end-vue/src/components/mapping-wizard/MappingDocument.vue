<template>
  <Card id="container">
    <template #title> Create Map document </template>
    <template #content>
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
              <TreeSelect v-if="formObject.contentFileType === 'application/json'" v-model="mapping.iterator" :options="nodes" />
              <InputText v-else type="text" disabled />
              <label>Iterator</label>
            </span>
          </div>

          <div class="p-field p-col-12 p-md-3">
            <span class="p-float-label">
              <Dropdown v-model="mapping.subjectMapType" :options="subjectMapOptions" />
              <label>SubjectMap Type</label>
            </span>
          </div>

          <div class="p-field p-col-12 p-md-3">
            <span class="p-float-label">
              <AutoComplete
                v-if="isReferenceType(mapping.subjectMapType) && (formObject.contentFileType === 'text/csv' || formObject.contentFileType === 'text/plain')"
                v-model="mapping.subjectMapValue"
                :dropdown="true"
                @complete="searchReference(mapping.subjectMapValue)"
                :suggestions="filteredSuggestions"
              />

              <AutoComplete
                v-else-if="isReferenceType(mapping.subjectMapType) && formObject.contentFileType === 'application/json'"
                v-model="mapping.subjectMapValue"
                :dropdown="true"
                @complete="searchJsonReference(mapping.subjectMapValue, mapping.iterator)"
                :suggestions="filteredJsonSuggestions"
                :virtualScrollerOptions="{ itemSize: 31 }"
              />

              <InputText v-else type="text" v-model="mapping.subjectMapValue" />
              <label>SubjectMap Value</label>
            </span>
          </div>
          <div class="p-field p-col-12 p-md-3">
            <span class="p-float-label">
              <InputText type="text" v-model="mapping.class" />
              <label for="graph">Class</label>
            </span>
          </div>

          <div class="p-field p-col-12 p-md-3">
            <span class="p-float-label">
              <InputText type="text" v-model="mapping.graph" />
              <label for="graph">Graph</label>
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
                <Dropdown inputId="subjectMapType" v-model="predicate.type" :options="objectMapOptions" />
                <label for="graph">ObjectMap Type</label>
              </span>
            </div>
            <div class="p-field p-col">
              <span class="p-float-label">
                <AutoComplete
                  v-if="isReferenceType(predicate.type) && formObject.contentFileType === 'text/csv'"
                  v-model="predicate.value"
                  :dropdown="true"
                  @complete="searchReference(predicate.value)"
                  :suggestions="filteredSuggestions"
                />

                <AutoComplete
                  v-else-if="isReferenceType(predicate.type) && formObject.contentFileType === 'application/json'"
                  v-model="predicate.value"
                  :dropdown="true"
                  @complete="searchJsonReference(predicate.value, mapping.iterator)"
                  :suggestions="filteredJsonSuggestions"
                  :virtualScrollerOptions="{ itemSize: 31 }"
                />

                <InputText v-else id="graph" type="text" v-model="predicate.value" />
                <label for="graph">ObjectMap Value</label>
              </span>
            </div>
            <div class="p-field p-col-1">
              <Button icon="pi pi-times" class="p-button-danger p-button-raised p-button-rounded" @click="removeObjectMap(mapping, predicate.id)" />
            </div>
          </div>
        </div>

        <div class="p-fluid p-grid">
          <div class="p-field p-col-12 p-md-6 button">
            <Button label="Add ObjectMap" @click="addObjectMap(mapping)" class="p-button-success"> </Button>
          </div>
          <div class="p-field p-col-12 p-md-6 button">
            <Button label="Delete" :disabled="mappings.length == 1" @click="deleteMapping(mapping.id)" class="p-button-danger" />
          </div>
        </div>
      </div>
      <div class="p-fluid p-grid">
        <div class="p-field p-col button">
          <Button @click="addMapping" id="add-mapping" label="Add RML Mapping" class="p-button-outlined p-button-lg p-button-plain" />
        </div>
      </div>
    </template>
  </Card>

  <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
    <Button label="Back" @click="prevPage" />
    <Button label="Next" @click="nextPage" />
  </div>
</template>

<script lang="ts">
import { ObjectMapTypeEnum } from "@/models/mapping/ObjectMapTypeEnum";
import { SubjectMapTypeEnum } from "@/models/mapping/SubjectMapTypeEnum";
import { RMLMapping } from "@/models/mapping/RMLMapping";
import { buildMapDocumentString, getNodeValueByKey, getTreeNodesFromJson, getValueSuggestions } from "@/helpers/MapDocumentHelper";
import { defineComponent, PropType } from "vue";
import { PredicateObjectMap } from "@/models/mapping/PredicateObjectMap";
import { ReferenceFormulationEnum } from "@/models/mapping/ReferenceFormulationEnum";
import { MappingFormObject } from "@/models/mapping/MappingFormObject";
import MappingService from "@/services/MappingService";

export default defineComponent({
  name: "MappingDocument",
  emits: ["next-page", "prev-page"],
  props: {
    formObject: {
      type: Object as PropType<MappingFormObject>,
      required: true
    }
  },
  computed: {
    isValid(): boolean {
      return true;
    }
  },
  data() {
    return {
      pageIndex: 1,
      mapDocumentString: "",
      referenceSuggestions: [] as string[],
      filteredSuggestions: [] as string[],
      filteredJsonSuggestions: [] as string[],
      mappings: [{ id: 0, objectMaps: [{ id: 0 }] as PredicateObjectMap[] }] as RMLMapping[],
      referenceFormulationOptions: Object.values(ReferenceFormulationEnum),
      subjectMapOptions: Object.values(SubjectMapTypeEnum),
      objectMapOptions: Object.values(ObjectMapTypeEnum),
      nodes: [] as any[]
    };
  },
  async mounted() {
    const formData = new FormData();
    formData.append("contentFile", this.formObject.contentFile);
    this.referenceSuggestions = await MappingService.getReferenceSuggestions(formData);
    if (this.formObject.contentFileName === "application/json") this.nodes = await getTreeNodesFromJson(this.formObject.contentFile);
  },
  methods: {
    isReferenceType(type: ObjectMapTypeEnum | SubjectMapTypeEnum) {
      if (ObjectMapTypeEnum.reference === type) return true;
      return false;
    },
    async searchJsonReference(ref: string, iterator: any) {
      const referenceJsonSuggestions = Array.from(await getValueSuggestions(this.formObject.contentFile, getNodeValueByKey(this.nodes, iterator)));

      let filteredItems = [];

      for (let i = 0; i < referenceJsonSuggestions.length; i++) {
        let item = referenceJsonSuggestions[i];
        if (ref && item.toLowerCase().indexOf(ref.toLowerCase()) === 0) {
          filteredItems.push(item);
        }
      }

      this.filteredJsonSuggestions = filteredItems.length ? filteredItems : referenceJsonSuggestions;
    },
    searchReference(ref: string) {
      let filteredItems = [];

      for (let i = 0; i < this.referenceSuggestions.length; i++) {
        let item = this.referenceSuggestions[i];
        if (ref && item.toLowerCase().indexOf(ref.toLowerCase()) === 0) {
          filteredItems.push(item);
        }
      }

      this.filteredSuggestions = filteredItems.length ? filteredItems : this.referenceSuggestions;
    },
    addObjectMap(mapping: RMLMapping) {
      mapping.objectMaps.push({
        id: mapping.objectMaps.length
      } as PredicateObjectMap);
    },
    removeObjectMap(mapping: RMLMapping, predicateId: number) {
      const newObjectMaps = mapping.objectMaps.filter(obj => {
        return obj.id !== predicateId;
      });
      mapping.objectMaps = newObjectMaps;
    },
    addMapping() {
      this.mappings.push({
        id: this.mappings.length,
        objectMaps: [{ id: 0 }] as PredicateObjectMap[]
      } as RMLMapping);
    },
    deleteMapping(id: number) {
      const newMappings = this.mappings.filter(obj => {
        return obj.id !== id;
      });
      this.mappings = newMappings;
    },
    nextPage() {
      this.mappings.forEach(mapping => {
        mapping.iterator = getNodeValueByKey(this.nodes, mapping.iterator);
      });

      this.mapDocumentString = buildMapDocumentString(this.formObject, this.mappings);
      this.$emit("next-page", {
        formData: {
          mapDocumentString: this.mapDocumentString
        },
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
  height: calc(100vh - 19rem);
  width: 98%;
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
