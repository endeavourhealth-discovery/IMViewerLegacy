<template>
  <div class="p-d-flex p-flex-row p-ai-center">
    <Card class="p-d-flex p-flex-column p-jc-sm-around p-ai-center logout-card">
      <template #header>
        <i
          class="pi pi-fw pi-unlock"
          style="fontSize: 50px; margin-top: 1em;"
        />
      </template>
      <template #title>
        Logout
      </template>
      <template #content>
        <div class="p-fluid logout-form">
          <div class="p-field">
            <div class="p-text-left">Current User:</div>
          </div>
          <div class="p-field">
            <div
              v-if="isLoggedIn"
              class="p-d-flex p-flex-column p-ai-center p-text-capitalize"
            >
              <img
                v-if="isLoggedIn"
                id="user-icon"
                class="avatar-icon"
                :src="getUrl(currentUser.avatar.value)"
                alt="avatar icon"
                @click="toggle"
                aria-haspopup="true"
                aria-controls="overlay_menu"
              />
              <br />
              <p id="username-display">{{ currentUser.username }}</p>
            </div>
            <div v-if="!isLoggedIn" class="p-text-left p-text-capitalize">
              Guest
            </div>
          </div>
          <div class="p-d-flex p-flex-row p-jc-center">
            <Button
              class="user-submit"
              type="submit"
              label="Logout"
              v-on:click.prevent="handleSubmit"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import store from "@/store/index";
import { mapState } from "vuex";
import Swal from "sweetalert2";

@Options({
  name: "Logout",
  computed: mapState(["currentUser", "isLoggedIn"])
})
export default class Logout extends Vue {
  handleSubmit() {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "Confirm logout request",
      showCancelButton: true,
      confirmButtonText: "Logout"
    }).then(result => {
      if (result.isConfirmed) {
        store.dispatch("logoutCurrentUser").then(res => {
          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: res.message
            }).then(() => {
              this.$router.push({ name: "Home" });
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: res.message
            });
          }
        });
      }
    });
  }

  getUrl(item: string) {
    return require("@/assets/avatars/" + item);
  }
}
</script>

<style scoped>
.user-submit {
  width: fit-content !important;
}

.logout-form {
  max-width: 25em;
  min-width: 15em;
}

.logout-card {
  padding: 0 2em;
}

.avatar-icon {
  width: 60px;
  border: 1px solid lightgray;
  border-radius: 50%;
}
</style>
