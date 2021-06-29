<template>
  <div
    class="p-d-flex p-flex-row p-jc-center p-ai-center loading -container"
    v-if="$store.state.loading.get('mappings')"
  >
    <ProgressSpinner />
  </div>
  <OrganizationChart v-else :value="data">
    <template #hasMap="slotProps">
      <span>{{ slotProps.node.data.label }}</span>
    </template>
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
            v-for="mapItem in slotProps.node.data.mapItems"
            :key="mapItem"
            @mouseenter="toggle($event, mapItem)"
            @mouseleave="toggle($event, mapItem)"
          >
            <td>{{ mapItem.name }}</td>
            <td>{{ mapItem.priority }}</td>
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
      this.data = this.createChartStructure(
        "0",
        this.mappings,
        this.data,
        0,
        0
      );
      this.$store.commit("updateLoading", {
        key: "mappings",
        value: false
      });
    }
  },
  data() {
    return {
      mappings: {} as any,
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
    this.data = this.createChartStructure("0", this.mappings, this.data, 0, 0);
    this.$store.commit("updateLoading", {
      key: "mappings",
      value: false
    });
  },
  methods: {
    async getMappings(): Promise<void> {
      await EntityService.getPartialEntity(this.conceptIri, [IM.HAS_MAP])
        .then(res => {
          this.mappings = res.data || {};
          this.data = {};
        })
        .catch(() => {
          this.mappings = [];
          this.data = {};
        });
    },

    createChartTableNodeObject(
      items: {
        assuranceLevel: string;
        iri: string;
        mapAdvice: string;
        name: string;
        priority: number;
      },
      location: string,
      position: number
    ): {
      key: string;
      type: string;
      data: any;
    } {
      return {
        key: location + "_" + position,
        type: "childList",
        data: { mapItems: items }
      };
    },

    createChartMapNode(
      item: string,
      location: string,
      positionInLevel: number
    ): {
          key: string;
          type: string;
          data: { label: string };
          children: any[];
        } | undefined {
      if (item === IM.HAS_MAP) {
        return {
          key: "0",
          type: "hasMap",
          data: { label: "Has map" },
          children: []
        };
      }
      if (item === IM.ONE_OF) {
        return {
          key: location + "_" + positionInLevel,
          type: "oneOf",
          data: { label: "One of" },
          children: []
        };
      }
      if (item === IM.COMBINATION_OF) {
        return {
          key: location + "_" + positionInLevel,
          type: "comboOf",
          data: { label: "Combination of" },
          children: []
        };
      }
      if (item === IM.SOME_OF) {
        return {
          key: location + "_" + positionInLevel,
          type: "someOf",
          data: { label: "Some of" },
          children: []
        };
      }
    },

    createChartStructure(
      location: string,
      object: any,
      result: any,
      level: number,
      positionInLevel: number
    ): any {
      for (const [key, value] of Object.entries(object)) {
        if (Array.isArray(value)) {
          const mapNode = this.createChartMapNode(
            key,
            location,
            positionInLevel
          );
          result = this.addToData(mapNode, result, level);
          let count = 0;
          value.forEach(item => {
            this.data = this.createChartStructure(
              location,
              item,
              result,
              level + 1,
              count
            );
            count++;
          });
        } else {
          const tableNode = this.createChartTableNodeObject(
            value as {
              assuranceLevel: string;
              iri: string;
              mapAdvice: string;
              name: string;
              priority: number;
            },
            location,
            positionInLevel
          );
          result = this.addToData(tableNode, result, level);
        }
      }
      return result;
    },

    addToData(node: any, result: any, level: number) {
      console.log(result);
      console.log(node);
      console.log(level);
      if (level === 0) {
        result = node;
        return result;
      }
      if (level === 1) {
        result.children.push(node);
        return result;
      }
      if (level === 2) {
        result.children.children.push(node);
        return result;
      }
      if (level === 3) {
        result.children.children.children.push(node);
        return result;
      }
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
