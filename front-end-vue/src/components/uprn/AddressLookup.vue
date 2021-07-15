<template>
  <g-map :disableUI="false" :zoom="12" mapType="roadmap" :pin="pin" />
  <div class="uprn-form p-d-flex">
    <InputText
      type="text"
      v-model="value"
      placeholder='Enter address, e.g. "10 Downing St,Westminster,London,SW1A2AA"'
      @keyup.enter="search()"
    />
    <Button class="btn-search" icon="fas fa-search" @click="search()" />
    <Dropdown
      v-model="selectedArea"
      :options="postalAreas"
      optionLabel="display"
      optionValue="value"
      placeholder="Postal Area"
      style="width: 14rem;"
    />
  </div>
  <div class="content" ref="uprn-info" :hidden="!match.Matched">
    <h1 id="firstHeading" class="firstHeading">UPRN : {{ match.UPRN }}</h1>
    <div id="bodyContent">
      <table aria-label="UPRN address lookup results">
        <thead>
          <tr>
            <th scope="col" colspan="2">Address</th>
            <th scope="col" colspan="2">Match - {{ match?.Algorithm }}</th>
          </tr>
        </thead>
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UprnService from "@/services/UprnService";
import LoggerService from "@/services/LoggerService";
import GMap from "@/components/gmap/GMap.vue";

export default defineComponent({
  name: "AddressLookup",
  components: {
    GMap
  },
  data() {
    return {
      value: "10 Downing St,Westminster,London,SW1A2AA",
      pin: { lat: 51.503541, lng: -0.12767 } as {
        lat: number;
        lng: number;
        info: any;
        xCoor: string;
        yCoor: string;
        pointCode: string;
      } | null,
      match: {} as any,
      selectedArea: null as any,
      postalAreas: [
        { value: "", display: "None" },
        { value: "EC", display: "EC district" },
        { value: "WC", display: "WC district" },
        { value: "E", display: "E district" },
        { value: "N", display: "N district" },
        { value: "NW", display: "NW district" },
        { value: "SE", display: "SE district" },
        { value: "SW", display: "SW district" },
        { value: "W", display: "W district" },
        { value: "BR", display: "BR: Bromley" },
        { value: "CR", display: "CR: Croydon" },
        { value: "DA", display: "DA: Dartford" },
        { value: "EN", display: "EN: Enfield" },
        { value: "HA", display: "HA: Harrow" },
        { value: "IG", display: "IG: Ilford" },
        { value: "KT", display: "KT: Kingston" },
        { value: "RM", display: "RM: Romford" },
        { value: "SM", display: "SM: Sutton" },
        { value: "TW", display: "TW: Twickenham" },
        { value: "UB", display: "UB: Uxbridge" },
        { value: "WD", display: "WD: Watford" }
      ]
    };
  },
  methods: {
    async search() {
      this.pin = null;
      console.log("Searching [" + this.value + "]");
      await UprnService.findUprn(this.value, this.selectedArea)
        .then(result => {
          this.match = result.data;
          console.log(result);
          if (this.match.Matched) {
            console.log("Match found");
            this.getUprn();
          } else {
            console.log("No match");
            this.$toast.add(LoggerService.warn("No match found"));
          }
        })
        .catch(error => {
          this.$toast.add(
            LoggerService.error("Error searching address", error)
          );
        });
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
    }
  }
});
</script>

<style scoped>
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

table {
  width: 100%;
}
</style>
