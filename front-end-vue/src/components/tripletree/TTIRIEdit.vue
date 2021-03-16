<template>
  <div :class="'p-field p-col-'+size">
    <label ><strong>{{ property }}: </strong></label>
    <div class="p-inputgroup">
      <DropDown
        style="width: 20%"
        :placeholder="prefix"
        :options = "namespaces"
        optionLabel="prefix"
        v-model="editPrefix"
        v-on:change="onPrefixChange()"
      />
      <InputText
        style="width: 80%"
        type="text"
        :name="property+'-name'"
        v-model="editValue"
        v-on:change="onValueChange()"
      />
<!--      <InputText
          style="width: 80%"
          type="text"
          :name="predicate+'-name'"
          v-model="name"/>-->
    </div>
    <div v-if="checkForHttp(editConceptKey)"><small>{{editConceptKey}}</small></div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ConceptService from '@/services/ConceptService';

@Options({
  name: "TTIRIEdit",
  props: ["property", "prefix", "size", "conceptValue", "conceptKey"],
  emits: ["update:conceptValue"],
})
export default class TTIRIEdit extends Vue {
  conceptValue!: string;
  conceptKey!: string;
  name?: string;
  namespaces: any[] = [];
  property!: string;
  prefix!: string;
  editValue: string = this.conceptValue;
  editPrefix: {prefix: string, uri: string} = {prefix: this.prefix, uri: ""};
  editConceptKey: any = this.conceptKey;

  beforeMount() {
    this.namespaces = ConceptService.getNamespaces();
  }

  onValueChange() {
    this.$emit("update:IRIValue", this.editValue, this.conceptValue);
  }

  onPrefixChange(){
    if (/^https?:/.test(this.editValue)){
      this.editValue = this.editPrefix.uri + this.editValue.substring(this.editValue.lastIndexOf("#") + 1)
    } else if (/^https?:/.test(this.editConceptKey)){
      this.editConceptKey = this.editPrefix.uri + this.editValue.substring(this.editValue.lastIndexOf("#") + 1)
    }
    this.$emit("update:IRIPrefix") // finish emits new value + old value
  }

  checkForHttp(string: string){
    return /^https?:/.test(string);
  }
}
</script>

<style scoped>

</style>
