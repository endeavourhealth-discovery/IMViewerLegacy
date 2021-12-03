<template>
  <SideNav />
  <div id="container">
    <Panel header="Transform">
      <div class="card">
        <Steps :model="items" :readonly="true" />
      </div>
      <div id="content">
        <router-view v-slot="{ Component }" :formObject="formObject" @prevPage="prevPage($event)" @nextPage="nextPage($event)">
          <component :is="Component" />
        </router-view>
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import TransformFormObject from "../models/transform/TransformFormObject";

export default defineComponent({
  name: "Transform",
  components: {
    SideNav
  },
  computed: {},
  data() {
    return {
      items: [
        {
          label: "Upload",
          to: "/transform"
        },
        {
          label: "Data model",
          to: "/transform/datamodel"
        },
        {
          label: "Mapping",
          to: "/transform/mapping"
        },
        {
          label: "Document validation",
          to: "/mapping/wizard/validation/document"
        },
        {
          label: "Predicate validation",
          to: "/mapping/wizard/validation/predicate"
        },
        {
          label: "Confirmation",
          to: "/mapping/wizard/confirmation"
        }
      ],
      formObject: {} as TransformFormObject
    };
  },
  methods: {
    nextPage(event: any) {
      for (let field in event.formData) {
        (this.formObject as any)[field] = event.formData[field];
      }

      this.$router.push(this.items[event.pageIndex + 1].to);
    },
    prevPage(event: any) {
      this.$router.push(this.items[event.pageIndex - 1].to);
    }
  }
});
</script>

<style scoped>
#container {
  margin: 1rem;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: hidden;
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

#content {
  height: calc(100vh - 14rem);
  border: unset;
}
</style>
