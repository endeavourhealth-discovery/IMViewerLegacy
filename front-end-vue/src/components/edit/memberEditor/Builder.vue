<template> </template>

<script lang="ts">
import { isArrayHasLength, isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import { TTIriRef } from "@/models/TripleTree";
import { SHACL } from "@/vocabulary/SHACL";
import { defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
  name: "Builder",
  props: { included: { type: Array as PropType<Array<any>>, required: true } },
  mounted() {
    this.createBuild();
  },
  data() {
    return {
      build: [] as any[]
    };
  },
  methods: {
    createBuild() {
      this.build = [];
      if (!isArrayHasLength(this.included)) {
        return;
      }
      let position = 0;
      this.included.forEach((item: any) => {
        this.build.push(this.processAny(item, position));
        position++;
      });
    },

    processAny(item: any, position: number): any {
      if (isObjectHasKeys(item, ["@id"])) return this.processIri(item, position);
      else if (isArrayHasLength(item)) return this.processArray(item, position);
      else return this.processObject(item, position);
    },

    processIri(iri: TTIriRef, position: number): any {
      return this.generateMember(iri, position);
    },

    processObject(item: any, position: number): any {
      for (const [key, value] of Object.entries(item)) {
        if (key === SHACL.AND || key === SHACL.OR) {
          return this.generateLogic(key, position);
        } else {
          console.log("unexpected key in processObject: " + key);
        }
      }
    },

    processArray(items: any[], position: number): any {
      let arrayPosition = 0;
      const result = [] as any[];
      items.forEach((item: any) => result.push(this.processAny(item, arrayPosition)));
      return result;
    },

    generateMember(iri: TTIriRef, position: number) {
      // TODO
      return {};
    },

    generateLogic(key: string, position: number) {
      // TODO
      return {};
    }
  }
});
</script>

<style scoped></style>
