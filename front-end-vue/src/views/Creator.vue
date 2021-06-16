<template>
  <SideNav />
  <ConfirmDialog />
  <div id="creator-main-container">
    <Panel header="Creator">
      <div v-if="!createType" id="landing-page-container" class="p-d-flex p-flex-column p-jc-center p-ai-center">
        <div
          id="selection-button-container"
          class="p-d-flex p-flex-row p-jc-evenly p-ai-center"
          :style="contentHeight"
        >
          <Button
            label="Create oncept"
            class="p-button-rounded p-button-lrg p-button-success"
          />
          <Button
            label="Create value set"
            class="p-button-rounded p-button-lrg p-button-help"
          />
        </div>
      </div>
    </Panel>
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
      createType: null,
      contentHeight: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.setContentHeight);
    });
    this.setContentHeight();
  },
  methods: {
    setContentHeight(): void {
      const container = document.getElementById(
        "creator-main-container"
      ) as HTMLElement;
      const header = container.getElementsByClassName(
        "p-panel-header"
      )[0] as HTMLElement;
      const content = container.getElementsByClassName(
        "p-panel-content"
      )[0] as HTMLElement;
      const currentFontSize = parseFloat(
        window
          .getComputedStyle(document.documentElement, null)
          .getPropertyValue("font-size")
      );
      if (container && header && currentFontSize && content) {
        header.style.border = "none";
        header.style.borderBottom = "1px solid #dee2e6";
        content.style.border = "none";
        const height =
          container.getBoundingClientRect().height -
          header.getBoundingClientRect().height -
          currentFontSize * 2 -
          2;
        this.contentHeight = "height: " + height + "px";
      }
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
}

#landing-page-container {
  height: 100%;
  width: 100%;
}

#selection-button-container {
  height: 100%;
  width: 100%;
}
</style>
