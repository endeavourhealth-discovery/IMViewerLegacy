<template>
  <div>
    <Panel header="Summary" :toggleable="true">
      <div class="p-grid">
        <div class="p-col-4" v-if="concept.name">
          <ScrollPanel style="width: 100%; height: 100px">
            {{ concept.description }}
          </ScrollPanel>
        </div>
        <div class="p-col-4" v-if="concept.name">
          <p><strong>Name:</strong> {{ concept.name }}</p>
          <p><strong>Iri:</strong> {{ concept.iri }}</p>
          <p><strong>Code:</strong> {{ concept.code }}</p>
        </div>
        <div class="p-col-4" v-if="concept.name">
          <p><strong>Status:</strong> {{ concept.status }}</p>
          <p><strong>Scheme:</strong> {{ concept.scheme.name }}</p>
          <p><strong>Type:</strong> {{ concept.conceptType }}</p>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ConceptService from "@/services/ConceptService";
import Editor from "@/components/Editor.vue";
import store from "@/store/index";
import { mapState } from "vuex";

@Options({
  components: { Editor },
  prop: {},
  computed: mapState(["conceptAggregate"]),
  watch: {
    conceptAggregate(newValue, oldValue) {
      this.concept = newValue.concept;
    }
  }
})
export default class ConceptSummary extends Vue {
  concept = {};
}
</script>
