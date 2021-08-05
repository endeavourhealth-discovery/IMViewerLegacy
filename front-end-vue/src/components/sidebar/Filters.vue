<template>
  <div class="p-field">
    <span class="p-float-label">
      <MultiSelect
        id="status"
        v-model="selectedStatus"
        @change="checkForSearch"
        :options="statusOptions"
        optionLabel="name"
        display="chip"
      />
      <label for="status">Select status:</label>
    </span>
  </div>

  <div class="p-field">
    <span class="p-float-label">
      <MultiSelect
        id="scheme"
        v-model="selectedSchemes"
        @change="checkForSearch"
        :options="schemeOptions"
        optionLabel="name"
        display="chip"
      />
      <label for="scheme">Select scheme:</label>
    </span>
  </div>

  <div class="p-field">
    <span class="p-float-label">
      <MultiSelect
        id="conceptType"
        v-model="selectedTypes"
        @change="checkForSearch"
        :options="typeOptions"
        optionLabel="name"
        display="chip"
      />
      <label for="scheme">Select concept type:</label>
    </span>
  </div>
</template>

<script lang="ts">
import ConfigService from "@/services/ConfigService";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Filters",
  components: {},
  props: ["search", "searchTerm"],
  async mounted() {
    await ConfigService.getFilterDefaults()
      .then(res => {
        this.configs = res.data;
      })
      .catch(err => {
        this.$toast.add(LoggerService.error("Failed to get filter configs from server", err));
      });

    await EntityService.getNamespaces()
      .then(res => {
        this.schemeOptions = res.data;
      })
      .catch(err => {
        this.$toast.add(
          LoggerService.error(
            "Failed to get scheme filter options from server",
            err
          )
        );
      });

    await EntityService.getEntityChildren("http://endhealth.info/im#Status")
      .then(res => {
        this.statusOptions = res.data;
      })
      .catch(err => {
        this.$toast.add(
          LoggerService.error(
            "Failed to get status filter options from server",
            err
          )
        );
      });

    await EntityService.getEntityChildren("http://endhealth.info/im#EntityType")
      .then(res => {
        // this.typeOptions = res.data;
        this.typeOptions = [
          {
            "@id": "http://www.w3.org/2002/07/owl#Class",
            name: "Class"
          },
          {
            "@id": "http://endhealth.info/im#Folder",
            name: "Folder"
          },
          {
            "@id": "http://endhealth.info/im#LegacyEntity",
            name: "Legacy concept"
          },
          {
            "@id": "http://www.w3.org/ns/shacl#NodeShape",
            name: "Node shape"
          },
          {
            "@id": "http://www.w3.org/2002/07/owl#ObjectProperty",
            name: "ObjectProperty"
          },
          {
            "@id": "http://endhealth.info/im#QueryTemplate",
            name: "Query template"
          },
          {
            "@id": "http://endhealth.info/im#RecordType",
            name: "Record type"
          },
          {
            "@id": "http://endhealth.info/im#ValueSet",
            name: "Value set"
          }
        ]
      })
      .catch(err => {
        this.$toast.add(
          LoggerService.error(
            "Failed to get type filter options from server",
            err
          )
        );
      });

      this.setDefaults();
  },
  data() {
    return {
      statusOptions: [] as any[],
      schemeOptions: [] as any[],
      typeOptions: [] as any[],
      selectedStatus: [] as any[],
      selectedSchemes: [] as any[],
      selectedTypes: [] as any[],
      configs: {} as any
    };
  },
  methods: {
    checkForSearch() {
      if (this.searchTerm.length > 2) {
        this.search();
      }
    },

    setDefaults() {
      this.selectedStatus = this.statusOptions.filter(item => this.configs.statusOptions.includes(item.name));
      this.selectedSchemes = this.schemeOptions.filter(item => this.configs.schemeOptions.includes(item.name));
      this.selectedTypes = this.typeOptions.filter(item => this.configs.typeOptions.includes(item.name));
    }
  }
});
</script>

<style scoped>
label {
  font-size: 1rem !important;
}

.p-field {
  margin-top: 1rem;
}
</style>
