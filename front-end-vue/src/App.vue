<template>
  <div class="layout-wrapper layout-static">
    <side-nav />
    <div class="layout-main">
      <div class="home">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import SideNav from "@/components/sidenav/SideNav.vue";

@Options({
  name: 'App',
  components: {
    SideNav
  }
})
export default class App extends Vue {

}
</script>

<style>

</style>
