<template>
  <div class="p-d-flex p-flex-row p-ai-center">
    <Card
      class="p-d-flex p-flex-column p-jc-sm-around p-ai-center user-details-card"
    >
      <template #header>
        <img
          id="selected-avatar"
          :src="getUrl(currentUser.avatar.value)"
          alt="avatar icon"
        />
      </template>
      <template #title>
        My account details
      </template>
      <template #content>
        <div
          v-if="isLoggedIn"
          class="p-fluid p-d-flex p-flex-column p-jc-start user-details-form"
        >
          <div class="p-field">
            <label for="username">Username</label>
            <InputText
              id="username"
              type="text"
              :value="currentUser.username"
              disabled
            />
          </div>
          <div class="p-field">
            <label for="firstName">First name</label>
            <InputText
              id="firstName"
              type="text"
              :value="currentUser.firstName"
              disabled
            />
          </div>
          <div class="p-field">
            <label for="lastName">Last name</label>
            <InputText
              id="lastName"
              type="text"
              :value="currentUser.lastName"
              disabled
            />
          </div>
          <div class="p-field">
            <label for="email">Email address</label>
            <InputText
              id="email"
              type="text"
              :value="currentUser.email"
              disabled
            />
          </div>
          <div class="p-d-flex p-flex-row p-jc-center">
            <Button
              class="user-edit"
              type="submit"
              label="Edit"
              v-on:click.prevent="handleEditClicked"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapState } from "vuex";
import { User } from "@/models/user/User";

@Options({
  name: "UserDetails",
  components: {},
  computed: mapState(["currentUser", "isLoggedIn"])
})
export default class UserDetails extends Vue {
  currentUser!: User;
  isLoggedIn!: boolean;

  handleEditClicked() {
    this.$router.push({ name: "UserEdit" });
  }

  getUrl(item: string) {
    return require("@/assets/avatars/" + item);
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

#selected-avatar {
  margin-block-start: 1em;
  width: 150px;
  border: 1px solid lightgray;
  border-radius: 50%;
}
</style>
