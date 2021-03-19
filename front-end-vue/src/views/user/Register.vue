<template>
    <Card class="p-d-flex p-flex-column p-jc-sm-around p-ai-center">
    <template #header>
      <i class="pi pi-fw pi-user" style="fontSize: 50px; margin: 1em;"/>
    </template>
    <template #title>
      Register
    </template>
    <template #content>
      <div class="p-fluid">
        <div class="p-field">
          <label for="fieldEmail">Email Address</label>
          <InputText id="fieldEmail" type="text" v-model="email1"/>
        </div>
        <div class="p-field">
          <label for="fieldEmail2">Confirm Email Address</label>
          <InputText id="fieldEmail2" type="text" v-model="email2" />
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
          <InputText id="fieldPassword1" type="password" v-model="password1"/>
        </div>
        <div class="p-field">
          <label for="fieldPassword2">Confirm Password</label>
          <InputText id="fieldPassword2" type="password" v-model="password2"/>
        </div>
        <Button type="submit" label="Submit" v-on:click.prevent="handleSubmit"/>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { User } from "@/models/User";
import store from "@/store/index";
import { PasswordStrength } from "@/models/PasswordStrength";

@Options({
  name: "Register",
  watch: {
    email1(){
      this.email1Verified = this.verifyEmail(this.email1)
    },
    email2(){
      this.email2Verified = this.verifyEmail(this.email2);
    }
  },
  emits: ["userCreated"]
})

export default class Register extends Vue{
  email1 = "";
  email1Verified = false
  email2 = "";
  email2Verified = false
  firstName = "";
  lastName = "";
  password1 = "";
  password2 = "";
  passwordStrength: PasswordStrength = PasswordStrength.weak;

  verifyIsEmail(email: any){
    if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      return true;
    } else {
      return false;
    }
  }

  verifyPasswordsMatch(){
    if (this.password1 === this.password2){
      return true;
    } else {
      return false;
    }
  }

  verifyEmailsMatch(){
    if (this.email1 === this.email2){
      return true;
    } else {
      return false;
    }
  }

  verifyFirstName(){
    if (/^[a-zA-Z]+$/.test(this.firstName)){
      return true;
    } else {
      return false
    }
  }

  verifyLastName(){
    if (/^[a-zA-Z]+$/.test(this.lastName)){
      return true
    } else {
      return false
    }
  }

  checkPasswordStrength(password: any){
    const strongCheck = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    const mediumCheck = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    if (strongCheck.test(password)){
      this.passwordStrength = PasswordStrength.strong;
    } else if (mediumCheck.test(password)){
      this.passwordStrength = PasswordStrength.medium;
    } else {
      this.passwordStrength = PasswordStrength.weak;
    }
  }

  handleSubmit(){
    if (this.verifyIsEmail(this.email1) && this.verifyIsEmail(this.email2) && this.verifyEmailsMatch() && this.verifyPasswordsMatch() && this.verifyFirstName() && this.verifyLastName()){
      const user = new User(this.firstName, this.lastName, this.email1, this.password1)
      this.$emit("userCreated", user)
    } else {
      throw new Error("User creation failed")
    }
  }
}
</script>

<style>

</style>
