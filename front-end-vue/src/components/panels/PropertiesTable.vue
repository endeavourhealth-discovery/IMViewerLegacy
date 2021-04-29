<template>
  <DataTable
    :value="properties"
    :rowsPerPageOptions="[10, 25, 50]"
    :paginator="properties.length > 10 ? true : false"
    :rows="10"
    :scrollable="true"
    scrollHeight="flex"
    id="properties-table"
  >
    <template #empty>
      No records found
    </template>
    <Column field="name" header="Name">
      <template #body="slotProps">
        <div class="link capitalize-text" @click="navigate(slotProps.data.iri)">
          {{ slotProps.data.name }}
        </div>
      </template>
    </Column>
    <Column field="valueTypeName" header="Type">
      <template #body="slotProps">
        <div class="link" @click="navigate(slotProps.data.valueTypeIri)">
          {{ slotProps.data.valueTypeName || slotProps.data.valueTypeIri }}
        </div>
      </template>
    </Column>
    <Column field="inheritedFromName" header="Inherited From">
      <template #body="slotProps">
        <div
          v-if="slotProps.data.inheritedFromName"
          class="link"
          @click="navigate(slotProps.data.inheritedFromIri)"
        >
          {{ slotProps.data.inheritedFromName }}
        </div>
        <div v-else>-</div>
      </template>
    </Column>
    <Column field="quantificationType" header="Cardinality">
      <template #body="slotProps">
        {{ `${slotProps.data.min || 0} : ${slotProps.data.max || "*"}` }}
      </template>
    </Column>
  </DataTable>
</template>
<script lang="ts">
import { mapState } from "vuex";
import { Options, Vue } from "vue-class-component";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import GraphData from "@/models/GraphData";

@Options({
  name: "PropertiesTable",
  components: {},
  computed: mapState(["conceptAggregate"]),
  watch: {
    async conceptAggregate(newValue) {
      this.properties = this.getProperties(newValue.graph);
    }
  }
})
export default class PropertiesTable extends Vue {
  properties = [];

  navigate(iri: any) {
    const currentRoute = this.$route.name as RouteRecordName | undefined;
    if (iri)
      this.$router.push({
        name: currentRoute,
        params: { selectedIri: iri }
      });
  }

  getProperties(graph: GraphData) {
    const allProperties: any[] = [];
    const properties = graph.children.filter(
      (child: any) => child.name === "Properties"
    );
    properties[0].children.forEach((prop: any) => {
      allProperties.push(...prop.children);
    });
    return allProperties;
  }
}
</script>

<style scoped>
div.link {
  cursor: pointer;
}

.capitalize-text {
  text-transform: lowercase;
}

.capitalize-text:first-letter {
  text-transform: capitalize;
}

#properties-table {
  height: 604px;
}
</style>
