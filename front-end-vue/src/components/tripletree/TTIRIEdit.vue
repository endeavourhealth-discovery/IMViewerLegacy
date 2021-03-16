<template>
  <div :class="'p-field p-col-'+size">
    <label ><strong>{{ property }}: </strong></label>
    <div class="p-inputgroup">
      <DropDown
        style="width: 20%"
        :placeholder="prefix"
        :options = "namespaces"
        optionLabel = "prefix"
        :optionValue = "prefix"
        :modelValue="prefix"/>
      <InputText
        style="width: 80%"
        type="text"
        :name="predicate+'-name'"
        v-model="conceptValue"/>
<!--      <InputText
          style="width: 80%"
          type="text"
          :name="predicate+'-name'"
          v-model="name"/>-->
    </div>
    <div v-if="checkForHttp(conceptKey)"><small>{{conceptKey}}</small></div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ConceptService from '@/services/ConceptService';

@Options({
  name: "TTIRIEdit",
  props: ["property", "prefix", "size", "conceptValue", "conceptKey"],
  emits: ["update:componentValue"],
})
export default class TTIRIEdit extends Vue {
  conceptValue!: any;
  name?: string;
  namespaces?: any[];

  beforeMount() {
    this.namespaces = ConceptService.getNamespaces();
  }

  onChange() {
    this.$emit("update:componentValue", this.conceptValue);
  }

  checkForHttp(string: string){
    return /^https?:/.test(string);
  }
}
</script>

<style scoped>

</style>
