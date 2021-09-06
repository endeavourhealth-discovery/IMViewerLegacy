<template>
  <SideNav />
  <div id="container">
    <Panel header="Mapping Wizard">
      <TabPanel>
        <div class="card">
          <Steps :model="items" :readonly="true" />
        </div>
        <router-view
          v-slot="{ Component }"
          :formData="formObject"
          @prevPage="prevPage($event)"
          @nextPage="nextPage($event)"
          @complete="complete"
        >
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </TabPanel>
    </Panel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";

export default defineComponent({
  name: "MappingWizard",
  components: {
    SideNav,
  },
  computed: {},
  data() {
    return {
      items: [
        {
          label: "Upload content",
          to: "/mapping/wizard",
        },
        {
          label: "Mapping document",
          to: "/mapping/wizard/document",
        },
        {
          label: "Document validation",
          to: "/mapping/wizard/validation/document",
        },
        {
          label: "Predicate validation",
          to: "/mapping/wizard/validation/predicate",
        },
        {
          label: "Confirmation",
          to: "/mapping/wizard/confirmation",
        },
      ],
      formObject: {
        contentFile: "",
        graph: "",
        nested: "",
        mapDocument: "",
        mapDocumentString: "",
      } as any,
    };
  },
  methods: {
    nextPage(event: any) {
      for (let field in event.formData) {
        this.formObject[field] = event.formData[field];
      }

      console.log(this.formObject);

      this.$router.push(this.items[event.pageIndex + 1].to);
    },
    prevPage(event: any) {
      this.$router.push(this.items[event.pageIndex - 1].to);
    },
  },
});
</script>

<style scoped>
#container {
  margin: 1rem;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
}

.loading-container {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

#button-bar {
  padding: 0 2rem 1rem 0;
  gap: 0.5rem;
}
</style>
