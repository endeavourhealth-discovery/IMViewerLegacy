<template>
  <Listbox
    v-model="selectedHistoryItem"
    :options="history()"
    optionLabel="conceptName"
    @click="navigate"
    class="history-listbox"
  >
    <template #option="slotProps">
      <div>
        <span>{{ slotProps.option.conceptName }}</span>
        <Divider />
      </div>
    </template>
  </Listbox>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import { HistoryItem } from "@/models/HistoryItem";

export default defineComponent({
  name: "History",
  data() {
    return {
      selectedHistoryItem: {} as HistoryItem
    };
  },
  methods: {
    history(): any {
      const viewHistory = store.state.history.filter(obj => {
        return !!obj.conceptName;
      });
      return viewHistory;
    },

    navigate(): void {
      this.$router.push(this.selectedHistoryItem.url);
    }
  }
});
</script>

<style scoped>
.history-listbox {
  height: 100%;
  overflow: auto;
}
</style>
