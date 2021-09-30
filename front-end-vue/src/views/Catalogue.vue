<template>
  <side-nav />
  <div class="layout-main">
    <div class="home">
      <div class="p-grid">
        <div class="p-col-3">
          <Card style="margin-bottom: 0.5em">
            <template #content>
              <p style="margin-bottom: 1em; font-size: 14px">Select Type</p>
              <MultiSelect
                id="type"
                v-model="selectedType"
                :options="types"
                optionLabel="label"
                placeholder="Select"
                display="chip"
                style="width: 100%"
                class="p-inputtext-lg"
                @change="setIris()"
              />
            </template>
          </Card>
          <span class="p-input-icon-left" id="search-bar" style="margin-bottom: 0.2em">
            <i class="pi pi-search" aria-hidden="true" />
            <InputText
              type="text"
              v-model="searchRequest"
              @keydown="checkKey($event)"
              placeholder="Search"
              class="p-inputtext-lg search-input"
              autoWidth="false"
            />
          </span>
          <TabView v-model:activeIndex="active">
            <TabPanel>
              <template #header>
                <i
                  style="padding: 1px"
                  class="fas fa-search icon-header"
                  aria-hidden="true"
                />
                <span>Search Results</span>
              </template>
              <Listbox
                v-model="selected"
                :options="searchResults"
                @click="setSelectedInstance()"
                :virtualScrollerOptions="{ itemSize: 31 }"
                style="width:100%"
                listStyle="height:550px"
              >
                <template #option="slotProps">
                  <div v-if="slotProps.option.name">
                    <span>{{ slotProps.option.name }}</span>
                  </div>
                  <div v-else>
                    <span>{{ slotProps.option["@id"] }}</span>
                  </div>
                </template>
              </Listbox>
            </TabPanel>
            <TabPanel>
              <template #header>
                <i class="fas fa-history icon-header" aria-hidden="true" />
                <span>History</span>
              </template>
              <Listbox
                v-model="selected"
                :options="history"
                class="history-listbox"
                @click="setSelectedInstance()"
                :virtualScrollerOptions="{ itemSize: 31 }"
                style="width:100%"
                listStyle="height:700px"
              >
                <template #option="slotProps">
                  <div v-if="slotProps.option.name">
                    <span>{{ slotProps.option.name }}</span>
                  </div>
                  <div v-else>
                    <span>{{ slotProps.option["@id"] }}</span>
                  </div>
                </template>
              </Listbox>
            </TabPanel>
          </TabView>
        </div>
        <div
          class="p-col-9"
          style="height: 100%"
        >
          <div v-if="this.dash">
            <CatalogueDashboard v-if="types.length" :types="types" />
          </div>
          <div v-else>
            <Panel>
              <template #header v-if="instanceName"> {{ instanceName }}</template>
              <template #header v-else> {{ instanceIri }}</template>
              <Tree :value="instanceData">
                <template #default="slotProps">
                  {{slotProps.node.label }} {{ slotProps.node.data}}
                </template>
                <template #address="slotProps">
                  {{slotProps.node.label}}
                  <a href="#/catalogue" @click="navigate(slotProps.node.data)">{{slotProps.node.data["@id"]}}</a>
                </template>
              </Tree>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import CatalogueService from "@/services/CatalogueService";
import CatalogueDashboard from "@/components/catalogue/CatalogueDashboard.vue";

export default defineComponent({
  name: "Catalogue",
  components: {
    CatalogueDashboard,
    SideNav
  },
  data() {
    return {
      searchRequest: "",
      searchResults: [] as any,
      instanceIri: "" ,
      instanceName: "",
      instance: [] as any,
      predicate: [] as string[],
      active: 0,
      currentSelected: "",
      history: [] as any,
      selectedHistory: "",
      instanceData: [] as any,
      selected: {} as any,
      location: "",
      types: [] as any,
      selectedType: [] as any,
      typesIris: ["http://endhealth.info/im#Organisation"] as string[],
      dash: true
    };
  },
  async mounted() {
    await this.getTypesCount();
  },
  methods: {
    async getTypesCount() {
      await CatalogueService.getTypesCount().then(res => {
        this.types = res.data;
      }).catch(error => console.log(error));
    },
    async getSearchResult() {
      await CatalogueService.getSearchResult(this.searchRequest,this.typesIris).then(res => {
        this.searchResults = res.data;
      });
    },
    setIris() {
      this.typesIris = [];
      this.selectedType.forEach((type: any) => {
        this.typesIris.push(type.iri);
      });
    },
    checkKey(event: any) {
      if (event.code === "Enter") {
        this.getSearchResult();
      }
    },
    setSelectedInstance() {
      if (this.selected == null) {
        this.selected = this.currentSelected;
      }
      this.instanceIri = this.selected["@id"];
      this.instanceName = this.selected.name;
      if(this.instanceIri){
        this.displayInstance();
      }
      this.currentSelected = this.selected;
    },
    displayInstance() {
      this.dash = false;
      this.getPartialInstance();
      if (
        !this.history.some(
          (instance: any) => instance["@id"] === this.instanceIri
        )
      ) {
        this.history.push({
          "@id": this.instanceIri,
          name: this.instanceName
        });
      }
    },
    async getPartialInstance() {
      window.history.pushState("", "", "/individual/" + this.instanceIri);
      // console.log(document.location.href);
      await CatalogueService.getPartialInstance(
        this.instanceIri,
        this.predicate
      ).then(res => {
        this.instance = res.data;
      });
      this.instanceData = [];
      let level = 0;
      Object.keys(this.instance.entity).forEach((predicate: any) => {
        if (predicate === "@id") {
          this.instanceData.push({
            key: level,
            label: this.instance.entity[predicate],
            children: []
          });
        } else if (predicate === "http://endhealth.info/im#address") {
          this.instanceData.push({
            key: level,
            label: this.getPredicateName(predicate) + " : ",
            data: this.instance.entity[predicate],
            type: "address",
            children: []
          });
        } else {
          if (Array.isArray(this.instance.entity[predicate])) {
            this.instanceData.push({
              key: level,
              label: this.getPredicateName(predicate) + " : ",
              children: this.getChildren(predicate)
            });
          } else if (typeof this.instance.entity[predicate] === "object") {
            this.instanceData.push({
              key: level,
              label: this.getPredicateName(predicate) + " : ",
              data: this.instance.entity[predicate].name
                ? this.instance.entity[predicate].name
                : this.instance.entity[predicate]["@id"],
              children: []
            });
          } else {
            this.instanceData.push({
              key: level,
              label: this.getPredicateName(predicate) + " : ",
              data: this.instance.entity[predicate],
              children: []
            });
          }
        }
        level = level + 1;
      });
    },
    navigate(instance: any) {
      this.instanceIri = instance["@id"];
      this.instanceName = instance.name ? instance.name : instance["@id"];
      // console.log(this.instanceIri);
      this.displayInstance();
    },
    getPredicateName(iri: string) {
      let name = "";
      this.instance.predicates.forEach((pre: any) => {
        if (pre["@id"] === iri) {
          name = pre.name ? pre.name : pre["@id"];
        }
      });
      return name;
    },
    getChildren(predicate: string) {
      console.log("?");
    }
  }
});
</script>
<style scoped>
#search-bar {
  width: 100%;
}
.search-input {
  width: 100%;
}
</style>
