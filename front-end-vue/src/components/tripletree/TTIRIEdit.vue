<template>
  <div :class="'p-field p-col-'+size">
    <label ><strong>{{ label }}: </strong></label>
    <div class="p-inputgroup">
      <DropDown
        style="width: 20%"
        placeholder="Prefix"
        :options = "namespaces"
        optionLabel = "prefix"
        optionValue = "uri"
        v-model="prefix"/>
      <InputText
        style="width: 80%"
        type="text"
        :name="predicate+'-name'"
        v-model="iri"/>
<!--      <InputText
          style="width: 80%"
          type="text"
          :name="predicate+'-name'"
          v-model="name"/>-->
    </div>
    <div><small>{{prefix}}{{iri}}</small></div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ConceptService from '@/services/ConceptService';

@Options({
  props: ["label", "predicate", "size", "componentValue"],
  emits: ["update:componentValue"],
  watch: {
    componentValue: {
      immediate: true,
      handler(n, o) {
        this.splitValue(n);
      }
    },
    iri: {
      immediate: true,
      handler(n, o) {
        this.onChange();
      }
    },
    prefix: {
      immediate: true,
      handler(n, o) {
        this.onChange();
      }
    }
  }
})
export default class TTIRIEdit extends Vue {
  componentValue!: any;
  prefix = "";
  iri = "";
  name?: string;
  options = ['im:', 'sn:']; // TODO: get from API
  namespaces?: any[];

  beforeMount() {
    this.namespaces = ConceptService.getNamespaces();
  }

  splitValue(n: any) {
    if (n) {
      const full = n.iri;

      const i = full.lastIndexOf('#');

      this.prefix = full.substring(0, i + 1);
      this.iri = full.substring(i + 1);
    }
  }

  onChange() {
    this.componentValue.iri = this.prefix + this.iri;
    this.$emit("update:componentValue", this.componentValue);
  }
}
</script>

<style scoped>

</style>
