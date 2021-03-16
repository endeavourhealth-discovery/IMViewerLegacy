<template>
  <div :class="'p-field p-col-'+size">
    <label><strong>{{ property }}: </strong></label>
    <InputText
        type="text"
        :name="property"
        :value="conceptValue"
        @input="$emit('update:componentValue', $event.target.value)"
    />
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({
  name: "TTEdit",
  props: ["property", "prefix", "componentValue", "size", "conceptValue"],
  emits: ["update:componentValue"]
})
export default class TTEdit extends Vue {
}
</script>

<style scoped>

</style>
