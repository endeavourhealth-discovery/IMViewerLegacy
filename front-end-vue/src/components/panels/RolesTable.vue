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
    <Column field="property.name" header="Name">
      <template #body="slotProps">
        <div
          class="link capitalize-text"
          @click="navigate(slotProps.data.property.iri)"
        >
          {{ slotProps.data.property.name }}
        </div>
      </template>
    </Column>
    <Column field="valueType.name" header="Type">
      <template #body="slotProps">
        <div v-if="slotProps.data.valueType" class="link" @click="navigate(slotProps.data.valueType.iri)">
          {{ slotProps.data.valueType.name || slotProps.data.valueType.iri }}
        </div>
      </template>
    </Column>
  </DataTable>
</template>
<script lang="ts">
import { mapState } from "vuex";
import { Options, Vue } from "vue-class-component";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";

@Options({
  name: "RolesTable",
  components: {},
  computed: mapState(["conceptAggregate"]),
  watch: {
    async conceptAggregate(newValue) {
      this.roles = newValue.roles;
    }
  }
})
export default class RolesTable extends Vue {
  roles = [];

  navigate(iri: string) {
    const currentRoute = this.$route.name as RouteRecordName | undefined;
    if (iri)
      this.$router.push({
        name: currentRoute,
        params: { selectedIri: iri }
      });
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
