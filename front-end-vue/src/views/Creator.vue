<template>
  <SideNav />
  <ConfirmDialog />
  <div id="creator-main-container">
    <div class="header"><span class="title">Creator</span></div>
    <div id="creator-menu-content-container">
      <Menu :model="menuItems" id="creator-side-menu" />
      <div
        id="content-container"
        class="p-d-flex p-flex-column p-jc-center p-ai-center"
        :style="contentHeight"
      >
        <Steps :model="stepsItems" />
        <router-view
          :key="$route.params.slug || 'default'"
          v-slot="{ Component }"
          :formData="formObject"
          @prevPage="prevPage($event)"
          @nextPage="nextPage($event)"
          @complete="complete"
        >
          <keep-alive :max="100">
            <component :is="Component" />
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
    this.$confirm.require({
      message:
        "All unsaved changes will be lost. Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        next();
      }
    });
  },
  data() {
    return {
      selectedType: "",
      contentHeight: "",
      menuItems: [] as any,
      stepsItems: [] as any,
      formObject: {} as any
    };
  },
  mounted() {
    // this.$nextTick(() => {
    //   window.addEventListener("resize", this.setContentHeight);
    // });
    // this.setContentHeight();
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
              command: () => {
                this.selectedType = "concept";
                this.setStepsItems("concept");
              }
            },
            {
              label: "Value set",
              icon: "fas fa-book-medical",
              command: () => {
                this.selectedType = "valueset";
                this.setStepsItems("valueset");
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
            label: "IMLang",
            to: "/creator/imlang"
          },
          {
            label: "Members",
            to: "/creator/members"
          }
        ];
      }
    },

    nextPage(event: any) {
      for (let field in event.formData) {
        this.formObject[field] = event.formData[field];
      }
      this.$router.push(this.stepsItems[event.pageIndex + 1].to);
    },

    prevPage(event: any) {
      this.$router.push(this.stepsItems[event.pageIndex - 1].to);
    },

    complete() {
      this.$toast.add({ severity: "success", summary: "Completed" });
    },

    // setContentHeight(): void {
    //   const container = document.getElementById(
    //     "creator-main-container"
    //   ) as HTMLElement;
    //   const header = container.getElementsByClassName(
    //     "p-panel-header"
    //   )[0] as HTMLElement;
    //   const content = container.getElementsByClassName(
    //     "p-panel-content"
    //   )[0] as HTMLElement;
    //   const currentFontSize = parseFloat(
    //     window
    //       .getComputedStyle(document.documentElement, null)
    //       .getPropertyValue("font-size")
    //   );
    //   if (container && header && currentFontSize && content) {
    //     header.style.border = "none";
    //     header.style.borderBottom = "1px solid #dee2e6";
    //     content.style.border = "none";
    //     const height =
    //       container.getBoundingClientRect().height -
    //       header.getBoundingClientRect().height -
    //       currentFontSize * 2 -
    //       2;
    //     this.contentHeight = "height: " + height + "px";
    //   }
    // }
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

#creator-menu-content-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
}

#content-container {
  padding: 1rem;
  height: 100%;
  width: 100%;
}

#selection-button-container {
  height: 100%;
  width: 100%;
}
</style>
