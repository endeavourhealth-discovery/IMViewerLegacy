<template>
  <Card id="container">
    <template #title> Mapping </template>
    <template #content>
      <div class="p-fluid p-formgrid p-grid nested-grid">
        <div class="p-col">
          <div id="mapping-header-container">
            <div class="p-fluid p-formgrid p-grid">
              <div class="p-field p-col-3">
                <label>Destination Path</label>
              </div>
              <div class="p-field p-col-2">
                <label>Transform Type</label>
              </div>
              <div class="p-field p-col-3">
                <label>Transform Value</label>
              </div>
              <div class="p-field p-col ">
                <label>Example</label>
              </div>
              <div class="p-field p-col ">
                <label>Transformed</label>
              </div>
              <Button id="placeholder-header-button" icon="pi pi-times" class="p-button-rounded" disabled />
            </div>
          </div>
          <div id="mapping-container">
            <div v-for="mapping in mappings" :key="mapping">
              <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-3">
                  <Dropdown :options="pathOptions" v-model="mapping.destinationPath" placeholder="Choose destination path" @change="transformValue(mapping)" />
                </div>
                <div class="p-field p-col-2">
                  <Dropdown
                    :options="transformTypeOptions"
                    v-model="mapping.transformType"
                    placeholder="Choose transform type"
                    @change="transformValue(mapping)"
                  />
                </div>
                <div v-if="mapping.transformType === 'function'" class="p-field p-col-3">
                  <MultiSelect
                    v-model="mapping.transformValue"
                    :options="fnPropOptions"
                    placeholder="Select function and property"
                    display="chip"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                    @change="transformValue(mapping)"
                  />
                </div>
                <div v-else-if="mapping.transformType === 'reference'" class="p-field p-col-3">
                  <Dropdown :options="propertyOptions" v-model="mapping.transformValue" placeholder="Choose input property" @change="transformValue(mapping)" />
                </div>
                <div v-else class="p-field p-col-3">
                  <InputText type="text" v-model="mapping.transformValue" @change="transformValue(mapping)" />
                </div>
                <div class="p-field p-col">
                  <InputText type="text" v-model="mapping.example" disabled> </InputText>
                </div>
                <div class="p-field p-col">
                  <InputText type="text" v-model="mapping.exampleTransformed" disabled> </InputText>
                </div>
                <Button icon="pi pi-times" class="p-button-danger p-button-sm p-button-raised p-button-rounded" @click="removeMapping(mapping)" />
              </div>
            </div>
          </div>

          <div class="p-field p-col">
            <Button id="add-button" label="Add property" @click="addMapping()" class="p-button-success"> </Button>
          </div>
        </div>

        <div class="p-col-2">
          <div id="preview-label">Preview</div>
          <vue-json-pretty id="json-viewer" :path="'res'" :data="previewDisplay"> </vue-json-pretty>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
        <Button label="Back" @click="prevPage" />
        <Button label="Next" @click="nextPage" />
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import TransformFormObject from "../../models/transform/TransformFormObject";
import TransformMappingObject from "../../models/transform/TransformMappingObject";
import { TransformTypeEnum } from "../../models/transform/TransformTypeEnum";
import { defineComponent, PropType } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { isArrayHasLength } from "@/helpers/DataTypeCheckers";
import { getDataModelInstances, getPathMap, transform } from "../../helpers/TransformHelper";

