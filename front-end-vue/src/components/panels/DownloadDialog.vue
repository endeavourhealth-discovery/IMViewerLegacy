<template>
  <Dialog
    :visible="showDialog"
    :modal="true"
    :closable="false"
    :maximizable="true"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3>Download Concept:</h3>
    </template>
    <div id="content" class="p-d-flex p-flex-column p-jc-center p-ai-center">
      <h4 v-if="concept['http://www.w3.org/2000/01/rdf-schema#label']">
        {{ concept["http://www.w3.org/2000/01/rdf-schema#label"] }}
      </h4>
      <SelectButton
        class="format-container"
        v-model="format"
        :options="formatOptions"
        datakey="value"
        optionLabel="name"
      />
      <div
        class="options-container p-d-flex p-flex-row p-flex-wrap p-jc-around"
      >
        <div class="checkbox-label">
          <Checkbox
            :disabled="!children?.length"
            id="children"
            :binary="true"
            value="Include children"
            v-model="includeChildren"
          />
          <label class="label" for="children">Include Children</label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            :disabled="!props?.length"
            id="properties"
            :binary="true"
            value="Include properties"
            v-model="includeProperties"
          />
          <label class="label" for="properties">Include properties</label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            :disabled="
              !$store.state.members?.included?.length &&
                !$store.state.members?.excluded?.length
            "
            id="members"
            :binary="true"
            value="Include members"
            v-model="includeMembers"
          />
          <label class="label" for="members">Include members</label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            :disabled="!parents?.length"
            id="parents"
            :binary="true"
            value="Include parents"
            v-model="includeParents"
          />
          <label class="label" for="parents">Include parents</label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            id="inactive"
            :binary="true"
            value="Include inactive"
            v-model="includeInactive"
          />
          <label class="label" for="inactive">Include inactive</label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            :disabled="!roles?.length"
            id="roles"
            :binary="true"
            value="Include roles"
            v-model="includeRoles"
          />
          <label class="label" for="roles">Include roles</label>
        </div>
      </div>
      <div class="download-button-container p-d-flex p-flex-row p-jc-around">
        <Button
          label="Download Concept"
          icon="pi pi-download"
          class="p-button-primary button-download button-left"
          @click="downloadConcept"
        />
      </div>
    </div>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="p-button-secondary"
        @click="closeDownloadDialog"
      />
    </template>
  </Dialog>
</template>

<script lang="ts">
import ConceptService from "@/services/ConceptService";
import LoggerService from "@/services/LoggerService";
import { IM } from "@/vocabulary/IM";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "DownloadDialog",
  props: ["conceptIri", "showDialog"],
  watch: {
    async conceptIri(newValue) {
      await this.init(newValue);
    }
  },
  async mounted() {
    await this.init(this.conceptIri);
  },

  data() {
    return {
      concept: {},
      parents: [] as any,
      children: [] as any,
      props: [],
      roles: [],
      members: {} as any,
      includeChildren: true,
      includeProperties: true,
      includeMembers: true,
      includeParents: true,
      includeInactive: false,
      includeRoles: false,
      format: {
        name: "Excel(.xlsx)",
        value: "excel",
        mime:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      },
      formatOptions: [
        { name: "JSON", value: "json", mime: "application/json" },
        {
          name: "Excel(.xlsx)",
          value: "excel",
          mime:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
      ]
    };
  },
  methods: {
    closeDownloadDialog() {
      this.$emit("closeDownloadDialog");
    },

    downloadConcept() {
      const modIri = this.conceptIri
        .replace(/\//gi, "%2F")
        .replace(/#/gi, "%23");

      const url =
        process.env.VUE_APP_API +
        "api/concept/download?iri=" +
        modIri +
        "&format=" +
        this.format.value +
        "&children=" +
        this.includeChildren +
        "&properties=" +
        this.includeProperties +
        "&members=" +
        this.includeMembers +
        "&parents=" +
        this.includeParents +
        "&roles=" +
        this.includeRoles +
        "&inactive=" +
        this.includeInactive;
      const popup = window.open(url);
      if (!popup) {
        this.$toast.add(LoggerService.error("Download failed from server"));
      } else {
        this.$toast.add(LoggerService.success("Download will begin shortly"));
      }
      this.closeDownloadDialog();
    },
    async init(iri: string) {
      this.concept = (await ConceptService.getConcept(iri)).data;
      this.parents = (await ConceptService.getConceptParents(iri)).data;
      this.children = (await ConceptService.getConceptChildren(iri)).data;
      this.props = (await ConceptService.getConceptProperties(iri)).data;
      this.roles = (await ConceptService.getConceptRoles(iri)).data;
      this.members = (await ConceptService.getConceptMembers(iri, false)).data;

      this.includeParents = !!this.parents.length;
      this.includeChildren = !!this.children.length;
      this.includeProperties = !!this.props.length;
      this.includeRoles = !!this.roles.length;
      this.includeMembers =
        !!this.members?.included?.length || !!this.members.excluded?.length;
    }
  }
});
</script>

<style scoped>
.button-left {
  margin-right: 1rem;
}
.options-container {
  width: 60%;
  margin-bottom: 2rem;
}
.checkbox-label {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: 0.5em;
}
.label {
  margin-left: 0.5em;
}
.format-container {
  margin-bottom: 1rem;
}
h4 {
  margin-bottom: 1em;
}
</style>
