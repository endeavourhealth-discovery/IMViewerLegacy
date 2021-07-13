<template>
  <div class="p-d-flex p-flex-row members-container">
    <div id="members-table-container" class="included-container p-field">
      <div class="p-d-flex p-flex-row p-jc-center" v-if="loading">
        <div class="spinner">
          <ProgressSpinner />
        </div>
      </div>
      <DataTable
        :value="combinedMembers"
        responsiveLayout="scroll"
        showGridlines
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[10, 20, 50]"
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
        scrollHeight="flex"
        v-model:selection="selected"
        selectionMode="single"
        @click="onClick()"
        v-else
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
              <div class="toggle-label-container" v-if="!expandedMembers">
                <label for="expandedSets">Expand sets</label>
                <Checkbox
                  :disabled="expandedMembers"
                  id="expandedSets"
                  v-model="expandedSets"
                  :binary="true"
                />
              </div>
              <div class="toggle-label-container">
                <label for="expandedMembers">
                  Expand members
                </label>
                <Checkbox
                  id="expandedMembers"
                  v-model="expandedMembers"
                  :binary="true"
                />
              </div>
            </div>
          </div>
        </template>
        <template #empty>
          No members found.
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
      this.expandedMembers = false;
      this.expandedSets = false;
      await this.getMembers();
    },

    async expandedMembers() {
      await this.getMembers();
    },

    async expandedSets() {
      await this.getMembers();
    }
  },
  async mounted() {
    if (this.conceptIri) {
      this.expandedMembers = false;
      this.expandedSets = false;
      await this.getMembers();
    }
  },
  data() {
    return {
      loading: false,
      members: [] as any,
      selectedIncludedMember: {},
      combinedMembers: [] as any,
      listHeight: "",
      filters1: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
      },
      expandedMembers: false,
      expandedSets: false,
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
        this.expandedMembers,
        this.expandedSets,
        this.expandedMembers ? 2000 : undefined
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
        this.expandedMembers = false;
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
    }
  }
});
</script>

<style scoped>
.p-panel-header {
  all: unset;
}

.members-container {
  width: 100%;
  height: 100%;
}

.included-container {
  width: 100%;
  height: 100%;
}

.excluded-container {
  width: 50%;
}

#members-table-container {
  flex-grow: 5;
  overflow-y: auto;
}

#members-table-container ::v-deep(.p-datatable) {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

#members-table-container ::v-deep(.p-datatable-wrapper) {
  flex-grow: 6;
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
