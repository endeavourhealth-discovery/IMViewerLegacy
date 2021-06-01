<template>
  <span v-if="!mappings.length">None</span>
  <OrganizationChart v-else :value="data">
    <template #root="slotProps">
      <span>{{ slotProps.node.data.label }}</span>
    </template>
    <template #childList="slotProps">
      <p v-for="label in slotProps.node.data.labels" :key="label">{{ label }}</p>
    </template>
  </OrganizationChart>
</template>

<script lang="ts">
import ConceptService from "@/services/ConceptService";
import LoggerService from "@/services/LoggerService";
import { IM } from "@/vocabulary/IM";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ComplexMappings",
  props: ["conceptIri"],
  watch: {
    async conceptIri() {
      await this.getMappings();
      this.createChartStructure();
    }
  },
  data() {
    return {
      mappings: [] as any[],
      data: {
        key: "0",
        data: {label: "Hi"},
        children: [
          {
            key: "0_0",
            data: {labels: ["Child hi!"]}
          }
        ]
      } as { key: string, type: string, data: { label: string }, children: { key: string, type: string, data: { labels: string[] } }[] }
    };
  },
  async mounted() {
    await this.getMappings();
    this.createChartStructure();
  },
  methods: {
    async getMappings() {
      await ConceptService.getComplexMappings(this.conceptIri)
        .then(res => {
          this.mappings = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error("Complex mapping request failed", err)
          )
        });
    },

    createChartStructure() {
      let counter1 = 0;
      let counter2 = 0;
      this.mappings.forEach(mapping => {
        if (IM.ONE_OF in mapping) {
          this.data = {
            key: "" + counter1,
            type: "root",
            data: { label: "One of" },
            children: [{ key: "" + counter1 + "_" + counter2, type: "childList", data: {labels: []}}]
          }
        }
        mapping[IM.ONE_OF].forEach((map: any) => {
          this.data.children[0].data.labels.push(
            map[IM.MATCHED_TO]["@id"]
          )
          counter2++;
        });
        counter1++;
      })
    }
  }
});
</script>

<style scoped>

</style>
