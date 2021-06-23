<template>
  <div class="p-fluid">
    <div class="p-field">
      <label for="name">Name</label>
      <InputText id="name" type="text" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DefinitionForm",
  props: ["formData"]
});
</script>

<style scoped></style>
