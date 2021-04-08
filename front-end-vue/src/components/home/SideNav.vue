<template>
  <transition name="layout-sidebar">
    <div class="layout-sidebar layout-sidebar-dark">
      <div
        id="sidebar"
        class="layout-menu-container p-d-flex p-flex-column p-jc-between p-ai-center"
      >
        <div>
          <p class="im-logo" @click="$router.push({ name: 'Dashboard' }) ">IM</p>
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
          ></i>
          <Avatar
            v-if="isLoggedIn"
            id="user-icon"
            class="avatar-icon"
            icon="pi pi-user"
            size="large"
            shape="circle"
            @click="toggle"
            aria-haspopup="true"
            aria-controls="overlay_menu"
          />
          <Menu
            ref="menu"
            :model="getItems()"
            :popup="true"
            class="popup-user"
          />
          <!-- <MegaMenu :model="items" orientation="vertical"/> -->
          <i class="pi pi-cog settings-icon"></i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import store from "@/store/index";
import { User } from "@/models/User";

@Options({
  name: "SideNav",
  computed: {
    currentUser() {
      return store.state.currentUser;
    },
    isLoggedIn() {
      return store.state.isLoggedIn;
    }
  }
})
export default class SideNav extends Vue {
  currentUser!: User;
  isLoggedIn!: boolean;
  $refs!: any;

  popupClass() {
    this.isLoggedIn ? "user-popup" : "user-popup";
  }

  isActive(item: string) {
    if (this.$route.name == item) {
      return true;
    } else {
      return false;
    }
  }

  getItems() {
    if (this.isLoggedIn) {
      return this.accountItems;
    } else {
      return this.loginItems;
    }
  }

  loginItems: [{}, {}] = [
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
  ];

  accountItems: [{}, {}, {}, {}] = [
    {
      label: "My Account",
      icon: "pi pi-fw pi-user",
      to: "/user/my-account" //+ this.user.id
    },
    {
      label: "Edit Account",
      icon: "pi pi-fw pi-user-edit",
      to: "/user/my-account/edit"
    },
    {
      label: "Change Password",
      icon: "pi pi-fw pi-lock",
      to: "/user/my-account/password-edit"
    },
    {
      label: "Logout",
      icon: "pi pi-fw pi-lock-open",
      to: "/user/logout" //+ this.user.id
    }
  ];

  toggle(event: any) {
    this.$refs.menu.toggle(event);
  }
}
</script>

<style scoped>
.layout-menu-container {
  padding: 20px 0;
  height: 100%;
}

.p-menu {
  background-color: hotpink;
  left: calc((100vw / 12) * 3);
}

.p-button {
  width: 90%;
  text-align: center;
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
  font-size: 4em;
  color: lightgray;
  padding: 5px;
  cursor: pointer;
}

.settings-icon {
  padding-top: 20px;
}

.avatar-icon {
  cursor: pointer;
}

.im-logo {
  text-align: center;
  font-size: 4em;
  color: lightgray;
  font-weight: bold;
}
</style>
