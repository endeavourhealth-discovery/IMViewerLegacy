<template>
  <div class="p-d-flex p-flex-row members-container">
    <div class="included-container">
      <Panel header="Included Members" :toggleable="true">
        <template #icons>
          <button class="p-panel-header-icon p-link p-mr-2" @click="toggle">
            <span class="pi pi-cog"></span>
          </button>
          <Menu id="config_menu" ref="menu" :model="items" :popup="true" />
        </template>
        <div
          class="p-d-flex p-flex-row p-jc-center"
          v-if="$store.state.loading.get('members')"
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
          :options="$store.state.members.included"
          optionLabel="concept.name"
        ></Listbox
      ></Panel>
    </div>
    <div class="excluded-container">
      <Panel header="Excluded Members" :toggleable="true">
        <div
          class="p-d-flex p-flex-row p-jc-center"
          v-if="$store.state.loading.get('members')"
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
          :options="$store.state.members.excluded"
          optionLabel="concept.name"
        ></Listbox
      ></Panel>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ConceptService from "@/services/ConceptService";
import store from "@/store";
import LoggerService from "@/services/LoggerService";

@Options({
  name: "ConceptMembers",
  components: {},
  prop: {}
})
export default class ConceptMembers extends Vue {
  selectedIncludedMember: {} = {};
  selectedExcludedMember: {} = {};

  items = [
    {
      label: "Members",
      items: [
        {
          label: "Download JSON",
          icon: "pi pi-download",
          command: () => {
            this.downloadMembers("application/json", false);
          }
        },
        {
          label: "Download CSV",
          icon: "pi pi-download",
          command: () => {
            this.downloadMembers("text/csv", false);
          }
        }
      ]
    },
    {
      label: "Expanded",
      items: [
        {
          label: "Download JSON",
          icon: "pi pi-download",
          command: () => {
            this.downloadMembers("application/json", true);
          }
        },
        {
          label: "Download CSV",
          icon: "pi pi-download",
          command: () => {
            this.downloadMembers("text/csv", true);
          }
        }
      ]
    }
  ];

  onNodeSelect(member: any) {
    this.$router.push({
      name: "Concept",
      params: { selectedIri: member.concept.iri }
    });
  }

  toggle(event: any) {
    const x = this.$refs.menu as any;
    x.toggle(event);
  }

  downloadMembers(type: string, expanded: boolean) {
    const concept = store.state.conceptAggregate.concept;
    const filename =
      concept["http://www.w3.org/2000/01/rdf-schema#label"] +
      ("text/csv" === type ? ".csv" : ".json");
    ConceptService.getConceptMembers(concept["@id"], false)
      .then(response => {
        this.downloadFile(response.data, filename, type);
      })
      .catch(err => {
        this.$toast.add(
          LoggerService.error("Concept member server request failed", err)
        );
      });
  }

  downloadFile(data: any, filename: string, type: string) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    // this.busy = false;
  }
}
</script>

<style scoped>
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
