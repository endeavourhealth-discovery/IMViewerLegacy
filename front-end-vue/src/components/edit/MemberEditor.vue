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
      <div class="header-container">
        <span>Included</span>
        <Button
          label="Add"
          icon="fas fa-plus"
          @click="openDialog('included')"
        />
      </div>
    </template>
    <template #targetHeader>
      <div class="header-container">
        <span>Excluded</span>
        <Button
          label="Add"
          icon="fas fa-plus"
          @click="openDialog('excluded')"
        />
      </div>
    </template>
    <template #item="slotProps">
      <div class="member-container">
        <p class="member-name">{{ slotProps.item.concept.name }}</p>
      </div>
    </template>
  </PickList>
  <Dialog
    :visible="showAddMemberDialog"
    header="Add member"
    :modal="true"
    :style="{ width: '80vw' }"
    :maximizable="true"
    :closable="false"
  >
    <AddMember
      @selected-updated="selectedUpdated($event)"
      :selectedColumn="selectedColumn"
      :included="data[0]"
      :excluded="data[1]"
    />
    <template #footer>
      <Button
        label="Cancel"
        icon="fas fa-times"
        @click="closeDialog"
        class="p-button-text"
      />
      <Button label="Add members" icon="fas fa-check" @click="addMembers" />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AddMember from "@/components/edit/AddMember.vue";

export default defineComponent({
  name: "MemberEditor",
  props: ["iri", "contentHeight", "updatedMembers"],
  components: { AddMember },
  emits: ["members-updated"],
  watch: {
    contentHeight() {
      this.setListHeight();
    }
  },
  mounted() {
    this.setListHeight();
  },
  data() {
    return {
      members: JSON.parse(JSON.stringify(this.updatedMembers)),
      data: [
        JSON.parse(JSON.stringify(this.updatedMembers.included)),
        JSON.parse(JSON.stringify(this.updatedMembers.excluded))
      ] as any,
      listHeight: "",
      loading: false,
      showAddMemberDialog: false,
      selectedColumn: "",
      selectedMembersToAdd: [] as any
    };
  },
  methods: {
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
    },

    openDialog(columnName: string) {
      this.selectedColumn = columnName;
      this.showAddMemberDialog = true;
    },

    closeDialog() {
      this.showAddMemberDialog = false;
    },

    addMembers() {
      if (this.selectedMembersToAdd.length > 0) {
        if (this.selectedColumn === "included") {
          this.selectedMembersToAdd.forEach((member: any) => {
            this.data[0].push(member);
          });
        }
        if (this.selectedColumn === "excluded") {
          this.selectedMembersToAdd.forEach((member: any) => {
            this.data[1].push(member);
          });
        }
      }
      this.showAddMemberDialog = false;
    },

    selectedUpdated(event: any) {
      this.selectedMembersToAdd = event;
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

.header-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}
</style>
