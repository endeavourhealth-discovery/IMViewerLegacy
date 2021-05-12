<template>
  <div class="p-d-flex p-flex-row members-container">
    <div class="included-container">
      <Panel header="Included members">
        <div
          class="p-d-flex p-flex-row p-jc-center"
          v-if="loading.get('members')"
        >
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
        <div
          class="p-d-flex p-flex-row p-jc-center"
          v-if="loading.get('members')"
        >
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
import { mapState } from "vuex";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Members",
  components: {},
  prop: {},
  computed: mapState(["members", "loading", "conceptAggregate"]),
  data() {
    return {
      selectedIncludedMember: {},
      selectedExcludedMember: {}
    };
  },
  methods: {
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
