<template>
  <div class="p-d-flex p-flex-column p-ai-center p-jc-center user-container">
    <div class="p-d-flex p-flex-column p-jc-start card-button-container">
      <div class="p-d-flex p-flex-row p-jc-start">
        <Button class="back-button" label="back" icon="pi pi-arrow-circle-left" iconPos="left" v-on:click.prevent="$router.go(-1)" />
        <Button class="home-button" icon="pi pi-home" v-on:click.prevent="$router.push({name: 'Home'})" />
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import store from "@/store/index";

@Options({
  name: "User",
  components: {

  }
})

export default class User extends Vue {

}
</script>

<style scoped>

.user-container {
  height: 100vh;
}

.back-button {
  width: fit-content;
}

.home-button {
  margin-left: 0.25em;
}

</style>