export default defineComponent({
  name: "TransformMapping",
  components: {
    VueJsonPretty
  },
  emits: ["next-page", "prev-page"],
  props: {
    formObject: {
      type: Object as PropType<TransformFormObject>,
      required: true
    }
  },
  computed: {
    pathOptions(): string[] {
      return Array.from(this.pathMap.keys());
    }
  },
  data() {
    return {
      pageIndex: 1,
      propertyOptions: [] as string[],
      transformTypeOptions: [] as string[],
      mappings: [{}] as TransformMappingObject[],
      previewDisplay: [] as any[],
      functionOptions: ["generateIri", "toLowerCase", "toUpperCase", "removeSpaces", "toLowerCamelCase", "toUpperCamelCase"],
      fnPropOptions: [] as { label: string; items: string[] }[],
      pathMap: new Map<string, string>(),
      checkPointFormObject: {} as TransformFormObject
    };
  },
  mounted() {
    this.checkPointFormObject = this.formObject;
    this.propertyOptions = this.getPropertyOptions(this.formObject.inputDisplayJson);
    this.transformTypeOptions = this.getTransformTypeOptions();
    this.previewDisplay = getDataModelInstances(this.formObject.dataModelJson);
    this.pathMap = getPathMap(this.previewDisplay);
    this.mappings = this.getMappings(this.formObject.inputDisplayJson);
    this.fnPropOptions = [
      {
        label: "Functions",
        items: this.functionOptions
      },
      {
        label: "Properties",
        items: this.propertyOptions
      }
    ];
  },
  methods: {
    transformValue(mapping: TransformMappingObject) {
      if (isArrayHasLength(mapping.transformValue)) {
        (mapping.transformValue as []).forEach(transformValue => {
          if (this.propertyOptions.indexOf(transformValue) !== -1) {
            mapping.property = transformValue;
          }
        });
      }

      const transformed = transform(this.formObject.dataModelJson, this.formObject.inputDisplayJson, mapping);
      if (mapping.transformType === "function") {
        mapping.example = this.formObject.inputDisplayJson[0][mapping.property as string];
        mapping.exampleTransformed = transformed;
      } else {
        mapping.example = transformed;
      }

      this.assignValue(transformed, mapping);
    },

    assignValue(vale: string, mapping: TransformMappingObject) {
      const path = this.pathMap.get(mapping.destinationPath)?.split(".") || ([] as string[]);
      if (path[0] && path[1]) {
        this.previewDisplay[+path[0]][path[1]] = vale;
      }
    },

    getMappings(object: any) {
      const mappings = [] as TransformMappingObject[];
      this.pathMap.forEach((value, key) => {
        mappings.push({ destinationPath: key } as TransformMappingObject);
      });
      return mappings;
    },
    getPropertyOptions(object: any) {
      const options = [] as string[];
      if (isArrayHasLength(object)) {
        Object.keys(object[0]).forEach(key => options.push(key));
      }

      return options;
    },
    getTransformTypeOptions() {
      return Object.values(TransformTypeEnum);
    },
    addMapping() {
      this.mappings.push({} as TransformMappingObject);
    },
    removeMapping(mapping: TransformMappingObject) {
      this.mappings = this.mappings.filter(included => {
        return included.destinationPath != mapping.destinationPath;
      });
    },
    nextPage() {
      this.$emit("next-page", {
        formData: {
          input: this.checkPointFormObject.input,
          inputJson: this.checkPointFormObject.inputJson,
          inputDisplayJson: this.checkPointFormObject.inputDisplayJson,
          dataModel: this.checkPointFormObject.dataModel,
          dataModelJson: this.checkPointFormObject.dataModelJson
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
#mapping-header-container {
  width: 100%;
  padding-right: 1.7rem;
}

#mapping-container {
  height: calc(100vh - 33rem);
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 1.7rem;
  overflow: overlay;
}

#placeholder-header-button {
  background-color: #ffffff;
  border: 1px solid #ffffff;
}

#container {
  margin: 1.5rem;
  height: calc(100vh - 16rem);
  width: 98%;
  overflow-y: hidden;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
}

#json-viewer {
  height: calc(100vh - 29rem);
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

#preview-label {
  box-sizing: border-box;
  display: inline-block;
  background: #ffffff;
  color: #495057;
  margin-bottom: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 1rem;
  font-weight: normal;
}

#button-bar {
  padding: 0 2rem 1rem 0;
  gap: 0.5rem;
}

#add-button {
  margin-top: 0.5rem;
}
</style>
