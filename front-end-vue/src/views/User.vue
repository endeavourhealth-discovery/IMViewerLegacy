<template>
  <div class="p-d-flex p-flex-column p-ai-center p-jc-start user-container">
    <div class="p-d-flex p-flex-column p-jc-start card-button-container">
      <button-bar />
      <router-view />
    </div>
  </div>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import ButtonBar from "@/components/user/ButtonBar.vue";

@Options({
  name: "User",
  components: {
    ButtonBar: ButtonBar
  }
})
export default class User extends Vue {}
</script>

<style scoped>
.user-container {
  height: 90vh;
  overflow-y: auto;
  margin-top: 10vh;
  /* margin-bottom: 10vh; */
}

.card-button-container {
  height: 100%;
}
</style>
