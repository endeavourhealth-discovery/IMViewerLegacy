<template>
  <OrganizationChart :value="data">
    <template #oneOf="slotProps">
      <span>{{ slotProps.node.data.label }}</span>
    </template>
    <template #comboOf="slotProps">
      <span>{{ slotProps.node.data.label }}</span>
    </template>
    <template #childList="slotProps">
      <table>
        <thead>
          <tr>
            <th scope="col">Iri</th>
            <th scope="col">Priority</th>
            <th scope="col">Assurance level</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="label in slotProps.node.data.labels" :key="label">
            <td>{{ label.matchedTo }}</td>
            <td>{{ label.priority }}</td>
            <td v-if="label.assuranceLevel = 'http://endhealth.info/im#NationallyAssuredUK'">UK nationally assured</td>
            <td v-else>{{ label.assuranceLevel }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template #default>
      <p class="p-text-centered">None</p>
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
      data: {} as any
    };
  },
  async mounted() {
    await this.getMappings();
    this.createChartStructure();
  },
  methods: {
    async getMappings(): Promise<void> {
      await ConceptService.getComplexMappings(this.conceptIri)
        .then(res => {
          this.mappings = res.data;
        })
        .catch(err => {
          // this.$toast.add(
          //   LoggerService.error("Complex mapping request failed", err)
          // )
          this.mappings = [];
          this.data = {};
        });
    },

    createChartStructure(): void {
      let counters = { 1: 0 } as any;
      let data = {} as any;
      this.mappings.forEach(mapping => {
        counters[2] = 0;
        if (IM.ONE_OF in mapping) {
          if (counters[1] === 0) {
            data = {
              key: "" + counters[1],
              type: "oneOf",
              data: { label: "One of" },
              children: [{ key: "" + counters[1] + "_" + counters[2], type: "childList", data: {labels: []}}]
            };
          }
          mapping[IM.ONE_OF].forEach((map: any) => {
            data.children[counters[1]].data.labels.push({
              matchedTo: map[IM.MATCHED_TO]["@id"],
              priority: map[IM.MAP_PRIORITY]["@value"],
              assuranceLevel: map[IM.ASSURANCE_LEVEL]["@id"],
              mapAdvice: map[IM.MAP_ADVICE]
            })
            counters[2]++;
          });
        } else if (IM.COMBINATION_OF in  mapping) {
          if (counters[1] === 0) {
            data = {
              key: "" + counters[1],
              type: "comboOf",
              data: { label: "Combination of" },
              children: []
            };
          }
          mapping[IM.COMBINATION_OF].forEach((map: any) => {
            if (IM.ONE_OF in map) {
              counters[3] = 0;
              data.children[counters[2]] = {
                key: "" + counters[1] + "_" + counters[2],
                type: "oneOf",
                data: { label: "One of" },
                children: [{ key: "" + counters[1] + "_" + counters[2] + "_" + counters[3], type: "childList", data: { labels: [] } }]
              }
              map[IM.ONE_OF].forEach((child: any) => {
                data.children[counters[2]].children[counters[3]].data.labels.push({
                  matchedTo: child[IM.MATCHED_TO]["@id"],
                  priority: child[IM.MAP_PRIORITY]["@value"],
                  assuranceLevel: child[IM.ASSURANCE_LEVEL]["@id"],
                  mapAdvice: child[IM.MAP_ADVICE]
                });
              })
              counters[3]++
            } else if (IM.MATCHED_TO in map) {
              data.children[counters[2]] = {
                key: "" + counters[1] + "_" + counters[2],
                type: "childList",
                data: { labels: [{
                  matchedTo: map[IM.MATCHED_TO]["@id"],
                  priority: map[IM.MAP_PRIORITY]["@value"],
                  assuranceLevel: map[IM.ASSURANCE_LEVEL]["@id"],
                  mapAdvice: map[IM.MAP_ADVICE]
                }] },
              }
            }
            counters[2]++
          })
        }
        counters[1]++;
      })
      this.data = data;
    }
  }
});
</script>

<style scoped>
td,
th {
  border: 1px solid lightgray;
  padding: 0.5rem;
}

td,
th {
  text-align: left;
}

tr:nth-child(even) {
  background-color: #F8F9FA;
}

th[scope="col"] {
  background-color: #F8F9FA;
  color: #495057;
}

table {
  border-collapse: collapse;
  border: 2px solid rgb(200, 200, 200);
}
</style>
