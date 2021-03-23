<template>
  <div class="p-d-flex p-flex-row p-ai-center">
    <Card class="p-d-flex p-flex-column p-jc-sm-around p-ai-center login-card">
      <template #header>
        <i class="pi pi-fw pi-user" style="fontSize: 50px; margin-top: 1em;"/>
      </template>
      <template #title>
        Login
      </template>
      <template #content>
        <div class="p-fluid login-form">
          <div class="p-field">
            <label for="fieldUsername">Username</label>
            <InputText id="fieldUsername" type="text" v-model="username" />
          </div>
          <div class="p-field">
            <label for="fieldPassword">Password</label>
            <InputText id="fieldPassword" type="password" v-model="password"/>
          </div>
          <div class="p-d-flex p-flex-row p-jc-center">
            <Button class="user-submit" type="submit" label="Login" v-on:click.prevent="handleSubmit" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import store from "@/store/index";
import Swal from 'sweetalert2';
import AuthService from "@/services/AuthService";

@Options({
  name: "Login",
  components: {

  }
})

export default class Login extends Vue {
  username = "";
  password = "";

  handleSubmit() {
    AuthService.signIn(this.username, this.password)
    .then(res => {
      if (res.status === 200){
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Login successful"
        })
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.message,
          confirmButtonText: "Close"
        })
      }
    })
    .catch(err => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Authentication error",
        confirmButtonText: "Close"
      })
    })
  }
}
</script>

<style scoped>

.login-card {
  padding: 0 2em;
}

.user-submit {
  width: fit-content !important;
}

.login-form {
  max-width: 25em;
}

</style>
