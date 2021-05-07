<template>
  <div v-if="currentUser" class="p-d-flex p-flex-row p-ai-center">
    <Card
      class="p-d-flex p-flex-column p-jc-sm-around p-ai-center password-edit-card"
    >
      <template #header>
        <img
          id="user-icon"
          class="avatar-icon"
          :src="getUrl(currentUser.avatar.value)"
          alt="avatar icon"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
        />
      </template>
      <template #title>
        Change password
      </template>
      <template #content>
        <div
          class="p-fluid p-d-flex p-flex-column p-jc-start password-edit-form"
        >
          <div v-if="currentUser.username" class="p-field">
            <label for="userName">User</label>
            <InputText
              class="p-text-capitalize"
              id="username"
              type="text"
              :value="currentUser.username"
              disabled
            />
          </div>
          <div class="p-field">
            <label for="passwordOld">Current password</label>
            <InputText id="passwordOld" type="password" v-model="passwordOld" />
          </div>
          <div class="p-field">
            <label for="passwordNew1">New password</label>
            <InputText
              id="passwordNew1"
              type="password"
              v-model="passwordNew1"
            />
            <InlineMessage
              v-if="passwordStrength === 'strong'"
              severity="success"
              >Password strength: Strong</InlineMessage
            >
            <InlineMessage
              v-if="passwordStrength === 'medium'"
              severity="success"
              >Password strength: Medium</InlineMessage
            >
            <InlineMessage v-if="passwordStrength === 'weak'" severity="warn"
              >Password strength: Weak</InlineMessage
            >
            <InlineMessage
              v-if="passwordStrength === 'fail' && passwordNew1 !== ''"
              severity="error"
              >Invalid password</InlineMessage
            >
            <small id="password-help">
              Password must be a minimum length of 8 characters. Improve
              password strength with a mixture of UPPERCASE, lowercase, numbers
              and special characters [!@#$%^&*].
            </small>
          </div>
          <div class="p-field">
            <label for="passwordNew2">Confirm new password</label>
            <InputText
              id="passwordNew2"
              type="password"
              v-model="passwordNew2"
              v-on:blur="setShowPassword2Message"
              @keyup="checkKey"
            />
            <InlineMessage v-if="showPassword2Message" severity="error"
              >New passwords do not match!</InlineMessage
            >
          </div>
          <div class="p-d-flex p-flex-row p-jc-center">
            <Button
              class="user-edit"
              type="submit"
              label="Change password"
              v-on:click.prevent="handleEditSubmit"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { User } from "@/models/user/User";
import {
  verifyPasswordsMatch,
  checkPasswordStrength
} from "@/helpers/UserMethods";
import { PasswordStrength } from "@/models/user/PasswordStrength";
import { mapState } from "vuex";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";

@Options({
  name: "PasswordEdit",
  components: {},
  computed: mapState(["currentUser"]),
  watch: {
    passwordNew1: {
      immediate: true,
      handler(newValue) {
        this.passwordStrength = checkPasswordStrength(newValue);
      }
    },
    passwordNew2: {
      immediate: true,
      handler(newValue) {
        this.passwordsMatch = verifyPasswordsMatch(this.passwordNew1, newValue);
      }
    }
  }
})
export default class PasswordEdit extends Vue {
  currentUser!: User;
  passwordOld = "";
  passwordNew1 = "";
  passwordNew2 = "";
  passwordsMatch = false;
  passwordStrength: PasswordStrength = PasswordStrength.fail;
  showPassword2Message = false;

  setShowPassword2Message() {
    this.showPassword2Message = this.passwordsMatch ? false : true;
  }

  handleEditSubmit() {
    if (
      this.passwordsMatch &&
      this.passwordStrength !== PasswordStrength.fail &&
      this.passwordDifferentFromOriginal()
    ) {
      AuthService.changePassword(this.passwordOld, this.passwordNew1).then(
        res => {
          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Password successfully updated"
            }).then(() => {
              this.$router.push({ name: "Home" });
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: res.message
            });
          }
        }
      );
    } else if (!this.passwordDifferentFromOriginal()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "New password can not be the same as the current password."
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "Error updating password. Authentication error or new passwords do not match."
      });
    }
  }

  passwordDifferentFromOriginal() {
    return this.passwordOld !== this.passwordNew1 ? true : false;
  }

  getUrl(item: string) {
    return require("@/assets/avatars/" + item);
  }

  checkKey(event: any) {
    if (event.keyCode === 13) {
      this.handleEditSubmit();
    }
  }
}
</script>

<style scoped>
.password-edit-card {
  padding: 0 2em;
}

.user-edit {
  width: fit-content !important;
}

.password-edit-form {
  max-width: 25em;
}

.avatar-icon {
  margin-block-start: 1em;
  width: 150px;
  border: 1px solid lightgray;
  border-radius: 50%;
}
</style>
