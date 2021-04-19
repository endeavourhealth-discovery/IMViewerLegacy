<template>
  <Dialog
    header="Download Concept"
    v-model:visible="showDialog"
    :modal="true"
    :closable="false"
    :maximizable="true"
    :style="{ width: '50vw' }"
  >
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="p-button-secondary"
        @click="closeDownloadDialog"
      />
      <Button
        label="Download"
        icon="pi pi-download"
        class="p-button-primary"
        @click="downloadConcept"
      />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "DownloadDialog",
  props: ["concept", "showDialog"]
})
export default class DownloadDialog extends Vue {
  closeDownloadDialog() {
    this.$emit("closeDownloadDialog");
  }

  downloadConcept() {
    return null;
  }
}
</script>

<style scoped>
</style>
