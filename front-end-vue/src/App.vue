<template>
  <div class="layout-wrapper layout-static">
    <Toast />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "App"
})
export default class App extends Vue {}
</script>

<style>
body {
  overflow: hidden;
}

.popup-user {
  background-color: #3b3e47 !important;
  left: 100px !important;
  bottom: 95px !important;
  top: unset !important;
}

.popup-user ul li a .p-menuitem-icon {
  color: lightgray !important;
}

.popup-user ul li a .p-menuitem-text {
  color: lightgray !important;
}

.avatar-popup {
  width: 25em;
  height: 40vh;
  overflow-y: auto;
}

.avatar-popup div div .p-button {
  margin: 2px;
  border-right: 1px solid #ced4da !important;
}
</style>
