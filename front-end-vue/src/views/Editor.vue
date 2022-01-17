<template>
  <SideNav />
  <ConfirmDialog></ConfirmDialog>
  <div id="editor-main-container">
    <div class="loading-container p-d-flex p-flex-row p-jc-center p-ai-center" v-if="loading">
      <ProgressSpinner />
    </div>
    <div v-else class="panel-buttons-container">
      <Panel header="Editor">
        <div class="content-json-container">
          <div class="content">
            <TabView v-model:activeIndex="active">
              <TabPanel header="Form">
                <div class="panel-content" id="form-editor-container" :style="contentHeight">
                  <SummaryEditor
                    v-if="active === 0 && isObjectHasKeysWrapper(conceptUpdated)"
                    :contentHeight="contentHeight"
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
          </div>
          <div class="json-container">
            <span>JSON viewer</span>
            <VueJsonPretty v-if="isObjectHasKeysWrapper(conceptUpdated)" class="json" :path="'res'" :data="conceptUpdated" @click="handleClick" />
          </div>
        </div>
      </Panel>
      <div class="button-bar p-d-flex p-flex-row p-jc-end" id="editor-button-bar">
        <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" @click="$router.go(-1)" />
        <Button icon="pi pi-refresh" label="Reset" class="p-button-warning" @click="refreshEditor" />
        <Button icon="pi pi-check" label="Save" class="save-button" @click="submit" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import SummaryEditor from "@/components/edit/SummaryEditor.vue";
import EntityService from "@/services/EntityService";
import ConfirmDialog from "primevue/confirmdialog";
import MemberEditor from "@/components/edit/MemberEditor.vue";
import { isValueSet } from "@/helpers/ConceptTypeMethods";
import { RDF } from "@/vocabulary/RDF";
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import { getContainerElementOptimalHeight } from "@/helpers/GetContainerElementOptimalHeight";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

export default defineComponent({
  name: "Editor",
  components: {
    SideNav,
    ConfirmDialog,
    SummaryEditor,
    MemberEditor,
    VueJsonPretty
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
      return isValueSet(this.conceptUpdated[RDF.TYPE]);
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
    this.loading = true;
    window.addEventListener("resize", this.onResize);
    this.fetchConceptData();
    this.onResize();
    this.loading = false;
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize(): void {
      this.setContentHeight();
    },

    async fetchConceptData(): Promise<void> {
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
    },

    submit(): void {
      console.log("submit");
    },

    updateMembers(data: any) {
      this.membersUpdated = data;
    },

    updateConcept(data: any) {
      console.log("update");
      console.log(data);
      for (const [key, value] of Object.entries(data)) {
        this.conceptUpdated[key] = value;
      }
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
      this.conceptUpdated = { ...this.conceptOriginal };
      this.membersUpdated = { ...this.membersOriginal };
    },

    isObjectHasKeysWrapper(object: any): boolean {
      return isObjectHasKeys(object);
    },

    setContentHeight(): void {
      this.contentHeight =
        "height: " + getContainerElementOptimalHeight("editor-main-container", ["p-panel-header", "p-tabview-nav", "button-bar"], true, 4, 4);
    },

    handleClick(data: any) {
      console.log("click");
      console.log(data);
    }
  }
});
</script>

<style scoped>
@media screen and (max-width: 1439px) {
  #editor-main-container {
    width: 92vw;
  }
}

@media screen and (min-width: 1440px) {
  #editor-main-container {
    width: calc(100vw - 115px);
  }
}

#editor-main-container {
  margin: 1rem;
  height: calc(100vh - 2rem);
  overflow-y: auto;
}

.panel-buttons-container {
  height: 100%;
  width: 100%;
}

.loading-container {
  width: 100%;
  height: 100%;
}

.content-json-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  gap: 1rem;
}

.json-container {
  width: 50%;
  height: 100%;
}

.content {
  width: 50%;
  height: 100%;
}

.json {
  height: 100%;
  width: 100%;
  border: 1px #dee2e6 solid;
  border-radius: 3px;
}

.placeholder {
  height: 100%;
}

.panel-content {
  overflow-y: auto;
}

#editor-button-bar {
  padding: 1rem 1rem 1rem 0;
  gap: 0.5rem;
  width: 100%;
  border-bottom: 1px solid #dee2e6;
  border-left: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;
  border-radius: 3px;
  background-color: #ffffff;
}
</style>
