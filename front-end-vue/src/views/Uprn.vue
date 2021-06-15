<template>
  <side-nav />
  <div class="layout-main">
    <div class="home">
      <TabView>
        <TabPanel header="Single address lookup">
          <g-map :disableUI="false" :zoom="12" mapType="roadmap" :pin="pin" />
          <div class="uprn-form p-d-flex">
            <InputText
              type="text"
              v-model="value"
              placeholder='Enter address, e.g. "10 Downing St,Westminster,London,SW1A2AA"'
              @keyup.enter="search()"
            />
            <Button class="btn-search" icon="fas fa-search" @click="search()" />
          </div>

          <div class="content" ref="uprn-info" :hidden="!match.Matched">
            <h1 id="firstHeading" class="firstHeading">
              UPRN : {{ match.UPRN }}
            </h1>
            <div id="bodyContent">
              <table>
                <thead></thead>
                <tr>
                  <th colspan="2">Address</th>
                  <th colspan="2">Match</th>
                </tr>
                <tbody>
                  <tr>
                    <td>Number</td>
                    <td>{{ match?.ABPAddress?.Number }}</td>
                    <td>Number</td>
                    <td>{{ match?.Match_pattern?.Number }}</td>
                  </tr>
                  <tr>
                    <td>Street</td>
                    <td>{{ match?.ABPAddress?.Street }}</td>
                    <td>Building</td>
                    <td>{{ match?.Match_pattern?.Building }}</td>
                  </tr>
                  <tr>
                    <td>Town</td>
                    <td>{{ match?.ABPAddress?.Town }}</td>
                    <td>Street</td>
                    <td>{{ match?.Match_pattern?.Street }}</td>
                  </tr>
                  <tr>
                    <td>PostCode</td>
                    <td>{{ match?.ABPAddress?.Postcode }}</td>
                    <td>PostCode</td>
                    <td>{{ match?.Match_pattern?.Postcode }}</td>
                  </tr>
                  <tr>
                    <td>Class</td>
                    <td>
                      {{ match?.Classification }} - {{ match?.ClassTerm }}
                    </td>
                    <td>Qualifier</td>
                    <td>{{ match?.Qualifier }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Address file workflow">
          <div class = "card" >
            <div class="card">
              <FileUpload name="demo[]" mode="basic" :customUpload="true" @uploader="onUpload" accept="text/plain" :maxFileSize="1000000">
                <template #empty>
                  <p>Drag and drop files to here to upload.</p>
                </template>
              </FileUpload>
              <button class="p-button p-component p-button-outlined p-button-secondary p-mt-5" @click="refreshActivity">Refresh Table</button>
            </div>
            <div>
              <DataTable :value="activity" responsiveLayout="scroll" showGridlines style="height: 200px">
                <Column field="DT" header="Time"></Column>
                <Column field="A" header="Status"></Column>
                <Column field="F" header="Action" >
                  <template #body ="slotProps">
                    <button v-if="slotProps.data.F" type="button" @click="download(slotProps.data.F)" class="p-button button-download pi pi-download"></button>
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import GMap from "@/components/gmap/GMap.vue";
import UprnService from "@/services/UprnService";


export default defineComponent({
  name: "Uprn",
  components: {
    SideNav,
    GMap
  },
  data() {
    return {
      value: "10 Downing St,Westminster,London,SW1A2AA",
      pin: null as any,
      activity: [],
      match: {} as any
    };
  },
  mounted() {
    this.refreshActivity();
  },
  methods: {
    async search() {
      this.pin = null;
      console.log("Searching [" + this.value + "]");
      this.match = (await UprnService.findUprn(this.value)).data;
      if (this.match.Matched) {
        const uprn = (await UprnService.getUprn(this.match.UPRN)).data;
        this.pin = {
          lat: +uprn.Latitude,
          lng: +uprn.Longitude,
          info: this.$refs["uprn-info"]
        };
      }
    },
    async refreshActivity(){
      this.activity = (await  (UprnService.getActivity())).data;
    },
    async download(filename : string){
      await UprnService.download(filename).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      });
    },
    async onUpload(){
      console.log("upload");
    }
  }
});
</script>

<style>
.home {
  height: 100%;
}
.p-tabview {
  height: 100%;
}
.p-tabview-panels {
  height: calc(100% - 3rem);
}

.map {
  width: 100%;
  height: calc(100vh - 7rem) !important;
  background-color: azure;
}

.uprn-form {
  z-index: 10;
  position: absolute;
  top: 6rem;
  left: 23rem;
  width: calc(100% - 38rem);
}

.uprn-form .p-inputtext {
  width: 100%;
}

.btn-search {
  background-color: white !important;
  color: gray !important;
  border-color: lightgray !important;
}

table td,
table td * {
  vertical-align: top;
}

table {
  width: 100%;
}
</style>
