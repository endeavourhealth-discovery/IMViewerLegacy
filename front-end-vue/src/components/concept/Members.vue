<template>
  <div class="p-d-flex p-flex-row members-container">
    <div class="included-container">
      <div class="p-d-flex p-flex-row p-jc-center" v-if="loading">
        <div class="spinner">
          <ProgressSpinner />
        </div>
      </div>
      <Listbox
        v-else
        :listStyle="listHeight"
        :filter="true"
        emptyMessage="No results found"
        emptyFilterMessage="No results found"
        v-model="selectedIncludedMember"
        @change="onNodeSelect(selectedIncludedMember.member)"
        :options="combinedMembers"
      >
        <template #option="slotProps">
          <div>
            <span>
              <div>
                <i
                  v-if="slotProps.option.included"
                  class="pi pi-plus"
                  style="fontSize: 0.7rem"
                  aria-hidden="true"
                ></i>
                <i
                  v-if="!slotProps.option.included"
                  class="pi pi-minus"
                  style="fontSize: 0.7rem"
                  aria-hidden="true"
                ></i>
                {{
                  slotProps.option.member?.entity.name ||
                    slotProps.option.member?.entity["@id"]
                }}
              </div>
            </span>
          </div>
        </template>
      </Listbox>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import EntityService from "@/services/EntityService";

export default defineComponent({
  name: "Members",
  components: {},
  props: {
    conceptIri: String
  },
  watch: {
    async conceptIri(newValue) {
      await this.getMembers(newValue);
    }
  },
  async mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.setListboxHeight);
    });

    this.setListboxHeight();

    if (this.conceptIri) {
      await this.getMembers(this.conceptIri);
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
      listHeight: ""
    };
  },
  methods: {
    async getMembers(iri: string) {
      this.loading = true;
      this.members = (await EntityService.getEntityMembers(iri, false)).data;
      this.loading = false;
      this.combinedMembers = this.getCombinedMembers();
    },
    getCombinedMembers() {
      const combinedMembers: { included: boolean; member: any }[] = [];
      this.members?.included?.forEach((included: any) => {
        const member = { included: true, member: included };
        combinedMembers.push(member);
      });
      this.members?.excluded?.forEach((included: any) => {
        const member = { included: false, member: included };
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
