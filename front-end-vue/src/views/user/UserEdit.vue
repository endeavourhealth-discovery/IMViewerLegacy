<template>
  <div v-if="user" class="p-d-flex p-flex-row p-ai-center">
  <Card class="p-d-flex p-flex-column p-jc-sm-around p-ai-center user-details-card">
    <template #header>
      <i class="pi pi-fw pi-user" style="fontSize: 50px; margin: 1em;" />
    </template>
    <template #title>
      My Account Details
    </template>
    <template #content>
      <div class="p-fluid p-d-flex p-flex-column p-jc-start">
        <div class="p-field">
          <label for="firstName">First Name</label>
          <InputText id="firstName" type="text" :placeholder="user.firstName" v-model="firstName" />
        </div>
        <div class="p-field">
          <label for="lastName">Last Name</label>
          <InputText id="lastName" type="text" :placeholder="user.lastName" v-model="lastName" />
        </div>
        <div class="p-field">
          <label for="email">Email Address</label>
          <InputText id="email" type="text" :placeholder="user.email" v-model="email" />
        </div>
        <div v-if="!showPasswordEdit" class="p-d-flex p-flex-row p-jc-center p-field">
          <Button class="password-edit p-button-secondary" type="submit" label="Change Password" v-on:click.prevent="editPasswordClicked(true)" />
        </div>
        <div v-if="showPasswordEdit" class="p-field">
          <label for="passwordOld">Current Password</label>
          <InputText id="passwordOld" type="password" v-model="passwordOld" />
        </div>
        <div v-if="showPasswordEdit" class="p-field">
          <label for="passwordNew1">New Password</label>
          <InputText id="passwordNew1" type="password" v-model="passwordNew1" />
          <InlineMessage v-if="passwordStrength === 'strong'" severity="success">Password Strength: Strong</InlineMessage>
          <InlineMessage v-if="passwordStrength === 'medium'" severity="success">Password Strength: Medium</InlineMessage>
          <InlineMessage v-if="passwordStrength === 'weak'" severity="warn">Password Strength: Weak</InlineMessage>
          <InlineMessage v-if="passwordStrength === 'fail' && password1 !== ''" severity="error">Invalid Password</InlineMessage>
        </div>
        <div v-if="showPasswordEdit" class="p-field">
          <label for="passwordNew2">Confirm New Password</label>
          <InputText id="passwordNew2" type="password" v-model="passwordNew2" />
        </div>
        <div v-if="showPasswordEdit" class="p-d-flex p-flex-row p-jc-center p-field">
          <Button class="password-edit p-button-secondary" type="submit" label="Cancel Password Edit" v-on:click.prevent="editPasswordClicked(false)" />
        </div>
        <div class="p-d-flex p-flex-row p-jc-center">
          <Button class="user-edit" type="submit" label="Update" v-on:click.prevent="handleEditSubmit"/>
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
import Swal from 'sweetalert2';

@Options({
  name: "UserEdit",
  components: {

  },
  computed: {
    user(){
      return store.state.user;
    }
  }
})

export default class UserEdit extends Vue {
  user!: User;
  firstName = this.user.firstName;
  lastName = this.user.lastName;
  email = this.user.email;
  passwordOld = "";
  passwordNew1 = "";
  passwordNew2 = "";
  showPasswordEdit = false;
  passwordsMatch = false;

  editPasswordClicked(result: boolean) {
    if (result === false){
      this.passwordOld = "";
      this.passwordNew1 = "";
      this.passwordNew2 = "";
    }
    this.showPasswordEdit = result;
  }

  handleEditSubmit(){
    if (this.showPasswordEdit && (this.passwordNew1 === this.passwordNew2)) {//add old password verification
      const updatedUser = new User(this.firstName, this.lastName, this.email, this.passwordNew1);
      // user Service call here
    } else if (this.showPasswordEdit){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Error, incorrect password"
      })
    }
  }

}
</script>

<style scoped>

.user-edit, .password-edit, .password-edit {
  width: fit-content !important;

}

</style>
