<template>
  <Dialog :visible="showDialog" :modal="true" :closable="false" :maximizable="true" :style="{ width: '50vw' }">
    <template #header>
      <h3>Download Concept:</h3>
    </template>
    <div v-if="loading" class="loading-container">
      <ProgressSpinner />
    </div>
    <div v-else id="content" class="p-d-flex p-flex-column p-jc-center p-ai-center">
      <h4 v-if="concept[RDFS_LABEL]">
        {{ concept[RDFS_LABEL] }}
      </h4>
      <SelectButton class="format-container" v-model="format" :options="formatOptions" datakey="value" optionLabel="name" />
      <div class="options-container p-d-flex p-flex-row p-flex-wrap p-jc-around">
        <div class="checkbox-label">
          <Checkbox :disabled="!inferred" id="inferred" :binary="true" value="Include is a" v-model="includeInferred" />
          <label class="label" :class="includeInferred ? null : 'inactive-text'" for="inferred">
            Include inferred
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox :disabled="!hasSubTypes" id="has-sub-types" :binary="true" value="Include has sub types" v-model="includeHasSubTypes" />
          <label class="label" :class="includeHasSubTypes ? null : 'inactive-text'" for="has-sub-types">
            Include has sub types
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox :disabled="!isChildOf" id="is-child-of" :binary="true" value="Include is child of" v-model="includeIsChildOf" />
          <label class="label" :class="includeIsChildOf ? null : 'inactive-text'" for="is-child-of">
            Include is child of
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox :disabled="!hasChildren" id="has-children" :binary="true" value="Include has children" v-model="includeHasChildren" />
          <label class="label" :class="includeHasChildren ? null : 'inactive-text'" for="has-children">
            Include has children
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox :disabled="!terms" id="terms" :binary="true" value="Include terms" v-model="includeTerms" />
          <label class="label" :class="includeTerms ? null : 'inactive-text'" for="terms">
            Include terms
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            :disabled="!dataModelProperties"
            id="data-model-properties"
            :binary="true"
            value="Include data model properties"
            v-model="includeDataModelProperties"
          />
          <label class="label" :class="includeDataModelProperties ? null : 'inactive-text'" for="data-model-properties">
            Include data model properties
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox :disabled="!axioms" id="axioms" :binary="true" value="Include axioms" v-model="includeAxioms" />
          <label class="label" :class="includeAxioms ? null : 'inactive-text'" for="axioms">
            Include semantic properties
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox :disabled="!members" id="members" :binary="true" value="Include members" v-model="includeMembers" />
          <label class="label" :class="includeMembers ? null : 'inactive-text'" for="members">
            Include members
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox :disabled="!includeMembers" id="expandMembers" :binary="true" value="Expand members" v-model="expandMembers" />
          <label class="label" :class="includeMembers ? null : 'inactive-text'" for="expandMembers">
            Expand members
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox id="inactive" :binary="true" value="Include inactive" v-model="includeInactive" />
          <label class="label" for="inactive">
            Include inactive children/parents
          </label>
        </div>
      </div>
      <div class="download-button-container p-d-flex p-flex-row p-jc-around">
        <Button label="Download Concept" icon="pi pi-download" class="p-button-primary button-download button-left" @click="downloadConcept" />
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="closeDownloadDialog" />
    </template>
  </Dialog>
</template>

<script lang="ts">
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { defineComponent } from "@vue/runtime-core";
import { RDFS } from "@/vocabulary/RDFS";
import { IM } from "@/vocabulary/IM";

export default defineComponent({
  name: "DownloadDialog",
  props: {
    conceptIri: { type: String, required: true },
    showDialog: { type: Boolean, required: true }
  },
  emits: ["closeDownloadDialog"],
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
      concept: {} as any,
      inferred: {} as any,
      axioms: {} as any,
      hasSubTypes: [] as any[],
      isChildOf: [] as any[],
      hasChildren: [] as any[],
      terms: [] as any[],
      dataModelProperties: [] as any[],
      members: {} as any,
      includeHasSubTypes: true,
      includeDataModelProperties: true,
      includeMembers: true,
      expandMembers: false,
      includeInferred: true,
      includeAxioms: false,
      includeIsChildOf: false,
      includeHasChildren: false,
      includeInactive: false,
      includeTerms: false,
      loading: false,
      RDFS_LABEL: RDFS.LABEL,
      format: {
        name: "Excel(.xlsx)",
        value: "excel",
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      },
      formatOptions: [
        { name: "JSON", value: "json", mime: "application/json" },
        {
          name: "Excel(.xlsx)",
          value: "excel",
          mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
      ]
    };
  },
  methods: {
    closeDownloadDialog() {
      this.$emit("closeDownloadDialog");
    },

    downloadConcept() {
      const modIri = this.conceptIri.replace(/\//gi, "%2F").replace(/#/gi, "%23");

      const url =
        process.env.VUE_APP_API +
        "api/entity/download?iri=" +
        modIri +
        "&format=" +
        this.format.value +
        "&hasSubTypes=" +
        this.includeHasSubTypes +
        "&dataModelProperties=" +
        this.includeDataModelProperties +
        "&members=" +
        this.includeMembers +
        "&expandMembers=" +
        this.expandMembers +
        "&inferred=" +
        this.includeInferred +
        "&axioms=" +
        this.includeAxioms +
        "&terms=" +
        this.includeTerms +
        "&isChildOf=" +
        this.includeIsChildOf +
        "&hasChildren=" +
        this.includeHasChildren +
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
      this.loading = true;
      this.concept = await EntityService.getPartialEntity(iri, [RDFS.LABEL, IM.IS_CHILD_OF, IM.HAS_CHILDREN]);
      if (Object.prototype.hasOwnProperty.call(this.concept, IM.IS_CHILD_OF) && this.concept[IM.IS_CHILD_OF].length) {
        this.isChildOf = this.concept[IM.IS_CHILD_OF];
      }
      if (Object.prototype.hasOwnProperty.call(this.concept, IM.HAS_CHILDREN) && this.concept[IM.HAS_CHILDREN]) {
        this.hasChildren = this.concept[IM.HAS_CHILDREN];
      }

      this.inferred = await EntityService.getInferredBundle(iri);

      this.axioms = await EntityService.getAxiomBundle(iri);

      this.hasSubTypes = await EntityService.getEntityChildren(iri);

      this.terms = await EntityService.getEntityTermCodes(iri);

      this.dataModelProperties = await EntityService.getDataModelProperties(iri);

      this.members = await EntityService.getEntityMembers(iri, this.expandMembers, false);

      this.setIncludeBooleans();
      this.loading = false;
    },

    setIncludeBooleans() {
      this.includeInferred = !!this.inferred;
      this.includeAxioms = !!this.axioms;
      this.includeHasSubTypes = !!this.hasSubTypes.length;
      this.includeIsChildOf = !!this.isChildOf.length;
      this.includeHasChildren = !!this.hasChildren.length;
      this.includeTerms = !!this.terms.length;
      this.includeDataModelProperties = !!this.dataModelProperties.length;
      this.includeMembers = !!(Object.prototype.hasOwnProperty.call(this.members, "members") && this.members.members.length);
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

.inactive-text {
  color: lightgray;
  text-decoration: line-through;
}

.loading-container {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
</style>
