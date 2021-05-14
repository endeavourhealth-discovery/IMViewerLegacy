<template>
  <div class="p-d-flex p-flex-row members-container">
    <div class="included-container">
      <Panel header="Included members">
        <div class="p-d-flex p-flex-row p-jc-center" v-if="loading">
          <div class="spinner">
            <ProgressSpinner />
          </div>
        </div>
        <Listbox
          v-else
          listStyle="height:300px"
          :filter="true"
          emptyMessage="No results found"
          emptyFilterMessage="No results found"
          v-model="selectedIncludedMember"
          @change="onNodeSelect(selectedIncludedMember)"
          :options="members.included"
          optionLabel="concept.name"
        ></Listbox
      ></Panel>
    </div>
    <div class="excluded-container">
      <Panel header="Excluded members">
        <div class="p-d-flex p-flex-row p-jc-center" v-if="loading">
          <div class="spinner">
            <ProgressSpinner />
          </div>
        </div>
        <Listbox
          v-else
          listStyle="height:300px"
          :filter="true"
          emptyMessage="No results found"
          emptyFilterMessage="No results found"
          v-model="selectedExcludedMember"
          @change="onNodeSelect(selectedExcludedMember)"
          :options="members.excluded"
          optionLabel="concept.name"
        ></Listbox
      ></Panel>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import ConceptService from "@/services/ConceptService";

export default defineComponent({
  name: "Members",
  components: {},
  props: {
    conceptIri: String
  },
  watch: {
    async conceptIri(newValue) {
      await this.getMembers(newValue);
    }
  },
  data() {
    return {
      loading: false,
      members: [],
      selectedIncludedMember: {},
      selectedExcludedMember: {}
    };
  },
  methods: {
    async getMembers(iri: string) {
      this.loading = true;
      this.members = (await ConceptService.getConceptMembers(iri, false)).data;
      this.loading = false;
    },
    onNodeSelect(member: any) {
      this.$router.push({
        name: "Concept",
        params: { selectedIri: member.concept["@id"] }
      });
    },

    toggle(event: any) {
      const x = this.$refs.menu as any;
      x.toggle(event);
    }
  }
});
</script>

<style scoped>
.p-panel-header {
  all: unset;
}
.members-container {
  width: 100%;
}
.included-container {
  width: 50%;
}
.excluded-container {
  width: 50%;
}
</style>
