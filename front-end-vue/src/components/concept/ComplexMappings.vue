<template>
  <div
    class="p-d-flex p-flex-row p-jc-center p-ai-center loading -container"
    v-if="$store.state.loading.get('mappings')"
  >
    <ProgressSpinner />
  </div>
  <OrganizationChart v-else :value="data">
    <template #oneOf="slotProps">
      <span>{{ slotProps.node.data.label }}</span>
    </template>
    <template #comboOf="slotProps">
      <span>{{ slotProps.node.data.label }}</span>
    </template>
    <template #childList="slotProps">
      <table aria-label="Concept map children">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Priority</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="label in slotProps.node.data.labels"
            :key="label"
            @mouseenter="toggle($event, label)"
            @mouseleave="toggle($event, label)"
          >
            <td>{{ label.name }}</td>
            <td>{{ label.priority }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template #default>
      <p class="p-text-centered">None</p>
    </template>
  </OrganizationChart>

  <OverlayPanel ref="opMap" id="overlay-panel-maps">
    <div class="p-d-flex p-flex-column p-jc-start map-overlay">
      <p><strong>Name: </strong>{{ hoveredResult.name }}</p>
      <p><strong>Iri: </strong>{{ hoveredResult.iri }}</p>
      <p><strong>Priority: </strong>{{ hoveredResult.priority }}</p>
      <p>
        <strong>Assurance level: </strong>
        {{ hoveredResult.assuranceLevel }}
      </p>
    </div>
  </OverlayPanel>
</template>

<script lang="ts">
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { IM } from "@/vocabulary/IM";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ComplexMappings",
  props: ["conceptIri"],
  watch: {
    async conceptIri() {
      this.$store.commit("updateLoading", {
        key: "mappings",
        value: true
      });
      await this.getMappings();
      this.createChartStructure();
      this.$store.commit("updateLoading", {
        key: "mappings",
        value: false
      });
    }
  },
  data() {
    return {
      mappings: [] as any[],
      data: {} as any,
      hoveredResult: {} as any
    };
  },
  async mounted() {
    this.$store.commit("updateLoading", {
      key: "mappings",
      value: true
    });
    await this.getMappings();
    this.createChartStructure();
    this.$store.commit("updateLoading", {
      key: "mappings",
      value: false
    });
  },
  methods: {
    async getMappings(): Promise<void> {
      await EntityService.getPartialEntity(this.conceptIri, [IM.HAS_MAP])
        .then(res => {
          this.mappings = res.data[IM.HAS_MAP] || [];
        })
        .catch(() => {
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
              children: [
                {
                  key: "" + counters[1] + "_" + counters[2],
                  type: "childList",
                  data: { labels: [] }
                }
              ]
            };
          }
          mapping[IM.ONE_OF].forEach((map: any) => {
            data.children[counters[1]].data.labels.push({
              name: map[IM.MATCHED_TO].name,
              iri: map[IM.MATCHED_TO]["@id"],
              priority: map[IM.MAP_PRIORITY],
              assuranceLevel: map[IM.ASSURANCE_LEVEL].name,
              mapAdvice: map[IM.MAP_ADVICE]
            });
            counters[2]++;
          });
          data.children[counters[1]].data.labels.sort(this.byPriority);
          counters[1]++;
        } else if (IM.COMBINATION_OF in mapping) {
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
                children: [
                  {
                    key:
                      "" + counters[1] + "_" + counters[2] + "_" + counters[3],
                    type: "childList",
                    data: { labels: [] }
                  }
                ]
              };
              map[IM.ONE_OF].forEach((child: any) => {
                data.children[counters[2]].children[
                  counters[3]
                ].data.labels.push({
                  name: child[IM.MATCHED_TO].name,
                  iri: child[IM.MATCHED_TO]["@id"],
                  priority: child[IM.MAP_PRIORITY],
                  assuranceLevel: child[IM.ASSURANCE_LEVEL].name,
                  mapAdvice: child[IM.MAP_ADVICE]
                });
              });
              data.children[counters[2]].children[counters[3]].data.labels.sort(
                this.byPriority
              );
              counters[3]++;
            } else if (IM.MATCHED_TO in map) {
              data.children[counters[2]] = {
                key: "" + counters[1] + "_" + counters[2],
                type: "childList",
                data: {
                  labels: [
                    {
                      name: map[IM.MATCHED_TO].name,
                      iri: map[IM.MATCHED_TO]["@id"],
                      priority: map[IM.MAP_PRIORITY],
                      assuranceLevel: map[IM.ASSURANCE_LEVEL].name,
                      mapAdvice: map[IM.MAP_ADVICE]
                    }
                  ]
                }
              };
              data.children[counters[2]].data.labels.sort(this.byPriority);
            }
            counters[2]++;
          });
          counters[1]++;
        } else {
          LoggerService.warn(
            undefined,
            "No 'On of' or 'Combination of' found on concept for concept mapping"
          );
        }
      });
      this.data = data;
    },

    byPriority(a: any, b: any): number {
      if (a.priority < b.priority) {
        return -1;
      } else if (a.priority > a.priority) {
        return 1;
      } else {
        return 0;
      }
    },

    toggle(event: any, data: any): void {
      this.hoveredResult = data;
      const x = this.$refs.opMap as any;
      x.toggle(event);
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
  background-color: #f8f9fa;
}

th[scope="col"] {
  background-color: #f8f9fa;
  color: #495057;
}

table {
  border-collapse: collapse;
  border: 2px solid rgb(200, 200, 200);
}

td,
th {
  overflow-wrap: break-word;
}

.p-organizationchart {
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
