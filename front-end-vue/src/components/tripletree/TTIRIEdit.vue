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
    <div><small>{{conceptKey}}</small></div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ConceptService from '@/services/ConceptService';

@Options({
  name: "TTIRIEdit",
  props: ["property", "prefix", "size", "conceptValue", "conceptKey"],
  emits: ["update:componentValue"],
  // watch: {
  //   componentValue: {
  //     immediate: true,
  //     handler(n, o) {
  //       this.splitValue(n);
  //     }
  //   },
  //   iri: {
  //     immediate: true,
  //     handler(n, o) {
  //       this.onChange();
  //     }
  //   },
  //   prefix: {
  //     immediate: true,
  //     handler(n, o) {
  //       this.onChange();
  //     }
  //   }
  // }
})
export default class TTIRIEdit extends Vue {
  conceptValue!: any;
  name?: string;
  namespaces?: any[];

  beforeMount() {
    this.namespaces = ConceptService.getNamespaces();
  }

  // splitValue(n: any) {
  //   if (n) {
  //     const full = n.iri;

  //     const i = full.lastIndexOf('#');

  //     this.prefix = full.substring(0, i + 1);
  //     this.iri = full.substring(i + 1);
  //   }
  // }

  onChange() {
    // this.componentValue.iri = this.prefix + this.iri;
    this.$emit("update:componentValue", this.conceptValue);
  }
}
</script>

<style scoped>

</style>
