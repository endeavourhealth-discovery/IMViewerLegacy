<template>
  <transition name="layout-sidebar">
    <div class="layout-sidebar layout-sidebar-dark">
      <div class="layout-menu-container p-mt-6">
        <div class="p-grid" style="text-align: center">
          <div class="p-col-12" v-bind:class="{ active: isActive('Home') }">
            <font-awesome-icon
              class="sidebutton"
              :icon="['fas', 'home']"
              size="4x"
              style="color: lightgrey; padding: 5px"
              @click="$router.push({ name: 'Home' })"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang='ts'>
import { Options, Vue } from "vue-class-component";

@Options({
  name: 'SideNav'
})
export default class SideNav extends Vue {
  isActive(item: string) {
    if (this.$route.name == item) {
      return true;
    } else {
      return false;
    }
  }
}
</script>

<style scoped>

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
