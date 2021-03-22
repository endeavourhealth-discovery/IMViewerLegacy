<template>
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
          <InputText id="fieldPassword2" type="password" v-model="password2"/>
        </div>
        <div class="p-d-flex p-flex-row p-jc-center">
          <ConfirmDialogue></ConfirmDialogue>
          <Button class="user-submit" type="submit" label="Submit" v-on:click.prevent="handleSubmit"/>
        </div>
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
  emits: ["userCreated"],
  watch:{
    email1: {
      immediate: true,
      handler(newValue, oldValue){
        this.email1Verified = this.verifyIsEmail(newValue);
      }
    },
    email2: {
      immediate: true,
      handler(newValue, oldValue){
        this.emailsMatch = this.verifyIsEmail(newValue);
      }
    },
    password1: {
      immediate: true,
      handler(newValue, oldValue){
        this.checkPasswordStrength(newValue);
      }
    },
    password2: {
      immediate: true,
      handler(newValue, oldValue){
        this.passwordsMatch = this.verifyPasswordsMatch();
      }
    },

  }
})

export default class Register extends Vue{
  email1 = "";
  email1Verified = false
  email2 = "";
  emailsMatch = false
  firstName = "";
  lastName = "";
  password1 = "";
  password2 = "";
  passwordStrength: PasswordStrength = PasswordStrength.weak;
  passwordsMatch = false;
  showEmail1Notice = false;
  showEmail2Notice = false;

  setShowEmail1Notice(result: boolean){
    this.showEmail1Notice = result;
  }

  setShowEmail2Notice(){
    this.showEmail2Notice = this.emailsMatch? false: true;
  }

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
    if (this.email1.toLowerCase() === this.email2.toLowerCase()){
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
    const weakCheck = new RegExp("^(?=.{6,})")
    if (strongCheck.test(password)){
      this.passwordStrength = PasswordStrength.strong;
    } else if (mediumCheck.test(password)){
      this.passwordStrength = PasswordStrength.medium;
    } else if (weakCheck.test(password)){
      this.passwordStrength = PasswordStrength.weak;
    } else {
      this.passwordStrength = PasswordStrength.fail;
    }
  }

  handleSubmit(){
    if (this.verifyIsEmail(this.email1) && this.verifyIsEmail(this.email2) && this.verifyEmailsMatch() && this.verifyPasswordsMatch() && this.passwordStrength !== PasswordStrength.fail && this.verifyFirstName() && this.verifyLastName()){
      const user = new User(this.firstName, this.lastName, this.email1.toLowerCase(), this.password1)
      this.$emit("userCreated", user)
      this.$confirm.require({
        message: "User created successfully!",
        header: "Success",
        icon: "pi pi-check",
        acceptLabel: "Login",
        rejectLabel: "Close",
        accept: () => {
          this.$router.push({name: "Login"});
        },
        reject: () => {
          this.$confirm.close();
        }
      })
    } else {
      throw new Error("User creation failed")
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
  max-width: 50vw;
}

.register-form {
  max-width: 30em;
}

</style>
