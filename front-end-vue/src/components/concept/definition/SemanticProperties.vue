<template>
  <div id="semantic-properties-container" :style="{ width: size }">
    <div class="head-container">
      <strong class="label">{{ label }}: </strong>
      <span>&nbsp;({{ data.length }})</span>
      <Button
        icon="pi pi-plus"
        class="p-button-rounded p-button-text p-button-primary p-button-sm expand-button"
        v-styleclass="{
          selector: '#semantic-properties-table',
          enterClass: 'p-d-none',
          enterActiveClass: 'my-fadein',
          leaveActiveClass: 'my-fadeout',
          leaveToClass: 'p-d-none'
        }"
      />
    </div>
    <DataTable
      :value="data"
      :paginator="data.length > 5 ? true : false"
      :rows="5"
      id="semantic-properties-table"
      class="p-d-none"
    >
      <template #empty>
        No records found
      </template>
      <template #header>
        {{ label }}
      </template>
      <Column field="property.name" header="Name" :sortable="true">
        <template #body="slotProps">
          <div class="link" @click="navigate(slotProps.data.property?.['@id'])">
            {{ slotProps.data.property?.name }}
          </div>
        </template>
      </Column>
      <Column field="type.name" header="Type" :sortable="true">
        <template #body="slotProps">
          <div class="link" @click="navigate(slotProps.data.type['@id'])">
            {{ slotProps.data.type?.name || slotProps.data.type?.["@id"] }}
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script lang="ts">
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import { defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
  name: "SemanticProperties",
  components: {},
  props: {
    label: { type: String },
    data: { type: Array as PropType<Array<unknown>> },
    size: { type: String }
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

<style lang="scss" scoped>
div.link {
  cursor: pointer;
}

.head-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

@keyframes my-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes my-fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.my-fadein {
  animation: my-fadein 150ms linear;
}

.my-fadeout {
  animation: my-fadeout 150ms linear;
}
</style>
