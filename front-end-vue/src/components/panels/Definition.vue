<template>
  <div>
    <div class="p-d-flex p-flex-row p-jc-start summary-container">
      <div
        class="left-side"
        v-if="concept['http://www.w3.org/2000/01/rdf-schema#label']"
      >
        <div class="p-d-flex p-flex-row p-jc-start p-ai-center">
          <p>
            <strong>Name:</strong>
            {{ concept["http://www.w3.org/2000/01/rdf-schema#label"] }}
          </p>
        </div>
        <p class="break-text">
          <strong>Iri:</strong>
          {{ concept["@id"] }}
        </p>
        <p>
          <strong>Status: </strong>
          <span v-if="concept['http://endhealth.info/im#status']">
            {{ concept["http://endhealth.info/im#status"]["name"] }}
          </span>
        </p>
        <p>
          <strong>Types: </strong>
          <span
            v-if="concept['http://www.w3.org/1999/02/22-rdf-syntax-ns#type']"
          >
            {{ conceptTypes }}
          </span>
        </p>
      </div>
      <div
        class="right-side"
        v-if="concept['http://www.w3.org/2000/01/rdf-schema#comment']"
      >
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
        <strong>is a: </strong>{{ isA?.length }}
        <Listbox
          :options="isA"
          listStyle="height: 12rem;"
          v-model="selected"
          @change="navigate(selected['@id'])"
        >
          <template #option="slotProps">
            <div>
              {{ slotProps.option.name || slotProps.option["@id"] }}
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
          @change="navigate(selected['@id'])"
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
            @click="navigate(slotProps.data?.property?.['@id'])"
          >
            {{ slotProps.data?.property?.name }}
          </div>
        </template>
      </Column>
      <Column field="name" header="Range">
        <template #body="slotProps">
          <div
            class="link capitalize-text"
            @click="navigate(slotProps.data?.range?.['@id'])"
          >
            {{ slotProps.data?.range?.name }}
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { RDFS } from "@/vocabulary/RDFS";
import { defineComponent } from "vue";
import { RDF } from "@/vocabulary/RDF";
import { IM } from "@/vocabulary/IM";
import { SHACL } from "@/vocabulary/SHACL";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import ConceptService from "@/services/ConceptService";
import Description from "./Description.vue";
import { OWL } from "@/vocabulary/OWL";

export default defineComponent({
  name: "Definition",
  components: { Description },
  props: {
    concept: {} as any
  },
  computed: {
    isA(): [] {
      return this.concept[IM.IS_A];
    },

    properties(): [] {
      const roles = this.concept?.[IM.ROLE_GROUP]?.map(
        (x: { [x: string]: any }) => {
          return {
            property: x?.[OWL.ON_PROPERTY],
            range: x?.[OWL.SOME_VALUES_FROM]
          };
        }
      );
      const properties = this.concept?.[SHACL.PROPERTY]?.map(
        (x: { [x: string]: any }) => {
          return {
            property: x?.[SHACL.PATH],
            range: x?.[SHACL.CLASS] || x?.[SHACL.DATATYPE]
          };
        }
      );
      if (roles && properties) return properties?.concat(roles);
      return roles || properties;
    },

    subClasses(): [] {
      return this.concept[RDFS.SUBCLASS];
    },

    conceptTypes(): string {
      return this.concept[RDF.TYPE]
        .map(function(type: any) {
          return type.name;
        })
        .join(", ");
    },

    descriptionHTML(): string {
      const text = this.concept?.[RDFS.COMMENT]?.replaceAll(
        "<p>",
        "</p>\n<p class='description-p'>"
      );
      return "<p class='description-p'>" + text + "</p>";
    }
  },
  async mounted() {
    this.$store.commit("updateCancelSource");
    if (this.concept?.[IM.IRI]) await this.getChildren(this.concept[IM.IRI]);
  },
  data() {
    return {
      children: [],
      selected: {}
    };
  },
  watch: {
    async concept(newValue) {
      this.$store.state.cancelSource.cancel("Cancel");
      this.$store.commit("updateCancelSource");
      this.children = [];
      await this.getChildren(newValue[IM.IRI]);
    }
  },
  methods: {
    async getChildren(iri: string) {
      try {
        this.children = (
          await ConceptService.getConceptChildren(
            iri,
            this.$store.state.cancelSource.token
          )
        ).data;
      } catch (error) {
        console.log(error);
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
