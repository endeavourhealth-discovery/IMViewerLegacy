<template>
  <div
    class="loading-container p-d-flex p-flex-row p-jc-center p-ai-center"
    v-if="loading"
  >
    <ProgressSpinner />
  </div>
  <PickList
    v-else
    v-model="data"
    dataKey="code"
    :listStyle="listHeight"
    :responsive="false"
    @move-to-target="membersUpdated"
    @move-to-source="membersUpdated"
    @move-all-to-target="membersUpdated"
    @move-all-to-source="membersUpdated"
  >
    <template #sourceHeader>
      Included
    </template>
    <template #targetHeader>
      Excluded
    </template>
    <template #item="slotProps">
      <div class="member-container">
        <p class="member-name">{{ slotProps.item.concept.name }}</p>
      </div>
    </template>
  </PickList>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ConceptService from "@/services/ConceptService";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "MemberEditor",
  props: ["iri", "contentHeight", "updatedMembers"],
  emits: ["members-updated"],
  watch: {
    contentHeight() {
      this.setListHeight();
    }
  },
  async mounted() {
    if (this.iri) {
      await this.getMembers(this.iri);
      this.setListHeight();
    }
  },
  data() {
    return {
      members: [] as any,
      data: [[], []] as any,
      listHeight: "",
      loading: false
    };
  },
  methods: {
    async getMembers(iri: string): Promise<void> {
      this.loading = true;
      if (
        "included" in this.updatedMembers ||
        "excluded" in this.updatedMembers
      ) {
        this.members = JSON.parse(JSON.stringify(this.updatedMembers));
        this.data[0] = this.members.included;
        this.data[1] = this.members.excluded;
      } else {
        await ConceptService.getConceptMembers(iri, false)
          .then(res => {
            this.members = res.data;
            this.data[0] = this.members.included;
            this.data[1] = this.members.excluded;
          })
          .catch(err => {
            this.$toast.add(
              LoggerService.error("Members server request failed", err)
            );
          });
      }
      this.loading = false;
    },

    setListHeight(): void {
      const container = document.getElementById(
        "member-editor-container"
      ) as HTMLElement;
      const pickListHeader = container.getElementsByClassName(
        "p-picklist-header"
      )[0] as HTMLElement;
      if (container && pickListHeader) {
        const optimumHeight =
          container.getBoundingClientRect().height -
          pickListHeader.getBoundingClientRect().height -
          4;
        this.listHeight =
          "height: " +
          optimumHeight +
          "px; max-height: " +
          optimumHeight +
          "px;";
      }
      this.removeOrderButtons();
    },

    removeOrderButtons(): void {
      const container = document.getElementById(
        "member-editor-container"
      ) as HTMLElement;
      const sourceOrderButtons = container.getElementsByClassName(
        "p-picklist-source-controls"
      )[0] as HTMLElement;
      const targetOrderButtons = document.getElementsByClassName(
        "p-picklist-target-controls"
      )[0] as HTMLElement;
      if (sourceOrderButtons) {
        sourceOrderButtons.remove();
      }
      if (targetOrderButtons) {
        targetOrderButtons.remove();
      }
    },

    membersUpdated(): void {
      this.$emit("members-updated", {
        included: this.data[0],
        excluded: this.data[1],
        valueSet: this.members.valueSet
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
