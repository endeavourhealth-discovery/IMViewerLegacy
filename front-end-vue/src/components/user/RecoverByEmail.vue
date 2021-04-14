<template>
  <div class="p-d-flex p-flex-row p-ai-center">
    <Card
      class="p-d-flex p-flex-column p-jc-sm-around p-ai-center recovery-card"
    >
      <template #header>
        <i class="pi pi-fw pi-user" style="fontSize: 50px; margin-top: 1em;" />
      </template>
      <template #title>
        Account Recovery: <br /><br />Recover By Email
      </template>
      <template #content>
        <div class="p-fluid recovery-form">
          <div class="p-field">
            <label for="fieldEmail">Email</label>
            <div class="p-d-flex p-flex-row p-ai-center">
              <InputText
                id="fieldEmail"
                type="text"
                v-model="email"
                v-on:focus="setShowEmailNotice(true)"
                v-on:blur="setShowEmailNotice(false)"
              />
              <i
                v-if="showEmailNotice && emailVerified"
                class="pi pi-check-circle"
                style="color: #439446; fontSize: 2em"
              />
              <i
                v-if="showEmailNotice && !emailVerified"
                class="pi pi-times-circle"
                style="color: #e60017; fontSize: 2em"
              />
            </div>
          </div>
          <div class="p-d-flex p-flex-row p-jc-center">
            <Button
              class="user-submit"
              type="submit"
              label="Request Recovery Code"
              v-on:click.prevent="handleSubmit"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <small
          >Already have a recovery code?
          <a
            id="password-submit-link"
            class="footer-link"
            @click="$router.push({ name: 'RecoverByEmailSubmit' })"
            >Submit Code</a
          ></small
        >
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";
import { verifyIsEmail } from "@/helpers/UserMethods";

@Options({
  name: "RecoverByEmail",
  watch: {
    email: {
      immediate: true,
      handler(newValue, oldValue) {
        this.emailVerified = verifyIsEmail(newValue);
      }
    }
  }
})
export default class RecoverByEmail extends Vue {
  email = "";
  emailVerified = false;
  showEmailNotice = false;

  setShowEmailNotice(result: boolean) {
    this.showEmailNotice = result;
  }

  handleSubmit() {
    if (this.emailVerified) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Recover account with email: " + this.email,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Request Code"
      }).then(result => {
        if (result.isConfirmed) {
          AuthService.forgotUsername(this.email).then(res => {
            if (res.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Code requested",
                text:
                  "Recovery code for email has been requested: " +
                  this.email +
                  ". Check your inbox for a recovery code."
              }).then(() => {
                this.$router.push({ name: "RecoverByEmailSubmit" });
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: res.message + ". Check email is correct."
              });
            }
          });
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "Failed email validation. Ensure you have entered a valid email address.",
        confirmButtonText: "Close"
      });
    }
  }
}
</script>

<style scoped>
.recovery-card {
  padding: 0 2em;
}

.user-submit {
  width: fit-content !important;
}

.recovery-form {
  max-width: 25em;
}

.footer-link:hover {
  cursor: pointer;
}
</style>
