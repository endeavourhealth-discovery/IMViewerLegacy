<template>
  <Card class="p-d-flex p-flex-column p-jc-sm-around p-ai-center">
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
          <InputText id="fieldEmail" type="text" />
        </div>
        <div class="p-field">
          <label for="fieldPassword1">Password</label>
          <InputText id="fieldPassword1" type="password" />
        </div>
        <div class="p-field">
          <label for="fieldPassword2">Confirm Password</label>
          <InputText id="fieldPassword2" type="password" />
        </div>
        <Button type="submit" label="Submit" />
      </div>
    </template>
  </Card>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import store from "@/store/index";

@Options({
  name: "Login",
  components: {

  }
})

export default class Login extends Vue {

}
</script>

<style>

</style>
