<template>
  <DataTable
    :value="dataModelProperties"
    :paginator="dataModelProperties.length > 5 ? true : false"
    :rows="5"
    id="datamodel-properties-table"
  >
    <template #empty>
      No records found
    </template>
    <template #header>
      Data model properties
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
        <div class="link" @click="navigate(slotProps.data.valueType['@id'])">
          {{
            slotProps.data.valueType?.name || slotProps.data.valueType?.["@id"]
          }}
        </div>
      </template>
    </Column>
  </DataTable>
</template>
<script lang="ts">
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "DataModelProperties",
  components: {},
  props: ["dataModelProperties", "contentHeight"],
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
div.link {
  cursor: pointer;
}
</style>
