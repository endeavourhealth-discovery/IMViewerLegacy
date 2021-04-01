<template>
  <side-nav />
    <div class="layout-main">
      <div class="home">
        <div class="p-grid">
          <div class="p-col-12" id="header-home"><Header /></div>
          <div class="p-col-3"><SidebarControl /></div>
          <div v-if="isHome" class="p-col-9" style="height: calc(100vh - 123px); overflow: auto;"><Dashboard /></div>
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
import AuthService from "@/services/AuthService";

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

    // check for user and log them in if found or logout if not
    store.dispatch("authenticateCurrentUser")

    if (this.$route.name === "Home"){
      store.commit("updateConceptIri", "http://www.w3.org/2002/07/owl#Thing");
    } else if (this.$route.name === "Concept") {
      store.commit("updateConceptIri", this.$route.params.selectedIri as string);
    }
    store.dispatch("fetchConceptAggregate", store.state.conceptIri);
    store.dispatch("fetchConceptMapped", store.state.conceptIri);
    store.dispatch("fetchConceptUsages", store.state.conceptIri);
  }
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
