<template>
  <p style="margin-bottom: 1em; font-size: 14px">Select Type</p>
  <MultiSelect
    id="type"
    v-model="selected"
    :options="typeOptions"
    optionLabel="label"
    placeholder="Select"
    display="chip"
    style="width: 100%; margin-bottom: 2em"
    class="p-inputtext-lg"
    @change="updateSelectedTypes()"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
  name: "CatalogueFilters",
  props: { typeOptions: { type: Array as PropType<any[]>, required: true } },
  emits: { typesSelected: (payload: any[]) => true },
  mounted() {
    this.selected = this.typeOptions;
    this.updateSelectedTypes();
  },
  data() {
    return {
      selected: [] as any[]
    };
  },
  methods: {
    updateSelectedTypes() {
      this.$emit("typesSelected", this.selected);
    }
  }
});
</script>

<style scoped></style>
