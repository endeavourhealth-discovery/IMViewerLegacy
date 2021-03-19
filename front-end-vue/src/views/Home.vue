<template>
  <div class="p-grid">
    <div class="p-col-11"><Header /></div>
    <div class="p-col-1"><Menubar :model="getItems()" /></div>
    <div class="p-col-4"><SidebarControl /></div>
    <div class="p-col-8"><Dashboard /></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Dashboard from "@/components/Dashboard.vue"; // @ is an alias to /src
import Header from "@/components/Header.vue";
import SidebarControl from "@/components/sidebar/SidebarControl.vue";
import store from "@/store/index";
import { User } from "../models/User";
import { mapState } from "vuex";

@Options({
  components: {
    Dashboard,
    Header,
    SidebarControl
  },
  computed: {...mapState(['user', 'isLoggedIn'])}
})
export default class Home extends Vue {
  user!: User;
  isLoggedIn!: boolean;

  async mounted() {
    store.commit("updateConceptIri", "owl:Thing");
    store.dispatch("fetchConceptAggregate", store.state.conceptIri);
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
          label: 'Account',
          icon: 'pi pi-fw pi-user-minus',
          to: '/user/' //+ this.user.id
        },
        {
          label: 'Logout',
          icon: 'pi pi-fw pi-user-plus',
          to: '/user/edit/' //+ this.user.id
        },
      ]
    }
  ]
}
</script>
