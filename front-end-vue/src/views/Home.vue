<template>
  <div class="p-grid">
    <div class="p-col-11"><Header /></div>
    <div class="p-col-1"><Menubar :model="items" /></div>
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

@Options({
  components: {
    Dashboard,
    Header,
    SidebarControl
  },
  props: ['user']
})
export default class Home extends Vue {
  async mounted() {
    store.commit("updateConceptIri", "owl:Thing");
    store.dispatch("fetchConceptAggregate", store.state.conceptIri);
  }

  items: [{}] = [
    {
      label: 'User',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Login',
          icon: 'pi pi-fw pi-user-minus'
        },
        {
          label: 'Register',
          icon: 'pi pi-fw pi-user-plus'
        },
      ]
    }
  ]

  // getUserMenuItems() {
  //   if (this.user){

  //   }
  // }
}
</script>
