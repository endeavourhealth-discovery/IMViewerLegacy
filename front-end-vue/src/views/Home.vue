<template>
  <side-nav />
    <div class="layout-main">
      <div class="home">
        <div class="p-grid">
          <div class="p-col-12 p-d-flex p-flex-row">
            <div class="header-grow"><Header /></div>
            <div class="user-menu"><Menubar :model="getItems()" /></div>
          </div>
          <div class="p-col-4"><SidebarControl /></div>
          <div v-if="isHome" class="p-col-8"><Dashboard /></div>
          <router-view v-if="!isHome"/>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import SideNav from "@/components/home/SideNav.vue";
import Header from "@/components/home/Header.vue";
import SidebarControl from "@/components/sidebar/SidebarControl.vue";
import Dashboard from "@/components/home/Dashboard.vue";
import { mapState } from "vuex";
import { User } from "../models/User";
import store from "@/store/index";

@Options({
  name: "Home",
  components: {
    SideNav,
    Header,
    SidebarControl,
    Dashboard
  },
  computed: {
    user(){
      return store.state.currentUser;
    },
    isLoggedIn(){
      return store.state.isLoggedIn;
    }
  }
})

export default class Home extends Vue{
  isHome = true;
  user!: User;
  isLoggedIn!: boolean;

  async mounted() {
    this.isHome = this.$route.name === "Home"? true: false;

    if (this.$route.name === "Home"){
      store.commit("updateConceptIri", "owl:Thing");
      store.dispatch("fetchConceptAggregate", store.state.conceptIri);
    } else if (this.$route.name === "Concept") {
      store.commit("updateConceptIri", this.$route.params.selectedIri as string);
      store.dispatch("fetchConceptAggregate", store.state.conceptIri);
    }
  }

  getItems(){
    if (this.isLoggedIn){
      return this.accountItems
    } else {
      return this.loginItems
    }
  }

  loginItems: [{}] = [
    {
      label: 'User',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Login',
          icon: 'pi pi-fw pi-user-minus',
          to: '/user/login'
        },
        {
          label: 'Register',
          icon: 'pi pi-fw pi-user-plus',
          to: '/user/register'
        },
      ]
    }
  ]

  accountItems: [{}] = [
    {
      label: "Account",
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'My Account',
          icon: 'pi pi-fw pi-user-minus',
          to: '/user/my-account' //+ this.user.id
        },
        {
          label: "Edit Account Details",
          icon: 'pi pi-fw pi-user-edit',
          to: "/user/my-account/edit"
        },
        {
          label: "Change Password",
          icon: "pi pi-fw pi-lock",
          to: "/user/my-account/password-edit"
        },
        {
          label: 'Logout',
          icon: 'pi pi-fw pi-user-plus',
          to: '/user/logout' //+ this.user.id
        },
      ]
    }
  ]
}
</script>

<style>

.header-grow {
  flex-grow: 1;
}

.user-menu {
  height: 100%;
  margin-left: 5px;
  width: 12.5rem
}

.p-menubar {
  height: 100%;
}


</style>
