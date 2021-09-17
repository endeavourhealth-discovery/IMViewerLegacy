<template>
  <div v-if="isArrayObjectWithName" :style="{ width: size }">
    <div class="head-container">
      <strong class="label">{{ label }}: </strong>
      <span>{{ data.length }}</span>
      <Button
        icon="pi pi-plus"
        class="p-button-rounded p-button-text p-button-primary p-button-sm expand-button"
        v-styleclass="{ selector: '#' + id, enterClass: 'p-d-none', enterActiveClass: 'my-fadein', leaveActiveClass: 'my-fadeout', leaveToClass: 'p-d-none' }"
      />
    </div>
    <Listbox
      :options="data"
      listStyle="height: 12rem;"
      v-model="selected"
      @change="navigate(selected['@id'])"
      emptyMessage="None"
      :id="id"
      class="p-d-none"
    >
      <template #option="slotProps">
        <div class="data-name">
          {{ slotProps.option?.name || slotProps.option?.["@id"] }}
        </div>
      </template>
    </Listbox>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "ArrayObjectNameListboxWithLabel",
  props: {
    label: { type: String },
    data: { type: Array as PropType<Array<unknown>> },
    size: { type: String },
    id: { type: String }
  },
  computed: {
    isArrayObjectWithName(): boolean {
      if (!this.data) {
        return false;
      }
      if (
        Array.isArray(this.data) &&
        this.data.length &&
        this.data.every(
          item => Object.prototype.toString.call(item) === "[object Object]"
        ) &&
        this.data.every(item =>
          Object.prototype.hasOwnProperty.call(item, "name")
        )
      ) {
        return true;
      } else if (Array.isArray(this.data) && this.data.length === 0) {
        return true;
      } else {
        LoggerService.warn(
          undefined,
          "Data error. Data is not array, array does not contain Object or Object has no property 'name' for use within component ArrayObjectNameListboxWithLabel.vue"
        );
        return false;
      }
    }
  },
  data() {
    return {
      selected: {} as any
    };
  },
  methods: {
    navigate(iri: any) {
      const currentRoute = this.$route.name as RouteRecordName | undefined;
      if (iri)
        this.$router.push({
          name: currentRoute,
          params: { selectedIri: iri }
        });
    }
  }
});
</script>

<style lang="scss" scoped>
.head-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

@keyframes my-fadein {
  0% { opacity: 0 }
  100% { opacity: 1 }
}

@keyframes my-fadeout {
  0% { opacity: 1 }
  100% { opacity: 0 }
}

.my-fadein {
  animation: my-fadein 150ms linear;
}

.my-fadeout {
  animation: my-fadeout 150ms linear;
}
</style>
