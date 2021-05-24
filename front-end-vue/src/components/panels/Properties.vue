<template>
  <DataTable
    :value="properties"
    :rowsPerPageOptions="[10, 25, 50]"
    :paginator="properties.length > 10 ? true : false"
    :rows="10"
    :scrollable="true"
    :scrollHeight="scrollHeight"
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
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import { defineComponent } from "@vue/runtime-core";
import ConceptService from "@/services/ConceptService";

export default defineComponent({
  name: "Properties",
  components: {},
  props: {
    conceptIri: String
  },
  watch: {
    async conceptIri(newValue) {
      this.properties = await this.getProperties(newValue);
    }
  },
  async mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
    if (this.conceptIri) {
      this.properties = await this.getProperties(this.conceptIri);
    }
    this.setScrollHeight();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      properties: [] as any[],
      scrollHeight: ""
    };
  },
  methods: {
    onResize(): void {
      this.setScrollHeight();
    },
    navigate(iri: any) {
      const currentRoute = this.$route.name as RouteRecordName | undefined;
      if (iri)
        this.$router.push({
          name: currentRoute,
          params: { selectedIri: iri }
        });
    },

    async getProperties(iri: string) {
      const graph = (await ConceptService.getConceptGraph(iri)).data;
      const allProperties: any[] = [];
      const properties = graph.children.filter(
        (child: any) => child.name === "Properties"
      );
      properties[0].children.forEach((prop: any) => {
        allProperties.push(...prop.children);
      });
      return allProperties;
    },

    setScrollHeight(): void {
      const container = document.getElementsByClassName(
        "concept-container"
      )[0] as HTMLElement;
      const header = document.getElementsByClassName(
        "p-panel-header"
      )[0] as HTMLElement;
      const nav = document.getElementsByClassName(
        "p-tabview-nav"
      )[1] as HTMLElement;
      const properties = document.getElementById("properties-table") as HTMLElement;
      const paginator = properties.getElementsByClassName(
        "p-paginator"
      )[0] as HTMLElement;
      const currentFontSize = parseFloat(
        window
          .getComputedStyle(document.documentElement, null)
          .getPropertyValue("font-size")
      );
      const paginatorHeight =
        paginator?.getBoundingClientRect().height === 0
          ? currentFontSize * 3.7
          : paginator?.getBoundingClientRect().height;
      this.scrollHeight =
        container?.getBoundingClientRect().height -
        header?.getBoundingClientRect().height -
        nav?.getBoundingClientRect().height -
        paginatorHeight -
        currentFontSize * 4 -
        1 +
        "px";
    }
  }
});
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
