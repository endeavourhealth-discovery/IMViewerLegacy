<template>
  <div class="layout-wrapper layout-static">
    <transition name="layout-sidebar">
      <div class="layout-sidebar layout-sidebar-dark">
        <div class="layout-menu-container p-mt-6">
          <div class="p-grid" style="text-align:center;">
            <div class="p-col-12" v-bind:class="{ active: isActive('Home') }">
              <font-awesome-icon class="sidebutton" :icon="['fas', 'home']" size="4x" style="color:lightgrey; padding:5px" @click="$router.push({ name: 'Home'})" />
            </div>

            <div class="p-col-12" v-bind:class="{ active: isActive('Datamodel') }">
              <font-awesome-icon class="sidebutton" :icon="['fas', 'lightbulb']" size="4x" style="color:lightgrey; padding:5px" @click="$router.push({ name: 'Datamodel', params: { selectedIri: ':HealthRecord' } })" />
            </div>

            <div class="p-col-12" v-bind:class="{ active: isActive('Ontology') }">
              <font-awesome-icon class="sidebutton" :icon="['fas', 'sitemap']" size="4x" style="color:lightgrey; padding:5px" @click="$router.push({ name: 'Ontology', params: { selectedIri: ':SemanticConcept' } })" />
            </div>

            <div class="p-col-12" v-bind:class="{ active: isActive('Valueset') }">
              <font-awesome-icon class="sidebutton" :icon="['fas', 'tasks']" size="4x" style="color:lightgrey; padding:5px" @click="$router.push({ name: 'Valueset', params: { selectedIri: ':VSET_ValueSet' } })" />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="layout-main">
      <div class="home">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Dashboard from "@/components/Dashboard.vue"; // @ is an alias to /src
import Header from "@/components/Header.vue";
import SidebarControl from "@/components/sidebar/SidebarControl.vue";

@Options({
  components: {
    Dashboard,
    Header,
    SidebarControl
  }
})
export default class App extends Vue {
  isActive(item: string) {
    if (this.$route.name == item) {
      return true;
    } else {
      return false;
    }
  }
}
</script>

<style>
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
</style>
