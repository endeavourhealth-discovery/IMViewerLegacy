<template>
  <div class="p-d-flex p-flex-row members-container">
    <div class="included-container">
      <Panel header="Included members">
        <template #icons>
          <button class="p-panel-header-icon p-link p-mr-2" @click="toggle">
            <span class="pi pi-cog"></span>
          </button>
          <Menu id="config_menu" ref="menu" :model="items" :popup="true" />
        </template>
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
import { Options, Vue } from "vue-class-component";
import ConceptService from "@/services/ConceptService";
import LoggerService from "@/services/LoggerService";
import { mapState } from "vuex";
import { ConceptAggregate } from "@/models/TTConcept/ConceptAggregate";
import { RDFS } from "@/vocabulary/RDFS";
import { IM } from "@/vocabulary/IM";

@Options({
  name: "ConceptMembers",
  components: {},
  prop: {},
  computed: mapState(["members", "loading", "conceptAggregate"])
})
export default class Members extends Vue {
  conceptAggregate!: ConceptAggregate;
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

  mounted() {
    console.log("mounted members");
  }

  onNodeSelect(member: any) {
    this.$router.push({
      name: "Concept",
      params: { selectedIri: member.concept["@id"] }
    });
  }

  toggle(event: any) {
    const x = this.$refs.menu as any;
    x.toggle(event);
  }

  downloadMembers(type: string, expanded: boolean) {
    const concept = this.conceptAggregate.concept;
    const filename =
      concept[RDFS.LABEL] + ("text/csv" === type ? ".csv" : ".json");
    ConceptService.getConceptMembers(concept[IM.IRI], expanded)
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
