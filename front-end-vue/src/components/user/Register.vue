<template>
  <div class="p-d-flex p-flex-row p-ai-center">
    <Card class="p-d-flex p-flex-column p-jc-sm-around p-ai-center register-card">
    <template #header>
      <i class="pi pi-fw pi-user-plus" style="fontSize: 50px; margin: 1em;"/>
    </template>
    <template #title>
      Register
    </template>
    <template #content>
      <div class="p-fluid register-form">
        <div class="p-field">
          <label for="fieldUsername">Username</label>
          <InputText id="fieldUsername" type="text" v-model="username" />
        </div>
        <div class="p-field">
          <label for="fieldEmail">Email Address</label>
          <div class="p-d-flex p-flex-row p-ai-center">
            <InputText id="fieldEmail" type="text" v-model="email1" v-on:focus="setShowEmail1Notice(true)" v-on:blur="setShowEmail1Notice(false)"/>
            <i v-if="showEmail1Notice && email1Verified" class="pi pi-check-circle" style="color: #439446; fontSize: 2em" />
            <i v-if="showEmail1Notice && !email1Verified" class="pi pi-times-circle" style="color: #e60017; fontSize: 2em" />
          </div>
        </div>
        <div class="p-field">
          <label for="fieldEmail2">Confirm Email Address</label>
          <InputText id="fieldEmail2" type="text" v-model="email2" v-on:blur="setShowEmail2Notice()" />
          <InlineMessage v-if="showEmail2Notice" severity="error">Email addresses do not match!</InlineMessage>
        </div>
        <div class="p-field">
          <label for="fieldFirstName">First Name</label>
          <InputText id="fieldFirstName" type="text" v-model="firstName"/>
        </div>
        <div class="p-field">
          <label for="fieldLastName">Last Name</label>
          <InputText id="fieldLastName" type="text" v-model="lastName"/>
        </div>
        <div class="p-field">
          <label for="fieldPassword1">Password</label>
          <InputText id="fieldPassword1" type="password" aria-describedby="password-help" v-model="password1"/>
          <InlineMessage v-if="passwordStrength === 'strong'" severity="success">Password Strength: Strong</InlineMessage>
          <InlineMessage v-if="passwordStrength === 'medium'" severity="success">Password Strength: Medium</InlineMessage>
          <InlineMessage v-if="passwordStrength === 'weak'" severity="warn">Password Strength: Weak</InlineMessage>
          <InlineMessage v-if="passwordStrength === 'fail' && password1 !== ''" severity="error">Invalid Password</InlineMessage>
          <small id="password-help">Password min length 6 characters. Improve password strength with a mixture of UPPERCASE, lowercase, numbers and special characters [!@#$%^&*].</small>
        </div>
        <div class="p-field">
          <label for="fieldPassword2">Confirm Password</label>
          <InputText id="fieldPassword2" type="password" v-model="password2" v-on:blur="setShowPassword2Notice" />
          <InlineMessage v-if="showPassword2Notice" severity="error">Passwords do not match!</InlineMessage>
        </div>
        <div class="p-d-flex p-flex-row p-jc-center">
          <!-- <ConfirmDialogue></ConfirmDialogue> -->
          <Button class="user-submit" type="submit" label="Submit" v-on:click.prevent="handleSubmit"/>
        </div>
      </div>
    </template>
  </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { User } from "@/models/User";
import store from "@/store/index";
import { PasswordStrength } from "@/models/PasswordStrength";
import Swal from 'sweetalert2';
import { verifyIsEmail, verifyPasswordsMatch, verifyEmailsMatch, verifyIsName, checkPasswordStrength } from "@/helpers/UserMethods";
import AuthService from "@/services/AuthService";

@Options({
  name: "Register",
  emits: ["userCreated"],
  watch:{
    username: {
      immediate: true,
      handler(newValue, oldValue){
        this.username = newValue;
      }
    },
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
    password1: {
      immediate: true,
      handler(newValue, oldValue){
        this.passwordStrength = checkPasswordStrength(newValue);
      }
    },
    password2: {
      immediate: true,
      handler(newValue, oldValue){
        this.passwordsMatch = verifyPasswordsMatch(this.password1, this.password2);
      }
    },

  }
})

export default class Register extends Vue{
  username = "";
  email1 = "";
  email1Verified = false
  email2 = "";
  emailsMatch = false
  firstName = "";
  lastName = "";
  password1 = "";
  password2 = "";
  passwordStrength: PasswordStrength = PasswordStrength.fail;
  passwordsMatch = false;
  showEmail1Notice = false;
  showEmail2Notice = false;
  showPassword2Notice = false;

  setShowEmail1Notice(result: boolean){
    this.showEmail1Notice = result;
  }

  setShowEmail2Notice(){
    this.showEmail2Notice = this.emailsMatch? false: true;
  }

  setShowPassword2Notice(){
    this.showPassword2Notice = this.passwordsMatch? false: true;
  }

  handleSubmit(){
    if (this.allVerified()){
      const user = new User(this.username, this.firstName, this.lastName, this.email1.toLowerCase(), this.password1)
      AuthService.register(user)
      .then( res => {
        if (res.status === 201){
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.message,
            showCancelButton: true,
            confirmButtonText: 'Login'
          })
          .then( result => {
            this.$emit("userCreated", user)
            if (result.isConfirmed){
              this.$router.push({name: "Login"})
            } else {
              this.clearForm()
            }
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: "Error",
            text: res.message,
            confirmButtonText: "Close"
          })
        }
      })
      .catch ( err => {
        console.log(err)
      })
    // this.$confirm.require({
    //   message: "User created successfully!",
    //   header: "Success",
    //   icon: "pi pi-check",
    //   acceptLabel: "Login",
    //   rejectLabel: "Close",
    //   accept: () => {
    //     this.$router.push({name: "Login"});
    //   },
    //   reject: () => {
    //     this.$confirm.close();
    //   } // prime vue version -- ugly...
    // })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'User creation failed. Check input data.',
        confirmButtonText: 'Close'
      })
    }
  }

  clearForm() {
    this.email1 = "";
    this.email1Verified = false;
    this.email2 = "";
    this.emailsMatch = false;
    this.firstName = "";
    this.lastName = "";
    this.password1 = "";
    this.password2 = "";
    this.passwordStrength = PasswordStrength.fail;
    this.passwordsMatch = false;
    this.showEmail1Notice = false;
    this.showEmail2Notice = false;
    this.showPassword2Notice = false;
  }

  allVerified() {
    if (
      verifyIsEmail(this.email1) &&
      verifyIsEmail(this.email2) &&
      verifyEmailsMatch(this.email1, this.email2) &&
      verifyPasswordsMatch(this.password1, this.password2) &&
      this.passwordStrength !== PasswordStrength.fail && verifyIsName(this.firstName) &&
      verifyIsName(this.lastName)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
</script>

<style scoped>

.user-submit {
  width: fit-content !important;
}

#password-help {
  color: red;
  overflow-wrap: break-word;
}

.register-card {
  padding: 0 2em;
}

.register-form {
  max-width: 25em;
}

</style>
