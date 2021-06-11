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
            @click="resetToHome"
          />
        </div>

<!--
        <div id="center-icons" style="color: grey">
          <div v-bind:class="{ active: isActive(['Dashboard', 'Concept']) }" @click="$router.push({ name: 'Dashboard' })">
            <font-awesome-icon
              class="sidebutton"
              :icon="['fas', 'book']"
              style="padding: 5px"
              fixed-width
            />
            <div>Ontology</div>
          </div>
          <div v-bind:class="{ active: isActive(['UPRN']) }" @click="$router.push({ name: 'UPRN' })">
            <font-awesome-icon
                class="sidebutton"
                :icon="['fas', 'map-marked-alt']"
                style="padding: 5px"
                fixed-width
            />
            <div>UPRN</div>
          </div>
          <div v-bind:class="{ active: isActive('Workflow') }" class="disabled">
            <font-awesome-icon
              class="sidebutton"
              :icon="['fas', 'tasks']"
              size="4x"
              style="padding: 5px"
            />
            <div>Workflow</div>
          </div>
          <div v-bind:class="{ active: isActive('Mapping') }" class="disabled">
            <font-awesome-icon
              class="sidebutton"
              :icon="['fas', 'map']"
              size="4x"
              style="padding: 5px"
            />
            <div>Mapping</div>
          </div>
        </div>

        -->
        <div class="footer user-settings">
          <span
            v-if="!isLoggedIn"
            id="user-icon"
            @click="toggle"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            aria-hidden="true"
          >
            <i class="fas fa-fw fa-3x fa-users" style="color: lightgrey"></i>
          </span>
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
          icon: "fa fa-fw fa-user",
          to: "/user/login"
        },
        {
          label: "Register",
          icon: "fa fa-fw fa-user-plus",
          to: "/user/register"
        }
      ] as { label: string; icon: string; to: string }[],

      accountItems: [
        {
          label: "My account",
          icon: "fa fa-fw fa-user",
          to: "/user/my-account" //+ this.user.id
        },
        {
          label: "Edit account",
          icon: "fa fa-fw fa-user-edit",
          to: "/user/my-account/edit"
        },
        {
          label: "Change password",
          icon: "fa fa-fw fa-user-lock",
          to: "/user/my-account/password-edit"
        },
        {
          label: "Logout",
          icon: "fa fa-fw fa-sign-out-alt",
          to: "/user/logout" //+ this.user.id
        }
      ] as { label: string; icon: string; to: string }[]
    };
  },
  methods: {
    isActive(items: any[]): boolean {
      return (items.indexOf(this.$route.name) >= 0);
    },

    getItems(): { label: string; icon: string; to: string }[] {
      if (this.isLoggedIn) {
        return this.accountItems;
      } else {
        return this.loginItems;
      }
    },

    toggle(event: any): void {
      console.log("Toggle");
      const menu = this.$refs.menu as any;
      menu.toggle(event);
    },

    getUrl(item: string): string {
      return require("@/assets/avatars/" + item);
    },

    resetToHome(): void {
      this.$store.commit(
        "updateConceptIri",
        "http://endhealth.info/im#DiscoveryOntology"
      );
      this.$router.push({ name: "Dashboard" });
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

#center-icons {
  text-align: center;
  width: 100%;
}

#center-icons div {
  width: 100%;
  padding-right: 5px;
  border-right: 0;
  margin-bottom: 20px;
}

#center-icons .active {
  padding-right: 0;
  border-right: 5px solid lightgrey;
}

.disabled * {
  cursor: not-allowed !important;
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
  color: lightgrey !important;
}

.layout-sidebar .active div {
  color: lightgrey !important;
}

.user-settings {
  cursor: pointer;
  text-align: center;
  margin-top: auto;
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
  margin-bottom: 1rem;
}

@media screen and (max-width: 1439px) {
  .user-icon,
  .sidebutton {
    font-size: 4vw;
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
    font-size: 40px;
  }

  .avatar-icon {
    width: 60px;
  }

  .im-logo {
    width: 100px;
  }
}
</style>
