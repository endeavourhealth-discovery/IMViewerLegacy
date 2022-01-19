<template>
  <div class="loading-container p-d-flex p-flex-row p-jc-center p-ai-center" v-if="loading">
    <ProgressSpinner />
  </div>
  <div v-else class="member-editor">
    <div class="options-buttons-container">
      <SelectButton v-model="editorType" :options="editorOptions" />
    </div>
    <div class="editor-container">
      <Builder v-if="editorType === 'Builder'" :included="included" />
      <EclInput v-if="editorType === 'Ecl'" @concept-updated="eclMembersUpdated" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Builder from "@/components/edit/memberEditor/Builder.vue";
import EclInput from "@/components/edit/memberEditor/EclInput.vue";

export default defineComponent({
  name: "MemberEditor",
  props: { updatedMembers: { type: Object, required: true } },
  components: { Builder, EclInput },
  emits: { "concept-updated": (payload: any) => true },
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
      loading: false,
      ecl: {} as any,
      editorType: "Builder",
      editorOptions: ["Builder", "Ecl"]
    };
  },
  methods: {
    processMembers(): void {
      this.loading = true;
      this.members = JSON.parse(JSON.stringify(this.updatedMembers));
      this.included = JSON.parse(JSON.stringify(this.updatedMembers.included));
      this.loading = false;
    },

    eclMembersUpdated(data: any) {
      this.$emit("concept-updated", data);
    },

    membersUpdated(data: any): void {
      console.log(data);
      this.$emit("concept-updated", {
        "http://endhealth.info/im#definition": this.included
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

.member-editor {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

.editor-container {
  flex-grow: 100;
}

.options-buttons-container {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
}
</style>
