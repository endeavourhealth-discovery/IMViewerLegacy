<template>
  <div class="p-d-flex p-flex-row p-jc-start">
    <Button
      class="back-button"
      label="back"
      icon="pi pi-arrow-circle-left"
      iconPos="left"
      v-on:click.prevent="$router.go(-1)"
    />
    <Button
      class="home-button"
      icon="pi pi-home"
      v-on:click.prevent="$router.push({ name: 'Home' })"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "ButtonBar"
})
export default class extends Vue {}
</script>

<style scoped>
.back-button {
  width: fit-content;
}

.home-button {
  margin-left: 0.25em;
}
</style>
