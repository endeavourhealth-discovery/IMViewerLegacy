<template>
  <div class="map" ref="mapDivRef"></div>
</template>

<script>
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "GMap",
  props: {
    zoom: Number,
    mapType: String,
    disableUI: Boolean,
    pin: { lat: Number, lng: Number, info: String }
  },
  data() {
    return {
      infowindow: null
    };
  },
  watch: {
    pin(newValue) {
      if (window.marker != null) {
        window.marker.setMap(null);
      }

      if (newValue) {
        let latlong = newValue || { lat: 53.6242957, lng: -1.8826361 };

        this.map.setCenter(latlong);

        window.marker = new window.google.maps.Marker({
          position: latlong,
          map: this.map
        });

        this.infowindow = new window.google.maps.InfoWindow({
          content: newValue.info
        });

        this.infowindow.open(this.map, window.marker);
      }
    }
  },
  setup(props) {
    // the google map object
    const map = ref(null);

    // the map element in the templste
    const mapDivRef = ref(null);

    // load in the google script
    onMounted(() => {
      // key is is the .env file
      const key = process.env.VUE_APP_GOOGLEMAPS_KEY;

      // create the script element to load
      const googleMapScript = document.createElement("SCRIPT");
      googleMapScript.setAttribute(
        "src",
        `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`
      );
      googleMapScript.setAttribute("defer", "");
      googleMapScript.setAttribute("async", "");
      document.head.appendChild(googleMapScript);
    });

    /**
     * this function is called as soon as the map is initialized
     */
    window.initMap = () => {
      map.value = new window.google.maps.Map(mapDivRef.value, {
        mapTypeId: props.mapType || "hybrid",
        zoom: props.zoom || 8,
        disableDefaultUI: props.disableUI || false,
        center: { lat: 53.6242957, lng: -1.8826361 }
      });
    };

    return {
      map,
      mapDivRef
    };
  }
});
</script>

<style lang="css" scoped>
.map {
  width: 100%;
  height: 100%;
  background-color: azure;
}
</style>
