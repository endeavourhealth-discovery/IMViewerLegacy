<template>
  <div class="p-d-flex p-flex-row members-container">
    <div class="included-container">
      <div class="p-d-flex p-flex-row p-jc-center" v-if="loading">
        <div class="spinner">
          <ProgressSpinner/>
        </div>
      </div>
      <DataTable
          :value="combinedMembers"
          responsiveLayout="scroll"
          showGridlines
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[10,20,50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
          currentPageReportTemplate="Displaying {first} to {last} of {totalRecords} results"
          rowGroupMode="subheader"
          groupRowsBy="status"
          v-model:filters="filters1"
          filterDisplay="menu"
          :globalFilterFields="['member.code','member.entity.name','member.scheme.name','status']"
          :scrollable="true"
          class="p-datatable-sm"
          scrollHeight="flex"
      >
        <template #header>
          <div class="p-d-flex p-jc-between">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters1['global'].value" placeholder="Keyword Search" />
            </span>
            <div class="p-grid p-mx-2 p-align-center">
              <Checkbox id="expanded" v-model="expanded" v-on:change="expandMembers" :binary="true"/>
              <label for="expanded" class="p-mx-1">Expanded</label>
            </div>
          </div>
        </template>
        <template #empty>
          No members found.
        </template>
        <Column field="member.entity.name" header="Name" :sortable="true" filter-field="member.entity.name" style="flex: 0 0 60%"/>
        <Column field="member.code" header="Code" :sortable="true" filter-field="member.code"/>
        <Column field="member.scheme.name" header="Scheme" :sortable="true" filter-field="member.scheme.name"/>
        <template #groupheader="slotProps">
          <span style="font-weight: 700; color:rgba(51,153,255,0.8)" v-if="slotProps.data.status===include">
            Included
          </span>
          <span style="font-weight: 700; color:rgba(51,153,255,0.8)" v-else>
            Excluded
          </span>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import EntityService from "@/services/EntityService";
import {FilterMatchMode} from "primevue/api";

export default defineComponent({
  name: "Members",
  components: {},
  props: {
    conceptIri: String
  },
  watch: {
    async conceptIri() {
      await this.getMembers();
    }
  },
  async mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.setListboxHeight);
    });

    this.setListboxHeight();

    if (this.conceptIri) {
      await this.getMembers();
    }
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setListboxHeight);
  },
  data() {
    return {
      loading: false,
      members: [] as any,
      selectedIncludedMember: {},
      combinedMembers: [] as any,
      listHeight: "",
      filters1:{
        'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
      },
      expanded: false,
      include:"Included"
    };
  },
  methods: {
    async getMembers() {
      this.expanded = false;
      await this.expandMembers();
    },
    async expandMembers(){
      if(this.expanded) {
        this.loading = true;
        this.members = (await EntityService.getEntityMembers(this.conceptIri as string, true)).data;
        this.loading = false;
        this.combinedMembers = this.getCombinedMembers();
      }else {
        this.loading = true;
        this.members = (await EntityService.getEntityMembers(this.conceptIri as string, false)).data;
        this.loading = false;
        this.combinedMembers = this.getCombinedMembers();
      }
    },
    getCombinedMembers() {
      const combinedMembers: { status: string; member: any }[] = [];
      this.members?.included?.forEach((included: any) => {
        const member = {status: "Included", member: included};
        combinedMembers.push(member);
      });
      this.members?.excluded?.forEach((excluded: any) => {
        const member = {status: "Excluded", member: excluded};
        combinedMembers.push(member);
      });
      return combinedMembers;
    },
    onNodeSelect(member: any) {
      this.$router.push({
        name: "Concept",
        params: {selectedIri: member.concept["@id"]}
      });
    },

    toggle(event: any) {
      const x = this.$refs.menu as any;
      x.toggle(event);
    },

    setListboxHeight(): void {
      const container = document.getElementById(
          "members-container"
      ) as HTMLElement;
      const listHeader = container.getElementsByClassName(
          "p-listbox-header"
      )[0] as HTMLElement;
      if (container && listHeader) {
        const newHeight =
            container.getBoundingClientRect().height -
            listHeader.getBoundingClientRect().height -
            7;
        this.listHeight = "height: " + newHeight + "px;";
      }
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


</style>
