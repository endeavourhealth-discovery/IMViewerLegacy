<template>
  <Dialog header="Join on properties" v-model:visible="jsonSelectDialog" :breakpoints="{ '960px': '75vw' }" :style="{ width: '75vw' }">
    {{ input }}
    <template #footer>
      <Button label="Cancel" class="p-button-text" icon="pi pi-times" @click="closeJsonSelectDialog" />
      <Button label="Update" icon="pi pi-check" @click="jsonSelect" />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { TransformInputUpload } from "@/models/transform/TransformInputUpload";

export default defineComponent({
  name: "JsonPathSelectionDialog",
  emits: ["jsonSelect", "closeJsonSelectDialog"],
  props: {
    input: {
      type: Object as PropType<TransformInputUpload>,
      required: true
    },
    jsonSelectDialog: {
      type: Boolean,
      required: true
    }
  },
  computed: {},
  data() {
    return {
      jsonSelected: [] as any[],
      jsonPathOptions: ["flat", "nested"]
    };
  },
  methods: {
    closeJsonSelectDialog() {
      this.$emit("closeJsonSelectDialog", {});
    },
    jsonSelect() {
      this.$emit("jsonSelect", this.jsonSelected);
      this.$emit("closeJsonSelectDialog", {});
    }
  }
});
</script>
