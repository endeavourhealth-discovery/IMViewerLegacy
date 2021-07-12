<template>
  <div class="p-d-flex p-flex-row p-jc-center" v-if="loading">
    <div class="spinner">
      <ProgressSpinner />
    </div>
  </div>
  <Listbox
    v-else
    :listStyle="listHeight"
    :filter="true"
    emptyMessage="No results found"
    emptyFilterMessage="No results found"
    v-model="selectedUsage"
    @change="onNodeSelect(selectedUsage)"
    :options="usages"
    optionLabel="name"
  />
</template>
<script lang="ts">
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "UsedIn",
  components: {},
  props: {
    conceptIri: String
  },
  watch: {
    async conceptIri(newValue) {
      await this.getUsages(newValue);
    }
  },
  async mounted() {
    window.addEventListener("resize", this.resize);
    this.setListboxHeight();
    if (this.conceptIri) {
      await this.getUsages(this.conceptIri);
    }
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resize);
  },
  data() {
    return {
      selectedUsage: {},
      usages: [],
      loading: false,
      listHeight: ""
    };
  },
  methods: {
    resize() {
      this.setListboxHeight();
    },
    async getUsages(iri: string) {
      this.loading = true;
      await EntityService.getEntityUsages(iri)
        .then(res => {
          this.usages = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error("Failed to get usages from server", err)
          );
        });
      this.loading = false;
    },

    onNodeSelect(concept: any) {
      this.$router.push({
        name: "Concept",
        params: { selectedIri: concept["@id"] }
      });
    },

    setListboxHeight(): void {
      const container = document.getElementById(
        "usedin-container"
      ) as HTMLElement;
      const listHeader = container?.getElementsByClassName(
        "p-listbox-header"
      )[0] as HTMLElement;
      if (container && listHeader) {
        const newHeight =
          container.getBoundingClientRect().height -
          listHeader.getBoundingClientRect().height -
          2;
        this.listHeight = "height: " + newHeight + "px;";
      } else {
        LoggerService.error("Failed to set UsedIn listbox height");
      }
    }
  }
});
</script>

<style scoped>
.usage-mapping-container {
  width: 100%;
}

.mapping-container {
  width: 50%;
}

.usage-container {
  width: 50%;
}
</style>
