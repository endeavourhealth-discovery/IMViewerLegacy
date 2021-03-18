<template>
  <router-view />
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

<style>

</style>
