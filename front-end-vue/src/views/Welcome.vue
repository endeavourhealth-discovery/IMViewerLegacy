<template>
  <div class="p-col-8"><Dashboard /></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Dashboard from "@/components/Dashboard.vue"; // @ is an alias to /src
import store from "@/store/index";

@Options({
  name: "Home",
  components: {
    Dashboard,
  },
})
export default class Home extends Vue {

}
</script>
