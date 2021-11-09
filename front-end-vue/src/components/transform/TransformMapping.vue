<template>
  <Card id="container">
    <template #title> Mapping </template>
    <template #content>
      <div class="p-fluid p-formgrid p-grid nested-grid">
        <div class="p-col">
          <div v-for="mapping in mappings" :key="mapping.id">
            <div class="p-fluid p-formgrid p-grid">
              <div class="p-field p-col">
                <label>Property</label>
                <Dropdown :options="headerOptions" placeholder="Choose input property" />
              </div>
              <Divider layout="vertical" />
              <div class="p-field p-col">
                <label>Transform Type</label>
                <Dropdown :options="transformTypeOptions" placeholder="Choose input property" />
              </div>
              <div class="p-field p-col">
                <label>Transform Value</label>
                <Dropdown :options="headerOptions" placeholder="Choose input property" />
              </div>
              <div class="p-field p-col">
                <label>Destination Path</label>
                <Dropdown :options="headerOptions" placeholder="Choose input property" />
              </div>
              <Divider layout="vertical" />
              <div class="p-field p-col">
                <label>Example</label>
                <InputText type="text" v-model="exampleTransform" disabled> </InputText>
              </div>

              <Divider layout="vertical" />
            </div>
          </div>
          <div class="p-field p-col">
            <Button id="add-button" label="Add property" @click="addMapping()" class="p-button-success"> </Button>
          </div>
        </div>

        <div class="p-col-4">
          <div id="preview-label">Preview</div>
          <vue-json-pretty id="json-viewer" :path="'res'" :data="dataModelJson"> </vue-json-pretty>
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
  computed: {},
  data() {
    return {
      pageIndex: 1,
      propertyOptions: [] as string[],
      transformTypeOptions: [] as string[],
      mappings: [{}] as TransformMappingObject[],
      exampleTransform: "value => im:value"
    };
  },
  mounted() {
    this.propertyOptions = this.getPropertyOptions(this.formObject.inputDisplayJson);
    this.transformTypeOptions = this.getTransformTypeOptions();
  },
  methods: {
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
    nextPage() {
      this.$emit("next-page", {
        formData: {
          //   input: this.input,
          //   inputJson: this.inputJson,
          //   inputDisplayJson: this.inputDisplayJson,
          //   dataModel: this.dataModel,
          //   dataModelJson: this.dataModelJson
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
  margin: 1.5rem;
  height: calc(100vh - 16rem);
  width: 98%;
  overflow-y: auto;
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
