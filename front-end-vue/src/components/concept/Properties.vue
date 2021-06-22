<template>
  <DataTable
    :value="properties"
    :paginator="properties.length > 5 ? true : false"
    :rows="5"
    :scrollable="true"
    :scrollHeight="scrollHeight"
    id="properties-table"
  >
    <template #empty>
      No records found
    </template>
    <Column field="property.name" header="Name" :sortable="true">
      <template #body="slotProps">
        <div class="link" @click="navigate(slotProps.data.property?.iri)">
          {{ slotProps.data.property?.name }}
        </div>
      </template>
    </Column>
    <Column field="type.name" header="Type" :sortable="true">
      <template #body="slotProps">
        <div class="link" @click="navigate(slotProps.data.type.iri)">
          {{ slotProps.data.type?.name || slotProps.data.type?.iri }}
        </div>
      </template>
    </Column>
    <Column field="inherited.name" header="Inherited From" :sortable="true">
      <template #body="slotProps">
        <div
          v-if="slotProps.data.inherited?.name"
          class="link"
          @click="navigate(slotProps.data.inherited?.iri)"
        >
          {{ slotProps.data.inherited?.name }}
        </div>
        <div v-else>-</div>
      </template>
    </Column>
    <Column field="cardinality" header="Cardinality">
      <template #body="slotProps">
        <div v-if="slotProps.data.cardinality">
          {{
            `${slotProps.data.cardinality.minExclusive ||
              slotProps.data.cardinality.minInclusive ||
              0} :
            ${slotProps.data.cardinality.maxExclusive ||
              slotProps.data.cardinality.maxInclusive ||
              "*"}`
          }}
        </div>
        <div v-else>-</div>
      </template>
    </Column>
  </DataTable>
</template>
<script lang="ts">
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import { defineComponent } from "@vue/runtime-core";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "Properties",
  components: {},
  props: ["properties", "contentHeight"],
  watch: {
    contentHeight() {
      this.setScrollHeight();
    }
  },
  mounted() {
    this.setScrollHeight();
  },
  data() {
    return {
      scrollHeight: ""
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
    },

    setScrollHeight(): void {
      const container = document.getElementById(
        "definition-container"
      ) as HTMLElement;
      const properties = document.getElementById(
        "properties-table"
      ) as HTMLElement;
      const summary = container.getElementsByClassName(
        "summary-container"
      )[0] as HTMLElement;
      const defDivider = container.getElementsByClassName(
        "p-divider"
      )[0] as HTMLElement;
      const defContainer = container.getElementsByClassName(
        "definitional-container"
      )[0] as HTMLElement;
      const structDivider = container.getElementsByClassName(
        "p-divider"
      )[1] as HTMLElement;
      const paginator = properties.getElementsByClassName(
        "p-paginator"
      )[0] as HTMLElement;
      if (
        container &&
        properties &&
        summary &&
        defDivider &&
        defContainer &&
        structDivider
      ) {
        if (paginator) {
          this.scrollHeight =
            this.contentHeight -
            summary.getBoundingClientRect().height -
            defDivider.getBoundingClientRect().height -
            defContainer.getBoundingClientRect().height -
            structDivider.getBoundingClientRect().height -
            paginator.getBoundingClientRect().height -
            1 +
            "px";
        } else {
          this.scrollHeight =
            this.contentHeight -
            summary.getBoundingClientRect().height -
            defDivider.getBoundingClientRect().height -
            defContainer.getBoundingClientRect().height -
            structDivider.getBoundingClientRect().height -
            1 +
            "px";
        }
      } else {
        LoggerService.error(
          "Properties table scroll height setter failed due to undefined element"
        );
      }
    }
  }
});
</script>

<style scoped>
div.link {
  cursor: pointer;
}
</style>
