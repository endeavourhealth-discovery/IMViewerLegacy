<template>
  <Dialog
    :visible="showDialog"
    :modal="true"
    :closable="false"
    :maximizable="true"
    :style="{ width: '50vw'}"
  >
  <template #header>
    Complex members
  </template>
  <template #footer>
    <Button
      label="Close"
      icon="pi pi-times"
      class="p-button-secondary"
      @click="closeComplexMembersDialog"
    />
  </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "ComplexMembers",
  props: { conceptIri: { type: String, required: true }, showDialog: { type: Boolean, required: true } },
  emits: ["closeComplexMembersDialog"],
  watch: {
    async conceptIri() {
      await this.init();
    }
  },
  async mounted() {
    await this.init();
  },
  data() {
    return {
      complexMembers: {} as any,
      loading: false
    };
  },
  methods: {
    init() {
      this.getComplexMembers();
    },

    async getComplexMembers() {
      this.loading = true;
      await EntityService.getComplexMembers(this.conceptIri)
        .then(res => {
          this.complexMembers = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error(
              "Failed to get complex members from server",
              err
            )
          );
        });
      this.loading = false;
    },

    closeComplexMembersDialog() {
      this.$emit("closeComplexMembersDialog");
    }
  }
});
</script>

<style scoped>

</style>
