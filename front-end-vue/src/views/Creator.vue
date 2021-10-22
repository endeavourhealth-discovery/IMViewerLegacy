<template>
  <SideNav />
  <ConfirmDialog />
  <div id="creator-main-container">
    <div class="header"><span class="title">Creator</span></div>
    <div id="creator-menu-content-container">
      <Menu :model="menuItems" id="creator-side-menu" />
      <div id="content-container">
        <Steps :model="stepsItems" />
        <router-view
          :key="$route.params.slug || 'default'"
          v-if="stepsItems.length > 0"
          v-slot="{ Component }"
          :formData="formObject"
          @prevPage="prevPage($event)"
          @nextPage="nextPage($event)"
          @complete="complete"
        >
          <keep-alive :max="100">
            <component :is="Component" :pageIndex="currentPageIndex" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";

export default defineComponent({
  name: "Creator",
  components: { SideNav },
  beforeRouteLeave(to, from, next) {
    let toStepRoute = false;
    this.stepsItems.forEach((step: any) => {
      if (step.to === to.path) {
        toStepRoute = true;
      }
    });
    if (!toStepRoute) {
      this.$confirm.require({
        message: "All unsaved changes will be lost. Are you sure you want to proceed?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          next();
        }
      });
    }
  },
  watch: {
    selectedType() {
      this.setMenuItems();
    }
  },
  data() {
    return {
      selectedType: "",
      menuItems: [] as any,
      stepsItems: [] as any,
      formObject: {} as any,
      currentPageIndex: 0
    };
  },
  mounted() {
    this.setMenuItems();
  },
  methods: {
    setMenuItems(): void {
      this.menuItems = [
        {
          label: "Create new",
          items: [
            {
              label: "Concept",
              icon: "far fa-lightbulb",
              disabled: this.selectedType === "concept" ? true : false,
              style: this.selectedType === "concept" ? "box-shadow: inset 0 0 0 0.15rem #a6d5fa;" : "",
              command: () => {
                if (this.selectedType === "concept") return;
                if (this.selectedType !== "") {
                  this.$confirm.require({
                    message: "All unsaved changes will be lost. Are you sure you want to proceed?",
                    header: "Confirmation",
                    icon: "pi pi-exclamation-triangle",
                    accept: () => {
                      this.selectedType = "concept";
                      this.setStepsItems("concept");
                      this.$router.push(this.stepsItems[0].to);
                    }
                  });
                } else {
                  this.selectedType = "concept";
                  this.setStepsItems("concept");
                  this.$router.push(this.stepsItems[0].to);
                }
              }
            },
            {
              label: "Value set",
              icon: "fas fa-book-medical",
              disabled: this.selectedType === "valueset" ? true : false,
              style: this.selectedType === "valueset" ? "box-shadow: inset 0 0 0 0.15rem #a6d5fa;" : "",
              command: () => {
                if (this.selectedType === "valueset") return;
                if (this.selectedType !== "") {
                  this.$confirm.require({
                    message: "All unsaved changes will be lost. Are you sure you want to proceed?",
                    header: "Confirmation",
                    icon: "pi pi-exclamation-triangle",
                    accept: () => {
                      this.selectedType = "valueset";
                      this.setStepsItems("valueset");
                      this.$router.push(this.stepsItems[0].to);
                    }
                  });
                } else {
                  this.selectedType = "valueset";
                  this.setStepsItems("valueset");
                  this.$router.push(this.stepsItems[0].to);
                }
              }
            }
          ]
        }
      ];
    },

    setStepsItems(type: string): void {
      if (type === "concept") {
        this.stepsItems = [
          {
            label: "Definition",
            to: "/creator/definition"
          },
          {
            label: "Isa's",
            to: "/creator/isas"
          },
          {
            label: "Subtypes",
            to: "/creator/subtypes"
          },
          {
            label: "Properties",
            to: "/creator/properties"
          },
          {
            label: "Confirmation",
            to: "/creator/confirmation"
          }
        ];
      } else if (type === "valueset") {
        this.stepsItems = [
          {
            label: "Definition",
            to: "/creator/definition"
          },
          {
            label: "Members",
            to: "/creator/members"
          }
        ];
      }
    },

    nextPage(event: any) {
      for (let field in event) {
        this.formObject[field] = event[field];
      }
      if (this.currentPageIndex < this.stepsItems.length) {
        this.currentPageIndex++;
        this.$router.push(this.stepsItems[this.currentPageIndex].to);
      }
    },

    prevPage(event: any) {
      for (let field in event) {
        this.formObject[field] = event[field];
      }
      if (this.currentPageIndex > 0) {
        this.currentPageIndex--;
        this.$router.push(this.stepsItems[this.currentPageIndex].to);
      }
    },

    complete() {
      this.$toast.add({ severity: "success", summary: "Completed" });
    }
  }
});
</script>

<style scoped>
#creator-main-container {
  margin: 1rem;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  display: flex;
  flex-flow: column nowrap;
}

.header {
  border-bottom: 1px solid #dee2e6;
  border-image: initial;
  padding: 1rem;
  background: #f8f9fa;
  color: #495057;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1;
}

#creator-menu-content-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  padding: 1rem;
  flex-grow: 100;
  gap: 7px;
}

#content-container {
  height: 100%;
  width: 100%;
  overflow: auto;
}

#selection-button-container {
  height: 100%;
  width: 100%;
}
</style>
