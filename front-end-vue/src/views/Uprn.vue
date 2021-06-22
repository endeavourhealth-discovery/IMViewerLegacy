<template>
  <side-nav/>
  <div class="layout-main">
    <div class="home">
      <TabView>
        <TabPanel header="Single address lookup">
          <g-map :disableUI="false" :zoom="12" mapType="roadmap" :pin="pin"/>
          <div class="uprn-form p-d-flex">
            <InputText
                type="text"
                v-model="value"
                placeholder='Enter address, e.g. "10 Downing St,Westminster,London,SW1A2AA"'
                @keyup.enter="search()"
            />
            <Button class="btn-search" icon="fas fa-search" @click="search()"/>
            <Dropdown v-model="selectedArea"
                      :options="postalAreas"
                      optionLabel="display"
                      optionValue="value"
                      placeholder="Postal Area"
                      style="width: 14rem;"
            />

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
                  <th colspan="2">Match - {{ match?.Algorithm }}</th>
                </tr>
                <tbody>
                <tr>
                  <td>Number</td>
                  <td>{{ match?.ABPAddress?.Number }}</td>
                  <td>Number</td>
                  <td>{{ match?.Match_pattern?.Number }}</td>
                </tr>
                <tr>
                  <td>Flat</td>
                  <td>{{ match?.ABPAddress?.Flat }}</td>
                  <td>Flat</td>
                  <td>{{ match?.Match_pattern?.Flat }}</td>
                </tr>
                <tr>
                  <td>Building</td>
                  <td>{{ match?.ABPAddress?.Building }}</td>
                  <td>Building</td>
                  <td>{{ match?.Match_pattern?.Building }}</td>
                </tr>
                <tr>
                  <td>Post code</td>
                  <td>{{ match?.ABPAddress?.Postcode }}</td>
                  <td>Post code</td>
                  <td>{{ match?.Match_pattern?.Postcode }}</td>
                </tr>
                <tr>
                  <td>Organisation</td>
                  <td>{{ match?.ABPAddress?.Organisaton }}</td>
                  <td>Latitude</td>
                  <td>{{ pin?.lat }}</td>
                </tr>
                <tr>
                  <td>Street</td>
                  <td>{{ match?.ABPAddress?.Street }}</td>
                  <td>Longitude</td>
                  <td>{{ pin?.lng }}</td>
                </tr>
                <tr>
                  <td>Town</td>
                  <td>{{ match?.ABPAddress?.Town }}</td>
                  <td>X Coordinate</td>
                  <td>{{ pin?.xCoor }}</td>
                </tr>
                <tr>
                  <td>Class</td>
                  <td>{{ match?.Classification }} - {{ match?.ClassTerm }}</td>
                  <td>Y Coordinate</td>
                  <td>{{ pin?.yCoor }}</td>
                </tr>
                <tr>
                  <td>Qualifier</td>
                  <td>{{ match?.Qualifier }}</td>
                  <td>Point code</td>
                  <td>{{ pin?.pointCode }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Address file workflow" class="p-scrollpanel-bar">
          <ScrollPanel class="scroll-panel" >
            <div class="card">
              <div class="p-grid">
                <div class="p-lg-4 p-md-12 p-sm-12">
                  <FileUpload ref="fileUpload"
                              name="demo[]"
                              :customUpload="true"
                              @uploader="onUpload"
                              @clear="clearUpload"
                              preview-width="0"
                              @remove="clearUpload"
                              accept="text/plain"
                              chooseLabel="Select"
                              :fileLimit="1"
                              :maxFileSize="1000000"
                              @paste="onPaste"
                  >
                    <template #empty>
                      <p>Drag and drop files here to upload.</p>
                    </template>
                  </FileUpload>
                </div>
                <div class="p-lg-4 p-md-12 p-sm-12" style="font-size: small;">
                  <p class="p-text-bold">File format description:</p>
                  <p>The address file to be uploaded must contain two columns separated by a single tab character with a
                    .txt extension</p>
                  <p>The first line must not contain any header information</p>
                  <p>The first column is a unique numeric row id</p>
                  <p>The second column is an address string including a postcode at the end with a comma separating the
                    address from the postcode</p>
                  <p>The third column is the postal region (not mandatory, but useful when you don't know the address
                    candidates postcode)</p>
                </div>
                <div class="p-lg-4 p-md-12 p-sm-12" style="font-size: small">
                  <p class="p-text-bold">Example records:</p>
                  <p>1[tab]10 Downing St,Westminster,London,SW1A2AA</p>
                  <p>2[tab]10 Downing St,Westminster,London[tab]SW</p>
                  <p>3[tab]Bridge Street,London,SW1A 2LW</p>
                  <p>4[tab]221b Baker St,Marylebone,London,NW1 6XE</p>
                  <p>5[tab]3 Abbey Rd,St John's Wood,London,NW8 9AY</p>
                </div>

              </div>
              <Button label="Refresh table" icon="fa fa-fw fa-redo" @click="refreshActivity"
                      style="margin: 2rem 0 1rem 0"/>
              <DataTable :value="activity" responsiveLayout="scroll" showGridlines id="activity" :scrollable="true"
                         scrollHeight="flex"
              >
                <Column field="DT" header="Time"></Column>
                <Column field="A" header="Status"></Column>
                <Column field="F" header="Action">
                  <template #body="slotProps">
                    <button v-if="slotProps.data.F" type="button" @click="download(slotProps.data.F)"
                            class="p-button button-download pi pi-download"/>
                  </template>
                </Column>
              </DataTable>
            </div>
          </ScrollPanel>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SideNav from "@/components/home/SideNav.vue";
import GMap from "@/components/gmap/GMap.vue";
import UprnService from "@/services/UprnService";
import LoggerService from "@/services/LoggerService";

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
      match: {} as any,
      selectedArea: null as any,
      postalAreas: [
        {value: '', display: 'None'}, {value: 'EC', display: 'EC district'}, {
          value: 'WC',
          display: 'WC district'
        }, {value: 'E', display: 'E district'}, {value: 'N', display: 'N district'}, {
          value: 'NW',
          display: 'NW district'
        },
        {value: 'SE', display: 'SE district'}, {value: 'SW', display: 'SW district'}, {
          value: 'W',
          display: 'W district'
        }, {value: 'BR', display: 'BR: Bromley'}, {value: 'CR', display: 'CR: Croydon'},
        {value: 'DA', display: 'DA: Dartford'}, {value: 'EN', display: 'EN: Enfield'}, {
          value: 'HA',
          display: 'HA: Harrow'
        }, {value: 'IG', display: 'IG: Ilford'}, {value: 'KT', display: 'KT: Kingston'},
        {value: 'RM', display: 'RM: Romford'}, {value: 'SM', display: 'SM: Sutton'}, {
          value: 'TW',
          display: 'TW: Twickenham'
        }, {value: 'UB', display: 'UB: Uxbridge'}, {value: 'WD', display: 'WD: Watford'}
      ]
    };
  },
  mounted() {
    this.refreshActivity();
  },
  methods: {
    async search() {
      this.pin = null;
      console.log("Searching [" + this.value + "]");
      (await UprnService.findUprn(this.value, this.selectedArea).then(
          result => {
            this.match = result.data;
            console.log(result)
            if (this.match.Matched) {
              console.log("Match found")
              this.getUprn();
            } else {
              console.log("No match")
              this.$toast.add(
                  LoggerService.warn("No match found"))
            }
          }
      ).catch(
          error => {
            this.$toast.add(LoggerService.error("Error searching address", error))
          }
      ));
    },
    async getUprn() {
      const uprn = (await UprnService.getUprn(this.match.UPRN)).data;
      this.pin = {
        lat: +uprn.Latitude,
        lng: +uprn.Longitude,
        xCoor: uprn.XCoordinate,
        yCoor: uprn.YCoordinate,
        pointCode: uprn.Pointcode,
        info: this.$refs["uprn-info"]
      };
    },
    async refreshActivity() {
      this.activity = (await UprnService.getActivity()).data;
    },
    async download(filename: string) {
      await UprnService.download(filename).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      });
    },
    async onUpload(event: any) {
      console.log(event.files[0])
      await UprnService.upload(event.files[0]).then(
          response => {
            this.$toast.add(LoggerService.success("fileUploaded"));
            this.refreshActivity()
          }
      ).catch(
          error => {
            this.$toast.add(LoggerService.error("errorUploading", error))
          }
      );
      console.log("upload" + event.files[0].name);
    },
    async clearUpload() {
      const x = this.$refs.fileUpload as any;
      x.uploadedFileCount = 0;
      console.log("Clear upload")
    },
    async onPaste(event: any) {
      // console.log(event.clipboardData.items[0]);
      const x = this.$refs.fileUpload as any;
      x.files.push(event.clipboardData.files[0]);
      console.log(event.clipboardData.files[0]);
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
  width: calc(100% - 30rem);
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

#activity {
  height: calc(100vh - 32rem);
  overflow-y: auto;
}

table {
  width: 100%;
}

.file-upload-instructions-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  gap: 7px;
}

.p-fileupload-row div:first-of-type {
  display: none;
}
.scroll-panel{
  width: 100%;
  height: calc(100vh - 10rem);
  overflow-y: auto;
}

</style>


