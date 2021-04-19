<template>
  <div class="p-lg-6 p-md-12 modulecard-container" id="module-card">
    <Card class="modulecard">
      <template #header>
        <i
          class="fas fa-map"
          style="fontSize: 6rem; color: orange; padding: 5px;"
        />
      </template>
      <template #title> Mapping Module </template>
      <template #subtitle> Data model maps </template>
      <template #content>
        Data model maps specify how data is transformed from a data model to a
        particular database.
      </template>
      <template #footer>
        <Button label="Open Mapping Module" :disabled="true" />
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "mappingModule",
  props: []
})
export default class MappingModule extends Vue {}
</script>

<style scoped>
.modulecard {
  height: 100%;
}
</style>
