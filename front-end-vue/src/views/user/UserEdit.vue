<template>
  <div v-if="user" class="p-d-flex p-flex-row p-ai-center">
  <Card class="p-d-flex p-flex-column p-jc-sm-around p-ai-center user-details-card">
    <template #header>
      <i class="pi pi-fw pi-user-edit" style="fontSize: 50px; margin: 1em;" />
    </template>
    <template #title>
      Edit My Account
    </template>
    <template #content>
      <div class="p-fluid p-d-flex p-flex-column p-jc-start user-edit-form">
        <div class="p-field">
          <label for="firstName">First Name</label>
          <InputText id="firstName" type="text" :placeholder="user.firstName" v-model="firstName" />
        </div>
        <div class="p-field">
          <label for="lastName">Last Name</label>
          <InputText id="lastName" type="text" :placeholder="user.lastName" v-model="lastName" />
        </div>
        <div class="p-field">
          <label for="email1">Email Address</label>
          <div class="p-d-flex p-flex-row p-ai-center">
            <InputText id="email1" type="text" :placeholder="user.email" v-model="email1" v-on:focus="setShowEmail1Notice(true)" v-on:blur="setShowEmail1Notice(false)"/>
            <i v-if="showEmail1Notice && email1Verified" class="pi pi-check-circle" style="color: #439446; fontSize: 2em" />
            <i v-if="showEmail1Notice && !email1Verified" class="pi pi-times-circle" style="color: #e60017; fontSize: 2em" />
          </div>
        </div>
        <div class="p-field">
          <label for="email2">Confirm Email Address</label>
          <InputText id="email2" type="text" :placeholder="user.email" v-model="email2" v-on:blur="setShowEmail2Notice()" />
          <InlineMessage v-if="showEmail2Notice" severity="error">Email addresses do not match!</InlineMessage>
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
          <InlineMessage v-if="passwordStrength === 'fail' && passwordNew1 !== ''" severity="error">Invalid Password</InlineMessage>
          <small id="password-help">Password min length 6 characters. Improve password strength with a mixture of UPPERCASE, lowercase, numbers and special characters [!@#$%^&*].</small>
        </div>
        <div v-if="showPasswordEdit" class="p-field">
          <label for="passwordNew2">Confirm New Password</label>
          <InputText id="passwordNew2" type="password" v-model="passwordNew2" v-on:blur="setShowPassword2Notice" />
          <InlineMessage v-if="showPassword2Notice" severity="error">New passwords do not match!</InlineMessage>
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
import { verifyIsEmail, verifyPasswordsMatch, verifyEmailsMatch, verifyIsName, checkPasswordStrength } from "@/helpers/UserMethods";
import { PasswordStrength } from "@/models/PasswordStrength";

@Options({
  name: "UserEdit",
  components: {

  },
  computed: {
    user(){
      return store.state.user;
    }
  },
  watch: {
    email1: {
      immediate: true,
      handler(newValue, oldValue){
        this.email1Verified = verifyIsEmail(newValue);
      }
    },
    email2: {
      immediate: true,
      handler(newValue, oldValue){
        this.emailsMatch = verifyEmailsMatch(this.email1, this.email2);
      }
    },
    passwordNew1: {
      immediate: true,
      handler(newValue, oldValue){
        this.passwordStrength = checkPasswordStrength(newValue);
      }
    },
    passwordNew2: {
      immediate: true,
      handler(newValue, oldValue){
        this.passwordsMatch = verifyPasswordsMatch(this.passwordNew1, this.passwordNew2);
      }
    },
  }
})

export default class UserEdit extends Vue {
  user!: User;
  firstName = "";
  lastName = "";
  email1 = "";
  email2 = "";
  email1Verified = false;
  emailsMatch = false;
  showEmail1Notice = false;
  showEmail2Notice = false;
  passwordOld = "";
  passwordNew1 = "";
  passwordNew2 = "";
  passwordStrength: PasswordStrength = PasswordStrength.fail;
  showPasswordEdit = false;
  passwordsMatch = false;
  showPassword2Notice = false;

  mounted() {
    if (this.user.firstName){//remove this later!!!!!!!!
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
      this.email1 = this.user.email;
      this.email2 = this.user.email;
    }
  }

  // password1Changed(){
  //   this.passwordStrength = checkPasswordStrength(this.passwordNew1);
  // }

  // password2Changed(){
  //   this.passwordsMatch = verifyPasswordsMatch(this.passwordNew1, this.passwordNew2);
  // }

  // email1Changed(){
  //   this.email1Verified = verifyIsEmail(this.email1);
  // }

  // email2Changed(){
  //   this.emailsMatch = verifyEmailsMatch(this.email1, this.email2);
  // }

  editPasswordClicked(result: boolean) {
    if (result === false){
      this.passwordOld = "";
      this.passwordNew1 = "";
      this.passwordNew2 = "";
    }
    this.showPasswordEdit = result;
  }

  setShowEmail1Notice(result: boolean){
    this.showEmail1Notice = result;
  }

  setShowEmail2Notice() {
    this.showEmail2Notice = this.emailsMatch? false: true;
  }

  setShowPassword2Notice(){
    this.showPassword2Notice = this.passwordsMatch? false: true;
  }

  handleEditSubmit(){
    if (this.showPasswordEdit && this.passwordsMatch && this.email1Verified && this.emailsMatch) {//add old password verification
      const updatedUser = new User(this.firstName, this.lastName, this.email1, this.passwordNew1);
      // user Service call here
    } else if (this.showPasswordEdit){
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error. Password error or updated details error."
      })
    } else if (this.user.firstName === this.firstName && this.user.lastName === this.lastName && this.user.email === this.email1){
      Swal.fire({
        icon: "warning",
        title: "Nothing to update",
        text: "Account details have not been edited"
      })
    } else if (this.email1Verified && this.emailsMatch){
      const updatedUser = new User(this.firstName, this.lastName, this.email1, "")
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error with user form"
      })
    }
  }

  resetForm(){
    return null; //finish once user is added
  }

}
</script>

<style scoped>

.user-edit, .password-edit, .password-edit {
  width: fit-content !important;
}

.user-edit-form {
  max-width: 30em;
}

</style>
