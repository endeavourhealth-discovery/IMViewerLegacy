<template>
  <div class="loading-container p-d-flex p-flex-row p-jc-center p-ai-center" v-if="loading">
    <ProgressSpinner />
  </div>
  <div v-else class="member-editor">
    <p>member-editor</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MemberEditor",
  props: { updatedMembers: { type: Object, required: true } },
  emits: { "members-updated": (payload: any) => true },
  watch: {
    updatedMembers: {
      handler() {
        this.processMembers();
      },
      deep: true
    }
  },
  mounted() {
    this.processMembers();
  },
  data() {
    return {
      members: {} as any,
      included: [] as any[],
      loading: false
    };
  },
  methods: {
    processMembers(): void {
      this.loading = true;
      this.members = JSON.parse(JSON.stringify(this.updatedMembers));
      this.included = JSON.parse(JSON.stringify(this.updatedMembers.included));
      this.loading = false;
    },

    membersUpdated(): void {
      this.$emit("members-updated", {
        included: this.included
      });
    }
  }
});
</script>

<style scoped>
.member-name {
  word-wrap: break-word;
}

.loading-container {
  height: 100%;
}
</style>
