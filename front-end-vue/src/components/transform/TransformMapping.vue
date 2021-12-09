<template>
  <Card id="container">
    <template #title> Mapping </template>
    <template #content>
      <div class="p-fluid p-formgrid p-grid nested-grid">
        <div class="p-col">
          <div id="mapping-header-container">
            <div class="p-fluid p-formgrid p-grid">
              <div class="p-field p-col">
                <label>Destination Path</label>
              </div>
              <div class="p-field p-col">
                <label>Transform Type</label>
              </div>
              <div class="p-field p-col-2" v-if="showFunctionHeader">
                Transform Function
              </div>
              <div class="p-field p-col">
                <label>Transform Value</label>
              </div>
              <div class="p-field p-col">
                <label>Example</label>
              </div>
              <Button id="placeholder-header-button" icon="pi pi-times" class="p-button-rounded" disabled />
            </div>
          </div>
          <div id="mapping-container">
            <div v-for="mapping in mappings" :key="mapping">
              <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col">
                  <TreeSelect
                    v-model="mapping.destinationPath"
                    :options="destinationPaths"
                    placeholder="Choose destination path"
                    @change="transformValue(mapping)"
                    display="chip"
                    selectionMode="checkbox"
                  />
                </div>
                <div class="p-field p-col">
                  <Dropdown
                    :options="transformTypeOptions"
                    v-model="mapping.transformType"
                    placeholder="Choose transform type"
                    @change="transformValue(mapping)"
                  />
                </div>
                <div v-if="mapping.transformType === 'function'" class="p-field p-col-2">
                  <MultiSelect
                    v-model="mapping.transformFunctions"
                    :options="functionOptions"
                    placeholder="Choose transform functions"
                    @change="transformValue(mapping)"
                  />
                </div>
                <div v-if="mapping.transformType === 'function' || mapping.transformType === 'reference'" class="p-field p-col">
                  <TreeSelect
                    v-model="mapping.transformValue"
                    :options="sourceProperties"
                    placeholder="Choose input property"
                    @change="transformValue(mapping)"
                  />
                </div>
                <div v-else class="p-field p-col">
                  <InputText type="text" v-model="mapping.transformValue" @change="transformValue(mapping)" />
                </div>
                <div class="p-field p-col">
                  <InputText type="text" v-model="mapping.exampleTransformed" disabled />
                </div>
                <Button icon="pi pi-times" class="p-button-danger p-button-sm p-button-raised p-button-rounded" @click="removeMapping(mapping)" />
              </div>
            </div>
          </div>

          <div class="p-field p-col">
            <Button id="add-button" label="Add instruction" @click="addMapping()" class="p-button-success"> </Button>
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
import { TransformInstruction, TransformInstructionDto } from "../../models/transform/TransformInstruction";
import { defineComponent, PropType } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import TransformService from "@/services/TransformService";
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";

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
    showFunctionHeader() {
      return !!this.mappings.find(mapping => mapping.transformType === "function");
    }
  },
  data() {
    return {
      pageIndex: 2,
      sourceProperties: [] as string[],
      transformTypeOptions: [] as string[],
      mappings: [{}] as TransformInstruction[],
      selectedDestinationPath: {},
      previewDisplay: [] as any[],
      destinationPaths: [] as string[],
      checkPointFormObject: {} as TransformFormObject,
      functionOptions: [] as string[]
    };
  },
  async mounted() {
    this.checkPointFormObject = this.formObject;
    this.functionOptions = await TransformService.getFunctions();
    this.sourceProperties = await TransformService.getJpathTreeOptions(this.formObject.inputDisplayJson[0]);
    this.transformTypeOptions = await TransformService.getTransformTypes();
    this.previewDisplay = await TransformService.getDataModelInstanceDisplay(this.formObject.dataModelJson);
    this.destinationPaths = await TransformService.getJpathTreeOptions(this.previewDisplay);
  },
  methods: {
    async transformValue(mapping: TransformInstruction) {
      if (mapping.destinationPath && mapping.transformType && mapping.transformValue) {
        const dto = this.getInstructionDto(mapping);
        const { instruction, instances } = await TransformService.transformByInstruction(dto, this.previewDisplay, this.formObject.inputDisplayJson);
        mapping.example = instruction.example;
        mapping.exampleTransformed = instruction.exampleTransformed;
        this.previewDisplay = instances;
      }
    },
    getInstructionDto(mapping: TransformInstruction): TransformInstructionDto {
      const transformValue = isObjectHasKeys(mapping.transformValue) ? Object.keys(mapping.transformValue)[0] : mapping.transformValue;
      const destinationPaths = [] as string[];
      const pathSelections = Object.keys(mapping.destinationPath);
      pathSelections.forEach(selectedPath => {
        if (mapping.destinationPath[selectedPath]["checked"] === true) {
          destinationPaths.push(selectedPath);
        }
      });
      return {
        destinationPaths: destinationPaths,
        transformType: mapping.transformType,
        transformValue: transformValue,
        transformFunctions: mapping.transformFunctions,
        example: mapping.example,
        exampleTransformed: mapping.exampleTransformed
      } as TransformInstructionDto;
    },
    addMapping() {
      this.mappings.push({} as TransformInstruction);
    },
    removeMapping(mapping: TransformInstruction) {
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
