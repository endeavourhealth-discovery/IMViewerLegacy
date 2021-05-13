<template>
  <div>
    <div v-if="icon.includes('sitemap')">
      <i class="fas fa-fw fa-sitemap" />
      {{ header }}
    </div>
    <div v-if="icon.includes('tasks')">
      <i class="fas fa-fw fa-tasks" />
      {{ header }}
    </div>
    <div v-if="icon.includes('folder')">
      <i class="fas fa-fw fa-folder" />
      {{ header }}
    </div>
    <div v-if="icon.includes('lightbulb')">
      <i class="fas fa-fw fa-lightbulb" />
      {{ header }}
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "PanelHeader",
  props: ["icon", "header"]
});
</script>

<style></style>
