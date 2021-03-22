<template>
  <div class="layout-wrapper layout-static">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: 'App'
})
export default class App extends Vue {

}
</script>

<style>

</style>
