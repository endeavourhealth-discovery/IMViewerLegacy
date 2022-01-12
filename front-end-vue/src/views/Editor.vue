<template>
  <SideNav />
  <ConfirmDialog></ConfirmDialog>
  <div id="editor-main-container">
    <div class="loading-container p-d-flex p-flex-row p-jc-center p-ai-center" v-if="loading">
      <ProgressSpinner />
    </div>
    <Panel v-else header="Editor">
      <TabView v-model:activeIndex="active">
        <TabPanel header="Form">
          <div class="panel-content" id="form-editor-container" :style="contentHeight">
            <FormEditor
              v-if="active === 0 && isObjectHasKeysWrapper(conceptUpdated)"
              :iri="iri"
              :updatedConcept="conceptUpdated"
              @concept-updated="updateConcept"
            />
          </div>
        </TabPanel>
        <TabPanel v-if="isValueSet" header="Members">
          <div class="panel-content" id="member-editor-container" :style="contentHeight">
            <MemberEditor
              v-if="active === 1 && isObjectHasKeysWrapper(membersUpdated)"
              :iri="iri"
              :contentHeight="contentHeight"
              :updatedMembers="membersUpdated"
              @members-updated="updateMembers"
            />
          </div>
        </TabPanel>
      </TabView>
    </Panel>
    <div class="button-bar p-d-flex p-flex-row p-jc-end" id="editor-button-bar">
      <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" @click="$router.go(-1)" />
      <Button icon="pi pi-refresh" label="Reset" class="p-button-warning" @click="refreshEditor" />
      <Button icon="pi pi-check" label="Save" class="save-button" @click="submit" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import FormEditor from "@/components/edit/FormEditor.vue";
import EntityService from "@/services/EntityService";
import ConfirmDialog from "primevue/confirmdialog";
import MemberEditor from "@/components/edit/MemberEditor.vue";
import { isValueSet } from "@/helpers/ConceptTypeMethods";
import { RDF } from "@/vocabulary/RDF";
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import { getContainerElementOptimalHeight } from "@/helpers/GetContainerElementOptimalHeight";

export default defineComponent({
  name: "Editor",
  components: {
    SideNav,
    ConfirmDialog,
    FormEditor,
    MemberEditor
  },
  beforeRouteLeave(to, from, next) {
    if (this.checkForChanges()) {
      this.$confirm.require({
        message: "All unsaved changes will be lost. Are you sure you want to proceed?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          next();
        }
      });
    } else {
      next();
    }
  },
  computed: {
    isValueSet(): any {
      return isValueSet(this.conceptOriginal[RDF.TYPE]);
    }
  },
  data() {
    return {
      iri: this.$route.params.iri?.toString(),
      conceptOriginal: {} as any,
      conceptUpdated: {} as any,
      membersOriginal: {} as any,
      membersUpdated: {} as any,
      active: 0,
      contentHeight: "",
      loading: false
    };
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.fetchConceptData();
    this.onResize();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize(): void {
      this.setContentHeight();
      this.removeBorders();
    },

    async fetchConceptData(): Promise<void> {
      this.loading = true;
      if (this.iri) {
        const fullEntity = await EntityService.getFullEntity(this.iri);
        if (fullEntity) {
          this.conceptOriginal = fullEntity;
          this.conceptUpdated = JSON.parse(JSON.stringify(fullEntity));
        }

        const membersReturn = await EntityService.getEntityMembersAsNode(this.iri, false, false);
        if (membersReturn) {
          this.membersOriginal = membersReturn;
          this.membersUpdated = JSON.parse(JSON.stringify(membersReturn));
        }
      }
      this.loading = false;
    },

    submit(): void {
      console.log("submit");
    },

    updateMembers(data: any) {
      this.membersUpdated = data;
    },

    updateConcept(data: any) {
      this.conceptUpdated = data;
    },

    checkForChanges() {
      if (
        JSON.stringify(this.membersUpdated) === JSON.stringify(this.membersOriginal) &&
        JSON.stringify(this.conceptUpdated) === JSON.stringify(this.conceptOriginal)
      ) {
        return false;
      } else {
        return true;
      }
    },

    refreshEditor(): void {
      this.conceptUpdated = {};
      this.membersUpdated = {};
    },

    isObjectHasKeysWrapper(object: any): boolean {
      return isObjectHasKeys(object);
    },

    setContentHeight(): void {
      this.contentHeight =
        "height: " +
        getContainerElementOptimalHeight("editor-main-container", ["p-panel-header", "p-tabview-nav", "button-bar", "p-panel-content"], true, 3, 2);
    },

    removeBorders(): void {
      const container = document.getElementById("editor-main-container") as HTMLElement;
      const header = container.getElementsByClassName("p-panel-header")[0] as HTMLElement;
      const content = container.getElementsByClassName("p-panel-content")[0] as HTMLElement;
      if (header && content) {
        header.style.border = "none";
        header.style.borderBottom = "1px solid #dee2e6";
        content.style.border = "none";
        content.style.paddingBottom = "0";
      }
    }
  }
});
</script>

<style scoped>
#editor-main-container {
  margin: 1rem;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
}

.placeholder {
  height: 100%;
}

#editor-button-bar {
  padding: 0 2rem 1rem 0;
  gap: 0.5rem;
}
</style>
