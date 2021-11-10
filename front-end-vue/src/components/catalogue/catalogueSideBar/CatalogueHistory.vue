<template>
  <div id="catalogue-history">
    <Listbox
      v-model="selected"
      :options="history"
      class="history-listbox"
      @click="navigate"
      :virtualScrollerOptions="{ itemSize: 31 }"
      style="width:100%"
      listStyle="height:700px"
    >
      <template #option="slotProps">
        <div v-if="slotProps.option.name">
          <span>{{ slotProps.option.name }}</span>
        </div>
        <div v-else>
          <span>{{ slotProps.option["@id"] }}</span>
        </div>
      </template>
    </Listbox>
  </div>
</template>

<script lang="ts">
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "CatalogueHistory",
  props: { history: { type: Object as any, required: true } },
  data() {
    return {
      selected: {} as any
    };
  },
  methods: {
    navigate() {
      if (isObjectHasKeys(this.selected, ["@id"])) {
        this.$router.push({
          name: "Individual",
          params: { selectedIri: this.selected["@id"] }
        });
      }
    }
  }
});
</script>

<style scoped></style>
