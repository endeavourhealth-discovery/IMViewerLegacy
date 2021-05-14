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

        <ScrollPanel style="height: 100px" class="custom">
          <!-- div content injected by javascript -->
          <div id="description"></div>
        </ScrollPanel>
      </div>
    </div>
    <Divider align="left">
      <div class="p-d-inline-flex p-ai-center">
        <b>Definitional properties</b>
      </div>
    </Divider>
    <div>
      <strong>is a: </strong>[{{ isA?.length }}]
      <ul>
        <li v-for="item in isA" :key="item">
          {{ item.name || item["@id"] }}
        </li>
      </ul>

      <!-- <Divider align="left">
      <div class="p-d-inline-flex p-ai-center">
        <b>Data model properties</b>
      </div>
    </Divider>
    <DataTable :value="data" responsiveLayout="scroll">
      <Column
        v-for="col of columns"
        :field="col.field"
        :header="col.header"
        :key="col.field"
      ></Column>
    </DataTable> -->
    </div>
  </div>
</template>

<script lang="ts">
import { RDFS } from "@/vocabulary/RDFS";
import { defineComponent } from "vue";
import { RDF } from "@/vocabulary/RDF";
import { IM } from "@/vocabulary/IM";

export default defineComponent({
  name: "Definition",
  components: {},
  props: {
    concept: {} as any,
  },
  computed: {
    isA(): [] {
      return this.concept[IM.IS_A];
    },

    // isA(): [] {
    //   return this.concept[IM.IS_A];
    // },

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
    },
  },
  watch: {
    descriptionHTML(newValue) {
      const descContainer = document.getElementById("description");
      if (descContainer) {
        descContainer.innerHTML = newValue;
      }
    },
  },
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
</style>
