<template>
  <Listbox
    v-model="selectedHistoryItem"
    :options="history"
    optionLabel="conceptName"
    @click="navigate"
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
import { Options, Vue } from "vue-class-component";
import store from "@/store/index";
import { HistoryItem } from "@/models/HistoryItem";

@Options({
  components: {}
})
export default class History extends Vue {
  selectedHistoryItem: HistoryItem = {} as HistoryItem;

  get history() {
    const viewHistory = store.state.history.filter(obj => {
      return !!obj.conceptName;
    });
    return viewHistory;
  }

  navigate() {
    this.$router.push(this.selectedHistoryItem.url);
  }
}
</script>

<style></style>
