<template>
  <div class="p-d-flex p-flex-row p-ai-center">
    <Card class="p-d-flex p-flex-column p-jc-sm-around p-ai-center user-details-card">
      <template #header>
        <i class="pi pi-fw pi-user" style="fontSize: 50px; margin: 1em;" />
      </template>
      <template #title>
        My Account Details
      </template>
      <template #content>
        <div v-if="isLoggedIn" class="p-fluid p-d-flex p-flex-column p-jc-start user-details-form">
          <div class="p-field">
            <label for="username">Username</label>
            <InputText id="username" type="text" :value="currentUser.username" disabled />
          </div>
          <div class="p-field">
            <label for="firstName">First Name</label>
            <InputText id="firstName" type="text" :value="currentUser.firstName" disabled />
          </div>
          <div class="p-field">
            <label for="lastName">Last Name</label>
            <InputText id="lastName" type="text" :value="currentUser.lastName" disabled />
          </div>
          <div class="p-field">
            <label for="email">Email Address</label>
            <InputText id="email" type="text" :value="currentUser.email" disabled />
          </div>
          <div class="p-d-flex p-flex-row p-jc-center">
            <Button class="user-edit" type="submit" label="Edit" v-on:click.prevent="handleEditClicked"/>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import store from "@/store/index";
import { User } from "@/models/User";

@Options({
  name: "UserDetails",
  components: {

  },
  computed: {
    currentUser(){
      return store.state.currentUser;
    },
    isLoggedIn(){
      return store.state.isLoggedIn;
    }
  }
})

export default class UserDetails extends Vue {
  currentUser!: User;
  isLoggedIn!: boolean;

  handleEditClicked() {
    this.$router.push({name: "UserEdit"})
  }
}
</script>

<style scoped>

.user-edit {
  width: fit-content !important;
}

.user-details-form {
  max-width: 25em;
}

.user-details-card {
  padding: 0 2em;
}

</style>
