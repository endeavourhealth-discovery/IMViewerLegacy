<template>
  <div id="instance-details-container">
    <Panel>
      <template #header>
        {{ instanceName ? instanceName : instanceIri }}
      </template>
      <Tree :value="instanceData">
        <template #default="slotProps"> {{ slotProps.node.label }} {{ slotProps.node.data }} </template>
        <template #address="slotProps">
          {{ slotProps.node.label }}
          <a href="javascript:void(0)" @click="navigate(slotProps.node.data)">{{ slotProps.node.data["@id"] }}</a>
        </template>
      </Tree>
    </Panel>
  </div>
</template>

<script lang="ts">
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import { IM } from "@/vocabulary/IM";
import { RDFS } from "@/vocabulary/RDFS";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "InstanceDetails",
  props: { instance: { type: Object as any, required: true }, instanceIri: { type: String, required: true } },
  watch: {
    instance() {
      this.processInstance();
    }
  },
  mounted() {
    this.processInstance();
  },
  data() {
    return {
      instanceName: "",
      instanceData: [] as any[]
    };
  },
  methods: {
    processInstance() {
      if (!isObjectHasKeys(this.instance, ["entity"])) return;
      this.instanceData = [];
      let level = 0;
      this.instanceName = this.instance.entity[RDFS.LABEL];
      Object.keys(this.instance.entity).forEach((predicate: any) => {
        if (predicate === "@id") {
          this.instanceData.push({
            key: level,
            label: this.instance.entity[predicate],
            children: []
          });
        } else if (predicate === IM.ADDRESS) {
          this.instanceData.push({
            key: level,
            label: this.getPredicateName(predicate) + " : ",
            data: this.instance.entity[predicate],
            type: "address",
            children: []
          });
        } else {
          if (Array.isArray(this.instance.entity[predicate])) {
            this.instanceData.push({
              key: level,
              label: this.getPredicateName(predicate) + " : ",
              children: this.getChildren(predicate)
            });
          } else if (typeof this.instance.entity[predicate] === "object") {
            this.instanceData.push({
              key: level,
              label: this.getPredicateName(predicate) + " : ",
              data: this.instance.entity[predicate].name ? this.instance.entity[predicate].name : this.instance.entity[predicate]["@id"],
              children: []
            });
          } else {
            this.instanceData.push({
              key: level,
              label: this.getPredicateName(predicate) + " : ",
              data: this.instance.entity[predicate],
              children: []
            });
          }
        }
        level = level + 1;
      });
    },

    navigate(instance: any) {
      this.$router.push({
        name: "Individual",
        params: { selectedIri: instance["@id"] }
      });
    },

    getPredicateName(iri: string) {
      let name = "";
      this.instance.predicates.forEach((pre: any) => {
        if (pre["@id"] === iri) {
          name = pre.name ? pre.name : pre["@id"];
        }
      });
      return name;
    },
    getChildren(predicate: string) {
      console.log("?");
    }
  }
});
</script>

<style scoped>
#instance-details-container {
  grid-area: content;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
  background-color: #ffffff;
}
</style>
