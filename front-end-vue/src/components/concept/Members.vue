<template>
  <div id="members-table-container">
    <DataTable
      :value="combinedMembers"
      showGridlines
      rowGroupMode="subheader"
      groupRowsBy="label"
      :expandableRowGroups="true"
      v-model:expandedRowGroups="expandedRowGroups"
      @rowgroupExpand="onRowGroupExpand"
      @rowgroupCollapse="onRowGroupCollapse"
      v-model:filters="filters1"
      filterDisplay="menu"
      :globalFilterFields="['code', 'entity.name', 'scheme.name', 'label']"
      :scrollable="true"
      sortMode="single"
      sortField="label"
      :sortOrder="1"
      class="p-datatable-sm"
      scrollHeight="flex"
      v-model:selection="selected"
      selectionMode="single"
      :loading="loading"
      @rowSelect="onRowSelect"
    >
      <template #header>
        <div class="p-d-flex p-jc-between">
          <span class="p-input-icon-left">
            <i class="pi pi-search" aria-hidden="true" />
            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" />
          </span>
          <div class="checkboxes-container">
            <Button type="button" label="Download..." @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
            <Menu id="overlay_menu" ref="menu" :model="downloadMenu" :popup="true" />
          </div>
        </div>
      </template>
      <template #empty>
        No members found.
      </template>
      <template #loading>
        Loading data. Please wait...
      </template>
      <Column field="entity.name" header="Name" filter-field="entity.name">
        <template #body="slotProps">
          <div v-if="slotProps.data.type === 'COMPLEX'" class="complex-member-container">
            <ComplexMembers :conceptIri="conceptIri" />
          </div>
          <span v-else>{{ slotProps.data.entity.name }}</span>
        </template>
      </Column>
      <template #groupheader="slotProps">
        <span v-for="subSet in subsets" :key="subSet">
          <span v-if="slotProps.data.label === subSet" class="group-header">
            {{ subSet }}
          </span>
        </span>
        <span v-if="slotProps.data.type === 'INCLUDED'" class="group-header">
          Included Members
        </span>
        <span v-if="slotProps.data.type === 'EXCLUDED'" class="group-header">
          Excluded Members
        </span>
        <span v-if="slotProps.data.type === 'EXPANDED'" class="group-header">
          Expanded Members
        </span>
        <span v-if="slotProps.data.type === 'COMPLEX'" class="group-header">
          Complex Members
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import EntityService from "@/services/EntityService";
import { FilterMatchMode } from "primevue/api";
import LoggerService from "@/services/LoggerService";
import ComplexMembers from "@/components/concept/members/ComplexMembers.vue";
import { ValueSetMember } from "@/models/members/ValueSetMember";
import { ExportValueSet } from "@/models/members/ExportValueSet";
import { isArrayHasLength, isObjectHasKeys } from "@/helpers/DataTypeCheckers";

export default defineComponent({
  name: "Members",
  components: { ComplexMembers },
  props: {
    conceptIri: { type: String, required: true }
  },
  emits: ["memberClick"],
  watch: {
    async conceptIri() {
      await this.getMembers();
    }
  },
  async mounted() {
    window.addEventListener("resize", this.onResize);
    await this.getMembers();
    this.onResize();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      loading: false,
      members: {} as ExportValueSet,
      combinedMembers: [] as ValueSetMember[],
      filters1: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
      },
      selected: {} as ValueSetMember,
      subsets: [] as string[],
      expandedRowGroups: ["a_MemberIncluded", "b_MemberExcluded", "z_ComplexMember"],
      downloadMenu: [
        { label: "Definition", command: () => this.download(false) },
        { label: "Expanded (v2)", command: () => this.download(true) },
        { label: "Expanded (v1)", command: () => this.download(true, true) }
      ]
    };
  },
  methods: {
    toggle(event: any) {
      const x = this.$refs.menu as any;
      x.toggle(event);
    },

    onRowGroupExpand(): void {
      this.setTableWidth();
    },

    onRowGroupCollapse(): void {
      this.setTableWidth();
    },

    onRowSelect(): void {
      if (isObjectHasKeys(this.selected, ["entity"]) && isObjectHasKeys(this.selected.entity, ["@id"])) {
        this.$router.push({
          name: "Concept",
          params: { selectedIri: this.selected.entity["@id"] }
        });
        this.$emit("memberClick");
      }
    },

    async getMembers(): Promise<void> {
      this.loading = true;
      this.expandedRowGroups = ["a_MemberIncluded", "b_MemberExcluded", "z_ComplexMember"];
      this.selected = {} as ValueSetMember;
      this.subsets = [];
      this.members = await EntityService.getEntityMembers(this.conceptIri, false, false, 2000);
      this.sortMembers();
      this.combinedMembers = this.members.members;
      this.setSubsets();
      this.setTableWidth();
      this.loading = false;
    },

    setSubsets(): void {
      this.combinedMembers.forEach((member: ValueSetMember) => {
        if (!this.subsets.some(e => e === member.label)) {
          if (member.type === "SUBSET") {
            this.subsets.push(member.label);
          }
        }
      });
    },

    download(expanded: boolean, v1 = false): void {
      const modIri = (this.conceptIri).replace(/\//gi, "%2F").replace(/#/gi, "%23");
      const popup = window.open(
        process.env.VUE_APP_API + "api/set/download?iri=" + modIri + "&expandMembers=" + expanded + "&v1=" + (expanded && v1) + "&format=excel"
      );
      if (!popup) {
        this.$toast.add(LoggerService.error("Download failed from server"));
      } else {
        this.$toast.add(LoggerService.success("Download will begin shortly"));
      }
    },

    sortMembers(): void {
      if (isObjectHasKeys(this.members, ["members"]) && isArrayHasLength(this.members.members)) {
        this.members.members.sort((a: ValueSetMember, b: ValueSetMember) =>
          a.label.localeCompare(b.label) == 0 ? a.entity.name.localeCompare(b.entity.name) : a.label.localeCompare(b.label)
        );
      }
    },

    onResize(): void {
      this.setTableWidth();
    },

    setTableWidth(): void {
      const container = document.getElementById("members-table-container") as HTMLElement;
      const table = container?.getElementsByClassName("p-datatable-table")[0] as HTMLElement;
      if (table) {
        table.style.width = "100%";
      } else {
        LoggerService.error(undefined, "Failed to set members table width. Required element(s) not found.");
      }
    }
  }
});
</script>

<style scoped>
#members-table-container {
  height: 100%;
  width: 100%;
}

#members-table-container ::v-deep(.p-datatable-wrapper) {
  overflow-x: hidden;
}

#members-table-container ::v-deep(td) {
  word-break: break-all;
}

.group-header {
  font-weight: 700;
  color: rgba(51, 153, 255, 0.8);
}

.checkboxes-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5rem;
}

.complex-member-container {
  width: 100%;
}
</style>
