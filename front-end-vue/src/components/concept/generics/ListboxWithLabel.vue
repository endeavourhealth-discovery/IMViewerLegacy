<template>
  <div :style="{ width: size }">
    <strong>{{ label }}: </strong>{{ data.length }}
    <Listbox
      :options="data"
      listStyle="height: 12rem;"
      v-model="selected"
      @change="navigate(selected['@id'])"
    >
      <template #option="slotProps">
        <div>
          {{ slotProps.option?.name || slotProps.option?.["@id"] }}
        </div>
      </template>
    </Listbox>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";

export default defineComponent({
  name: "ListboxWithLabel",
  props: {
    label: { type: String },
    data: { type: Array as PropType<Array<unknown>> },
    size: { type: String }
  },
  data() {
    return {
      selected: {} as any
    }
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

<style scoped>

</style>
