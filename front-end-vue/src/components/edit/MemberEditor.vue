<template>
  <div class="left-side">
    <TabView :activeIndex="activeIndexLeft">
      <TabPanel>
        <template #header>
          <i class="fas fa-sitemap icon-header" aria-hidden="true" />
          <span>Hierarchy</span>
        </template>
      </TabPanel>
      <TabPanel>
        <template #header>
          <i class="fas fa-search icon-header" aria-hidden="true" />
          <span>Search</span>
        </template>
      </TabPanel>
    </TabView>
  </div>
  <div class="center-buttons">
    <Button icon="pi pi-angle-right" />
    <Button icon="pi pi-angle-double-right" />
    <Button icon="pi pi-angle-left" />
    <Button icon="pi pi-angle-double-left" />
  </div>
  <div class="right-side">
    <TabView :activeIndex="activeIndexRight" lazy>
      <TabPanel>
        <template #header>
          <i class="fas fa-plus icon-header" aria-hidden="true" />
          <span>Included</span>
        </template>
        <div id="included-panel-content" :style="panelHeight">
          <DataTable
            :value="data[0]"
            :selection="selectedIncluded"
            selectionMode="multiple"
            dataKey="code"
            :metaKeySelection="false"
            scrollHeight="flex"
            :scrollable="true"
          >
            <Column field="concept.name" header="Included" />
          </DataTable>
        </div>
      </TabPanel>
      <TabPanel>
        <template #header>
          <i class="fas fa-minus icon-header" aria-hidden="true" />
          <span>Excluded</span>
        </template>
      </TabPanel>
    </TabView>
  </div>
  <!-- <div
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
  </Dialog> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AddMember from "@/components/edit/AddMember.vue";

export default defineComponent({
  name: "MemberEditor",
  props: ["iri", "contentHeight", "updatedMembers"],
  components: { },
  emits: ["members-updated"],
  watch: {
    contentHeight() {
      this.setPanelHeights();
    }
  },
  mounted() {
    this.setPanelHeights();
  },
  data() {
    return {
      members: JSON.parse(JSON.stringify(this.updatedMembers)),
      data: [
        JSON.parse(JSON.stringify(this.updatedMembers.included)),
        JSON.parse(JSON.stringify(this.updatedMembers.excluded))
      ] as any,
      panelHeight: "",
      loading: false,
      showAddMemberDialog: false,
      selectedColumn: "",
      selectedMembersToAdd: [] as any,
      activeIndexLeft: 0,
      activeIndexRight: 0,
      selectedIncluded: null as any
    };
  },
  methods: {
    setPanelHeights(): void {
      const container = document.getElementById(
        "member-editor-container"
      ) as HTMLElement;
      const nav = container.getElementsByClassName(
        "p-tabview-nav"
      )[0] as HTMLElement;
      const currentFontSize = parseFloat(
        window
          .getComputedStyle(document.documentElement, null)
          .getPropertyValue("font-size")
      );
      if (container && nav && currentFontSize) {
        const optimumHeight =
          container.getBoundingClientRect().height -
          nav.getBoundingClientRect().height -
          currentFontSize * 2 -
          1;
        this.panelHeight =
          "height: " +
          optimumHeight +
          "px; max-height: " +
          optimumHeight +
          "px;";
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

.center-buttons {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 10%;
  height: 100%;
}

.left-side {
  width: 40%;
  height: 100%
}

.right-side {
  width: 40%;
  height: 100%;
}

.p-tabview-panels {
  overflow-y: auto;
}

.p-datatable {
  max-height: 100%;
}
</style>
