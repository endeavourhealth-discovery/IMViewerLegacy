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
        <div class="p-fluid">
          <div class="p-field">
            <label for="fieldEmail">Email Address</label>
            <InputText id="fieldEmail" type="text" v-model="email" />
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

@Options({
  name: "Login",
  components: {

  }
})

export default class Login extends Vue {
  email = "";
  password = "";

  handleSubmit() {
    console.log("submitted")
  }
}
</script>

<style scoped>

.login-card {
  padding: 0 2em;
  max-width: 50vw;
}

.user-submit {
  width: fit-content !important;
}

</style>
