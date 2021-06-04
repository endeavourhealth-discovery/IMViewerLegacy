<template>
  <transition name="layout-sidebar">
    <div class="layout-sidebar layout-sidebar-dark">
      <div
        id="sidebar"
        class="layout-menu-container p-d-flex p-flex-column p-jc-between p-ai-center"
      >
        <div>
          <img
            class="im-logo"
            src="../../assets/logos/Logo-object-empty.png"
            alt="IM logo"
            @click="$router.push({ name: 'Dashboard' })"
          />
        </div>
        <!-- <div id="center-icons">
          <div v-bind:class="{ active: isActive('Home') }">
            <font-awesome-icon
              class="sidebutton"
              :icon="['fas', 'home']"
              size="4x"
              style="color: lightgrey; padding: 5px"
              @click="$router.push({ name: 'Dashboard' })"
            />
          </div>
          <div v-bind:class="{ active: isActive('Workflow') }">
            <font-awesome-icon
              class="sidebutton"
              :icon="['fas', 'tasks']"
              size="4x"
              style="color: lightgrey; padding: 5px"
            />
          </div>
          <div v-bind:class="{ active: isActive('Mapping') }">
            <font-awesome-icon
              class="sidebutton"
              :icon="['fas', 'map']"
              size="4x"
              style="color: lightgrey; padding: 5px"
            />
          </div>
        </div> -->
        <div class="footer user-settings ">
          <i
            v-if="!isLoggedIn"
            id="user-icon"
            class="pi pi-users user-icon"
            @click="toggle"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            aria-hidden="true"
          ></i>
          <img
            v-if="isLoggedIn"
            id="user-icon"
            class="avatar-icon"
            :src="getUrl(currentUser.avatar.value)"
            alt="avatar icon"
            @click="toggle"
            aria-haspopup="true"
            aria-controls="overlay_menu"
          />
          <Menu ref="menu" :model="getItems()" :popup="true" id="popup-user" />
          <!-- <i class="pi pi-cog settings-icon" aria-hidden="true"></i> -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "SideNav",
  computed: mapState(["currentUser", "isLoggedIn"]),
  data() {
    return {
      userPopupBottom: 0,
      loginItems: [
        {
          label: "Login",
          icon: "pi pi-fw pi-user",
          to: "/user/login"
        },
        {
          label: "Register",
          icon: "pi pi-fw pi-user-plus",
          to: "/user/register"
        }
      ] as { label: string; icon: string; to: string }[],

      accountItems: [
        {
          label: "My account",
          icon: "pi pi-fw pi-user",
          to: "/user/my-account" //+ this.user.id
        },
        {
          label: "Edit account",
          icon: "pi pi-fw pi-user-edit",
          to: "/user/my-account/edit"
        },
        {
          label: "Change password",
          icon: "pi pi-fw pi-lock",
          to: "/user/my-account/password-edit"
        },
        {
          label: "Logout",
          icon: "pi pi-fw pi-lock-open",
          to: "/user/logout" //+ this.user.id
        }
      ] as { label: string; icon: string; to: string }[]
    };
  },
  methods: {
    isActive(item: string): boolean {
      if (this.$route.name == item) {
        return true;
      } else {
        return false;
      }
    },

    getItems(): { label: string; icon: string; to: string }[] {
      if (this.isLoggedIn) {
        return this.accountItems;
      } else {
        return this.loginItems;
      }
    },

    toggle(event: any): void {
      const menu = this.$refs.menu as any;
      menu.toggle(event);
    },

    getUrl(item: string): string {
      return require("@/assets/avatars/" + item);
    }
  }
});
</script>

<style scoped>
.layout-sidebar {
  height: 100%;
}

.layout-menu-container {
  padding: 20px 0;
  height: 100%;
}

@media screen and (max-width: 1439px) {
  .layout-menu-container {
    width: 8vw;
  }
}

@media screen and (min-width: 1440px) {
  .layout-menu-container {
    width: 115px;
  }
}

.sidebutton {
  cursor: pointer;
}

.layout-sidebar .active .sidebutton {
  color: grey !important;
}

.user-settings {
  text-align: center;
}

.user-icon,
.settings-icon {
  width: 100%;
  /* font-size: 4rem; */
  color: lightgray;
  padding: 5px;
  cursor: pointer;
}

.settings-icon {
  padding-top: 20px;
}

.avatar-icon {
  /* width: 4rem; */
  border: 1px solid lightgray;
  border-radius: 50%;
  cursor: pointer;
}

.im-logo {
  text-align: center;
  /* font-size: 4rem; */
  color: lightgray;
  font-weight: bold;
  cursor: pointer;
}

@media screen and (max-width: 1439px) {
  .user-icon,
  .sidebutton {
    font-size: 5vw;
  }

  .avatar-icon {
    width: 5vw;
  }

  .im-logo {
    width: 7vw;
  }
}

@media screen and (min-width: 1440px) {
  .user-icon,
  .sidebutton {
    font-size: 60px;
  }

  .avatar-icon {
    width: 60px;
  }

  .im-logo {
    width: 100px;
  }
}
</style>
