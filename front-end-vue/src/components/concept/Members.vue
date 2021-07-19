<template>
  <div id="members-table-container">
    <DataTable
      :value="combinedMembers"
      showGridlines
      :paginator="combinedMembers.length > 25 ? true : false"
      :rows="25"
      :rowsPerPageOptions="[25, 50, 100]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
      currentPageReportTemplate="Displaying {first} to {last} of {totalRecords} results"
      rowGroupMode="subheader"
      groupRowsBy="status"
      v-model:filters="filters1"
      filterDisplay="menu"
      :globalFilterFields="[
        'member.code',
        'member.entity.name',
        'member.scheme.name',
        'status'
      ]"
      :scrollable="true"
      class="p-datatable-sm"
      :scrollHeight="scrollHeight"
      v-model:selection="selected"
      selectionMode="single"
      :loading="loading"
      @click="onClick()"
      @page="scrollToTop"
    >
      <template #header>
        <div class="p-d-flex p-jc-between">
          <span class="p-input-icon-left">
            <i class="pi pi-search" aria-hidden="true" />
            <InputText
              v-model="filters1['global'].value"
              placeholder="Keyword Search"
            />
          </span>
          <div class="toggles-container">
            <div class="toggle-label-container" v-if="!expandMembers">
              <label for="expandSubsets">Expand subsets</label>
              <Checkbox
                :disabled="expandMembers"
                id="expandSubsets"
                v-model="expandSubsets"
                :binary="true"
              />
            </div>
            <div class="toggle-label-container">
              <label for="expandMembers">
                Expand members
              </label>
              <Checkbox
                id="expandMembers"
                v-model="expandMembers"
                :binary="true"
              />
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        No members found.
      </template>
      <template #loading>
        Loading data. Please wait...
      </template>
      <Column
        field="member.entity.name"
        header="Name"
        :sortable="true"
        filter-field="member.entity.name"
        style="flex: 0 0 60%"
      />
      <Column
        field="member.code"
        header="Code"
        :sortable="true"
        filter-field="member.code"
      />
      <Column
        field="member.scheme.name"
        header="Scheme"
        :sortable="true"
        filter-field="member.scheme.name"
      />
      <template #groupheader="slotProps">
        <span
          v-if="slotProps.data.status === 'IncludedSubset'"
          class="group-header"
        >
          Included Subsets
        </span>
        <span
          v-if="slotProps.data.status === 'IncludedMember'"
          class="group-header"
        >
          Included Members
        </span>
        <span
          v-if="slotProps.data.status === 'ExcludedMember'"
          class="group-header"
        >
          Excluded Members
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import EntityService from "@/services/EntityService";
import { FilterMatchMode } from "primevue/api";
import Swal from "sweetalert2";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "Members",
  components: {},
  props: {
    conceptIri: String
  },
  emits: ["memberClick"],
  watch: {
    async conceptIri() {
      this.expandMembers = false;
      this.expandSubsets = false;
      await this.getMembers();
    },

    async expandMembers() {
      await this.getMembers();
    },

    async expandSubsets() {
      await this.getMembers();
    }
  },
  async mounted() {
    window.addEventListener("resize", this.onResize);
    this.expandMembers = false;
    this.expandSubsets = false;
    await this.getMembers();
    this.onResize();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      loading: false,
      members: [] as any,
      selectedIncludedMember: {},
      combinedMembers: [] as any,
      scrollHeight: "500px",
      filters1: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
      },
      expandMembers: false,
      expandSubsets: false,
      selected: {} as any
    };
  },
  methods: {
    onClick() {
      if (this.selected != null && this.selected.member != null) {
        this.$router.push({
          name: "Concept",
          params: { selectedIri: this.selected.member.entity["@id"] }
        });
        this.$emit("memberClick");
      }
    },

    async getMembers() {
      this.loading = true;
      await EntityService.getEntityMembers(
        this.conceptIri as string,
        this.expandMembers,
        this.expandSubsets,
        this.expandMembers ? 2000 : undefined
      )
        .then(res => {
          this.members = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error("Failed to get members from server", err)
          );
        });
      this.expandMembersSizeCheck();
      this.loading = false;
    },

    async expandMembersSizeCheck() {
      if (this.members.limited) {
        this.expandMembers = false;
        await Swal.fire({
          icon: "warning",
          title: "Large data set",
          text:
            "Expanding this set results in a large amount of data.\n Would you like to download it instead?",
          confirmButtonText: "Download",
          showCancelButton: true
        }).then(result => {
          if (result.isConfirmed) this.download();
          else {
            this.$toast.add(
              LoggerService.warn(
                "Member expansion cancelled as results exceeded displayable limit."
              )
            );
          }
        });
      } else {
        this.combinedMembers = this.getCombinedMembers();
      }
    },

    download() {
      const modIri = (this.conceptIri as string)
        .replace(/\//gi, "%2F")
        .replace(/#/gi, "%23");
      const popup = window.open(
        process.env.VUE_APP_API +
          "api/entity/download?iri=" +
          modIri +
          "&members=true&expandMembers=true&format=excel"
      );
      if (!popup) {
        this.$toast.add(LoggerService.error("Download failed from server"));
      } else {
        this.$toast.add(LoggerService.success("Download will begin shortly"));
      }
    },

    getCombinedMembers() {
      const combinedMembers: { status: string; member: any }[] = [];
      this.members.includedSubsets?.forEach((includedSubset: any) => {
        const member = { status: "IncludedSubset", member: includedSubset };
        combinedMembers.push(member);
      });
      this.members.includedMembers?.forEach((included: any) => {
        const member = { status: "IncludedMember", member: included };
        combinedMembers.push(member);
      });
      this.members.excludedMembers?.forEach((excluded: any) => {
        const member = { status: "ExcludedMember", member: excluded };
        combinedMembers.push(member);
      });
      return combinedMembers;
    },

    onNodeSelect(member: any) {
      this.$router.push({
        name: "Concept",
        params: { selectedIri: member.concept["@id"] }
      });
    },

    toggle(event: any) {
      const x = this.$refs.menu as any;
      x.toggle(event);
    },

    scrollToTop(): void {
      const tableContainer = document.getElementById(
        "members-table-container"
      ) as HTMLElement;
      const scrollBox = tableContainer.getElementsByClassName(
        "p-datatable-wrapper"
      )[0] as HTMLElement;
      scrollBox.scrollTop = 0;
    },

    onResize() {
      this.setScrollHeight();
    },

    setScrollHeight() {
      const container = document.getElementById(
        "members-table-container"
      ) as HTMLElement;
      const header = container?.getElementsByClassName(
        "p-datatable-header"
      )[0] as HTMLElement;
      const paginator = container?.getElementsByClassName(
        "p-paginator"
      )[0] as HTMLElement;
      if (container && header && paginator) {
        const height =
          container.getBoundingClientRect().height -
          header.getBoundingClientRect().height -
          paginator.getBoundingClientRect().height -
          1 +
          "px";
        this.scrollHeight = height;
      } else if (container && header && !paginator) {
        const height =
          container.getBoundingClientRect().height -
          header.getBoundingClientRect().height -
          1 +
          "px";
        this.scrollHeight = height;
      } else {
        LoggerService.error(
          undefined,
          "Failed to set members table scroll height. Required elements not found."
        );
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

.group-header {
  font-weight: 700;
  color: rgba(51, 153, 255, 0.8);
}

.toggles-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5rem;
}

.toggle-label-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5rem;
}
</style>
