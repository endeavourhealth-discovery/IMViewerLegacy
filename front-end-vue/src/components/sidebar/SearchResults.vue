<template>SearchResults</template>

<script lang="ts">
import { SearchResponse } from "@/models/search/SearchResponse";
import { Options, Vue } from "vue-class-component";
import { mapState } from "vuex";


@Options({
  components: {},
  computed: mapState(["searchResults"]),
  watch: {
    searchResults(newValue, oldValue) {
      this.results = newValue;
    }
  }
})
export default class SearchResults extends Vue {
  results: SearchResponse = new SearchResponse();
}
</script>

<style>
</style>