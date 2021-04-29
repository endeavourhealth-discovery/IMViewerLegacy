<template>
  <DataTable
    :value="roles"
    :rowsPerPageOptions="[10, 25, 50]"
    :paginator="roles.length > 10 ? true : false"
    :rows="10"
    :scrollable="true"
    scrollHeight="flex"
    id="roles-table"
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
        <div
          v-if="slotProps.data.valueTypeName"
          class="link"
          @click="navigate(slotProps.data.valueTypeIri)"
        >
          {{ slotProps.data.valueTypeName || slotProps.data.valueTypeIri }}
        </div>
        <div v-else>
          -
        </div>
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
  name: "RolesTable",
  components: {},
  computed: mapState(["conceptAggregate"]),
  watch: {
    async conceptAggregate(newValue) {
      this.roles = this.getRoles(newValue.graph);
    }
  }
})
export default class RolesTable extends Vue {
  roles = [];

  navigate(iri: any) {
    const currentRoute = this.$route.name as RouteRecordName | undefined;
    if (iri)
      this.$router.push({
        name: currentRoute,
        params: { selectedIri: iri }
      });
  }

  getRoles(graph: GraphData) {
    const properties = graph.children.filter(
      (child: any) => child.name === "Roles"
    );
    return properties[0].children;
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

#roles-table {
  height: 604px;
}
</style>
