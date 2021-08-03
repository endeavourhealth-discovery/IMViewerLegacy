<template>
  <div v-if="isArrayObjectWithName" :style="{ width: size }">
    <strong class="label">{{ label }}: </strong>{{ data.length }}
    <Listbox
      :options="data"
      listStyle="height: 12rem;"
      v-model="selected"
      @change="navigate(selected['@id'])"
      emptyMessage="None"
    >
      <template #option="slotProps">
        <div class="data-name">
          {{ slotProps.option?.name || slotProps.option?.["@id"] }}
        </div>
      </template>
    </Listbox>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "ArrayObjectNameListboxWithLabel",
  props: {
    label: { type: String },
    data: { type: Array as PropType<Array<unknown>> },
    size: { type: String }
  },
  computed: {
    isArrayObjectWithName(): boolean {
      if (!this.data) {
        return false;
      }
      if (
        Array.isArray(this.data) &&
        this.data.length &&
        Object.prototype.toString.call(this.data[0]) === "[object Object]" &&
        Object.prototype.hasOwnProperty.call(this.data[0], "name")
      ) {
        return true;
      } else if (Array.isArray(this.data) && this.data.length === 0) {
        return true;
      } else {
        LoggerService.warn(
          undefined,
          "Data error. Data is not array, array does not contain Object or Object has no property 'name' for use within component ArrayObjectNameListboxWithLabel.vue"
        );
        return false;
      }
    }
  },
  data() {
    return {
      selected: {} as any
    };
  },
  methods: {
    navigate(iri: any) {
      const currentRoute = this.$route.name as RouteRecordName | undefined;
      if (iri)
        this.$router.push({
          name: currentRoute,
          params: { selectedIri: iri }
        });
    }
  }
});
</script>

<style scoped></style>
