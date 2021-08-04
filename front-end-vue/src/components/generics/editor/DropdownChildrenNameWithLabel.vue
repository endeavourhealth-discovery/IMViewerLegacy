<template>
  <div class="p-field float-label-container">
    <span class="p-float-label">
      <Dropdown
        class="p-inputtext-lg"
        v-model="editObject"
        :options="dropdownOptions"
        optionLabel="name"
        placeholder="Select an option"
      />
      <label>{{ label }}</label>
    </span>
  </div>
</template>

<script lang="ts">
import { ConceptReference } from "@/models/ConceptReference";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { defineComponent } from "vue";

export default defineComponent({
  name: "DropdownChildrenNameWithLabel",
  props: {
    label: { type: String },
    data: { type: Object },
    size: { type: String },
    predicate: { type: String }
  },
  emits: ["DropdownChildrenNameWithLabelUpdated"],
  watch: {
    editObject(newValue) {
      this.$emit("DropdownChildrenNameWithLabelUpdated", {
        predicate: this.predicate,
        data: newValue
      });
    }
  },
  async mounted() {
    if (this.predicate) {
      await EntityService.getEntityChildren(this.predicate)
        .then(res => {
          this.dropdownOptions = res.data;
          this.editObject = this.dropdownOptions
            .map(option => option.name)
            .includes(this.editObject.name)
            ? this.editObject
            : {};
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error(
              "Error fetching " + this.label + " options from server",
              err
            )
          );
        });
    }
  },
  data() {
    return {
      dropdownOptions: [] as ConceptReference[],
      editObject: {} as any
    };
  }
});
</script>

<style scoped></style>
