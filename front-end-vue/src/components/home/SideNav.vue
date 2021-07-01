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

        <div id="center-icons" style="color: grey">
          <div
            v-for="item in menuItems"
            :key="item.route"
            class="center-icon-container"
            v-bind:class="{ active: isActive(item.activeOn) }"
            @click="$router.push({ name: item.route })"
          >
            <font-awesome-icon
              class="sidebutton center-icon"
              :icon="item.icon"
              style="padding: 5px"
              fixed-width
            />
            <div class="center-icon-text">{{ item.name }}</div>
          </div>
        </div>

        <div class="footer user-settings">
          <span
            v-if="!isLoggedIn"
            id="user-icon"
            @click="toggle"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            aria-hidden="true"
          >
            <i class="fas fa-users"></i>
          </span>
          <img
            v-if="isLoggedIn"
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
      ] as { label: string; icon: string; to: string }[],

      menuItems: [
        {
          activeOn: ["Dashboard", "Concept"],
          route: "Dashboard",
          icon: ["fas", "book"],
          name: "Ontology"
        } //,
        // {
        //   activeOn: ["ReferenceData"],
        //   // route: "ReferenceData",
        //   icon: ["fas", "database"],
        //   name: "Reference"
        // },
        // {
        //   activeOn: ["ValueSets"],
        //   // route: "ValueSets",
        //   icon: ["fas", "layer-group"],
        //   name: "Sets"
        // },
        // {
        //   activeOn: ["Queries"],
        //   // route: "Queries",
        //   icon: ["fas", "search"],
        //   name: "Queries"
        // },
        // {
        //   activeOn: ["Workflow"],
        //   // route: "Workflow",
        //   icon: ["fas", "tasks"],
        //   name: "Workflow"
        // },
        // {
        //   activeOn: ["Mapping"],
        //   // route: "Mapping",
        //   icon: ["fas", "map"],
        //   name: "Maps"
        // },
        // {
        //   activeOn: ["UPRN"],
        //   route: "UPRN",
        //   icon: ["fas", "map-marked-alt"],
        //   name: "Assign"
        // }
      ]
    };
  },
  methods: {
    isActive(items: any[]): boolean {
      return items.indexOf(this.$route.name) >= 0;
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

.center-icon-container {
  width: 100%;
  padding-right: 5px;
  border-right: 0;
  margin-bottom: 20px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
}

.center-icon-text {
  padding-right: 0;
  width: 100%;
  word-break: break-all;
}

#center-icons .active {
  padding-right: 0;
  border-right: 5px solid lightgrey;
}

.disabled * {
  color: #555555;
  cursor: not-allowed !important;
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
  width: 100%;
}

#user-icon,
.settings-icon {
  width: 100%;
  color: lightgray;
  padding: 5px;
  cursor: pointer;
}

.settings-icon {
  padding-top: 20px;
}

.avatar-icon {
  border: 1px solid lightgray;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 5px;
}

.im-logo {
  text-align: center;
  color: lightgray;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1rem;
}

@media screen and (max-width: 1439px) {
  .layout-menu-container {
    width: 8vw;
  }

  #user-icon,
  .sidebutton {
    font-size: 4vw;
  }

  .avatar-icon {
    width: 5vw;
  }

  .im-logo {
    width: 7vw;
  }

  .center-icon-text {
    font-size: 1rem;
  }
}

@media screen and (min-width: 1440px) {
  .layout-menu-container {
    width: 115px;
  }

  #user-icon,
  .sidebutton {
    font-size: 50px;
  }

  .avatar-icon {
    width: 80px;
  }

  .im-logo {
    width: 100px;
  }

  .center-icon-text {
    font-size: 1.5rem;
  }
}
</style>
