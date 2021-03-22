<template>
  <div class="p-col-8"><PanelControl /></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import PanelControl from "@/components/panels/PanelControl.vue"; // @ is an alias to /src
import store from "@/store/index";

@Options({
  name: "Concept",
  components: {
    PanelControl,
  }
})
export default class Concept extends Vue {

}
</script>
