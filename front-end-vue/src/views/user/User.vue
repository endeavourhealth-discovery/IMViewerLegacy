<template>
  <div class="p-d-flex p-flex-row p-jc-center">
      <router-view />
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

</style>
