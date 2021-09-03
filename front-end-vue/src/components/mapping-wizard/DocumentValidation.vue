<template>
  <div class="panel-content">
    <Editor v-model="value" editorStyle="height: 320px">
      <template #toolbar>
        <span class="ql-formats"> Turtle map </span>
      </template>
    </Editor>
  </div>
  <div class="button-bar p-d-flex p-flex-row p-jc-end" id="button-bar">
    <Button label="Back" @click="prevPage" />
    <Button label="Download" @click="download" />
    <Button label="Next" @click="nextPage" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DocumentValidation",
  computed: {},
  data() {
    return {
      pageIndex: 2,
      value: `@prefix rr: <http://www.w3.org/ns/r2rml#>.
@prefix rml: <http://semweb.mmlab.be/ns/rml#>.
@prefix ql: <http://semweb.mmlab.be/ns/ql#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix im: <http://endhealth.info/im#>.
@base <http://example.com/ns#>.
      
<#LSOAV2> a rr:TriplesMap;
  rml:logicalSource [
    rml:source "Organisation_Details.csv" ;
    rml:referenceFormulation ql:CSV
  ];
  
  rr:subjectMap [
    rr:template "http://org.endhealth.info/im#{OrganisationId}";
    rr:class im:Organisation
  ];
      
  rr:predicateObjectMap [
    rr:predicate rdfs:label;
    rr:objectMap [
      rml:reference "Name"
    ]
  ].`
    };
  },
  methods: {
    download() {
      const blob = new Blob([this.value]);
      const fileURL = URL.createObjectURL(blob);

      const fileLink = document.createElement("a");

      fileLink.href = fileURL;
      fileLink.setAttribute("download", "map.ttl");
      document.body.appendChild(fileLink);

      fileLink.click();
    },
    nextPage() {
      this.$emit("next-page", {
        pageIndex: this.pageIndex
      });
    },
    prevPage() {
      this.$emit("prev-page", {
        pageIndex: this.pageIndex
      });
    }
  }
});
</script>

<style scoped>
#container {
  margin: 1rem;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
}

.loading-container {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

#button-bar {
  padding: 0 2rem 1rem 0;
  gap: 0.5rem;
}
</style>
