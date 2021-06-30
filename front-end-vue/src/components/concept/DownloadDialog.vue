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
      <h4 v-if="concept[RDFS_LABEL]">
        {{ concept[RDFS_LABEL] }}
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
            :disabled="!children?.length"
            id="children"
            :binary="true"
            value="Include children"
            v-model="includeChildren"
          />
          <label class="label" for="children">Include children</label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            :disabled="!dataModelProperties?.length"
            id="data-model-properties"
            :binary="true"
            value="Include data model properties"
            v-model="includeDataModelProperties"
          />
          <label class="label" for="data-model-properties">
            Include data model properties
          </label>
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
            :disabled="!includeMembers"
            id="expandMembers"
            :binary="true"
            value="Expand members"
            v-model="expandMembers"
          />
          <label class="label" for="expandMembers">Expand members</label>
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
            :disabled="!semanticProperties?.length"
            id="semantic-properties"
            :binary="true"
            value="Include semantic properties"
            v-model="includeSemanticProperties"
          />
          <label class="label" for="semantic-properties">
            Include semantic properties
          </label>
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
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { defineComponent } from "@vue/runtime-core";
import { RDFS } from "@/vocabulary/RDFS";

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
      dataModelProperties: [],
      semanticProperties: [],
      members: {} as any,
      includeChildren: true,
      includeDataModelProperties: true,
      includeMembers: true,
      expandMembers: false,
      includeParents: true,
      includeInactive: false,
      includeSemanticProperties: false,
      RDFS_LABEL: RDFS.LABEL,
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
        "api/entity/download?iri=" +
        modIri +
        "&format=" +
        this.format.value +
        "&children=" +
        this.includeChildren +
        "&dataModelProperties=" +
        this.includeDataModelProperties +
        "&members=" +
        this.includeMembers +
        "&expandMembers=" +
        this.expandMembers +
        "&parents=" +
        this.includeParents +
        "&semanticProperties=" +
        this.includeSemanticProperties +
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
      this.concept = (
        await EntityService.getPartialEntity(iri, [RDFS.LABEL])
      ).data;
      this.parents = (await EntityService.getEntityParents(iri)).data;
      this.children = (await EntityService.getEntityChildren(iri)).data;
      this.dataModelProperties = (
        await EntityService.getDataModelProperties(iri)
      ).data;
      this.semanticProperties = (
        await EntityService.getSemanticProperties(iri)
      ).data;
      this.members = (
        await EntityService.getEntityMembers(iri, this.expandMembers)
      ).data;

      this.includeParents = !!this.parents.length;
      this.includeChildren = !!this.children.length;
      this.includeDataModelProperties = !!this.dataModelProperties.length;
      this.includeSemanticProperties = !!this.semanticProperties.length;
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
