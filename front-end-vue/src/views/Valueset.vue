<template>
  <div class="p-grid">
    <div class="p-col-12"><Header /></div>
    <div class="p-col-4"><Sidebar /></div>
    <div class="p-col-8"><ConceptDisplay /></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ConceptDisplay from '@/components/ConceptDisplay.vue'; // @ is an alias to /src
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';

@Options({
  components: {
    ConceptDisplay,
    Header,
    Sidebar
  },
})
export default class Valueset extends Vue {}
</script>
