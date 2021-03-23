<template>
  <div class="p-d-flex p-flex-row p-ai-center">
    <Card class="p-d-flex p-flex-column p-jc-sm-around p-ai-center confirm-card">
      <template #header>
        <i class="pi pi-fw pi-key" style="fontSize: 50px; margin-top: 1em;"/>
      </template>
      <template #title>
        Confirmation Code
      </template>
      <template #content>
        <div class="p-fluid code-form">
          <div class="p-field">
            <label for="fieldEmail">Please enter your 6-digit confirmation code</label>
            <div class="p-d-flex p-flex-row p-ai-center">
              <InputText id="fieldEmail" type="password" v-model="code" />
              <i v-if="codeVerified" class="pi pi-check-circle" style="color: #439446; fontSize: 2em" />
              <i v-if="!codeVerified && code!== ''" class="pi pi-times-circle" style="color: #e60017; fontSize: 2em" />
            </div>
            <small id="code-help">Your code should arrive by email from Amazon</small>
          </div>
          <div class="p-d-flex p-flex-row p-jc-center">
            <Button class="user-submit" type="submit" label="Submit" v-on:click.prevent="handleSubmit" />
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
import AuthService from "@/services/AuthService";
import Swal from "sweetalert2";

@Options({
  name: "ConfirmCode",
  computed: {
    user(){
      return store.state.user
    }
  },
  watch: {
    code: {
      immediate: true,
      handler(newValue, oldValue){
        this.code = newValue;
        this.verifyCode();
      }
    }
  }
})

export default class ConfirmCode extends Vue{
  user!: User;
  code = "";
  codeVerified = false;

  verifyCode(){
    this.codeVerified = /^(?=.{6,})/.test(this.code)
  }

  handleSubmit(){
    if (this.codeVerified){
      AuthService.confirmRegister(this.user, this.code)
      .then( res => {
        if (res.status === 200){
          Swal.fire({
            icon: "success",
            title: "Success",
            text: res.message,
            confirmButtonText: "Login"
          })
          .then( result => {
            this.$router.push({name: "Login"})
          })
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: res.message
          })
        }
      })
      .catch( err => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Auth Service Error"
        })
      })
    }
    else {
      Swal.fire({
        icon: "warning",
        title: "Invalid Code",
        text: "Code must be 6 digits"
      })
    }
  }

}
</script>

<style scoped>

.confirm-card {
  padding: 0 2em;
}

.user-submit {
  width: fit-content !important;
}

.code-form {
  max-width: 25em;
}

</style>
