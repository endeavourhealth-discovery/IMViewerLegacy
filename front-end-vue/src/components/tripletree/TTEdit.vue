<template>
  <div :class="'p-field p-col-'+size">
    <label><strong>{{ label }}: </strong></label>
    <InputText
        type="text"
        :name="predicate"
        :value="componentValue"
        @input="$emit('update:componentValue', $event.target.value)"/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({
  props: ["label", "predicate", "componentValue", "size"],
  emits: ["update:componentValue"]
})
export default class TTEdit extends Vue {
}
</script>

<style scoped>

</style>
