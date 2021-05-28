<template>
  <div>
    <div class="p-d-flex p-flex-row p-jc-start summary-container">
      <div class="left-side" v-if="concept">
        <div class="p-d-flex p-flex-row p-jc-start p-ai-center">
          <p>
            <strong>Name:</strong>
            {{ concept.name }}
          </p>
        </div>
        <p class="break-text">
          <strong>Iri:</strong>
          {{ concept.iri }}
        </p>
        <p>
          <strong>Status: </strong>
          {{ concept.status }}
        </p>
        <p>
          <strong>Types: </strong>
          {{ conceptTypes }}
        </p>
      </div>
      <div class="right-side" v-if="concept.description">
        <strong>Description:</strong>
        <Description :description="descriptionHTML" />
      </div>
    </div>
    <Divider align="left">
      <div class="p-d-inline-flex p-ai-center">
        <strong>Definitional properties</strong>
      </div>
    </Divider>
    <div class="p-d-flex p-flex-row p-jc-start summary-container">
      <div class="left-side">
        <strong>is a: </strong>{{ parents.length }}
        <Listbox
          :options="parents"
          listStyle="height: 12rem;"
          v-model="selected"
          @change="navigate(selected?.['@id'])"
        >
          <template #option="slotProps">
            <div>
              {{ slotProps.option?.name || slotProps.option?.["@id"] }}
            </div>
          </template>
        </Listbox>
      </div>
      <div class="right-side">
        <strong>has sub types: </strong>{{ children?.length }}
        <Listbox
          :options="children"
          listStyle="height: 12rem;"
          v-model="selected"
          @change="navigate(selected.iri)"
        >
          <template #option="slotProps">
            <div>
              {{ slotProps.option.name || slotProps.option["@id"] }}
            </div>
          </template>
        </Listbox>
      </div>
    </div>
    <Divider align="left">
      <div class="p-d-inline-flex p-ai-center">
        <strong>Data model properties</strong>
      </div>
    </Divider>
    <DataTable
      :value="properties"
      :rowsPerPageOptions="[10, 25, 50]"
      :paginator="properties?.length > 10 ? true : false"
      :rows="10"
      :scrollable="true"
      scrollHeight="flex"
    >
      <template #empty>
        No records found
      </template>
      <Column field="name" header="Property">
        <template #body="slotProps">
          <div
            class="link capitalize-text"
            @click="navigate(slotProps.data?.property?.iri)"
          >
            {{ slotProps.data?.property?.name }}
          </div>
        </template>
      </Column>
      <Column field="name" header="Range">
        <template #body="slotProps">
          <div
            class="link capitalize-text"
            @click="navigate(slotProps.data?.range?.iri)"
          >
            {{ slotProps.data?.range?.name }}
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import ConceptService from "@/services/ConceptService";
import Description from "./Description.vue";

export default defineComponent({
  name: "Definition",
  components: { Description },
  props: {
    concept: {} as any
  },
  computed: {
    conceptTypes(): string {
      return this.concept?.types
        ?.map(function(type: any) {
          return type.name;
        })
        .join(", ");
    },

    descriptionHTML(): string {
      const text = this.concept.description?.replaceAll(
        "<p>",
        "</p>\n<p class='description-p'>"
      );
      return "<p class='description-p'>" + text + "</p>";
    }
  },
  async mounted() {
    await this.init();
  },
  data() {
    return {
      children: [],
      parents: [],
      properties: [],
      selected: {}
    };
  },
  watch: {
    async concept() {
      this.$store.state.cancelSource.cancel("Cancel");
      await this.init();
    }
  },
  methods: {
    async init() {
      this.children = [];
      this.parents = [];
      this.properties = [];
      this.$store.commit("updateCancelSource");
      if (this.concept.iri) {
        this.children = (
          await ConceptService.getDefinitionSubTypes(
            this.concept.iri,
            this.$store.state.cancelSource.token
          )
        ).data;
        this.parents = (
          await ConceptService.getConceptParents(this.concept.iri)
        ).data;
        this.properties = (
          await ConceptService.getDataModelProperties(
            this.concept.iri,
            this.$store.state.cancelSource.token
          )
        ).data;
      }
    },

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
.summary-container {
  width: 100%;
  gap: 7px;
}

.left-side {
  width: 50%;
}

.right-side {
  width: 50%;
}

.custom .p-scrollpanel-wrapper {
  border-right: 9px solid #f4f4f4;
}

.custom .p-scrollpanel-bar {
  background-color: #1976d2 !important;
  opacity: 1;
  transition: background-color 0.3s;
}

.custom .p-scrollpanel-bar:hover {
  background-color: #135ba1 !important;
}

p {
  margin: 0;
}

#synonyms-button {
  margin-left: 0.5em;
}

.break-text {
  word-break: break-all;
}

.description {
  height: 100%;
  width: 100%;
}
.link {
  cursor: pointer;
}
</style>
