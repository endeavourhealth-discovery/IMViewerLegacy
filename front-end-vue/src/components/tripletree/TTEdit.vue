<template>
  <div :class="'p-field p-col-'+size">
    <label><strong>{{ property }}: </strong></label>
    <InputText
        type="text"
        :name="property"
        v-model="editValue"
        v-on:change="onValueChange()"
    />
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({
  name: "TTEdit",
  props: ["property", "prefix", "conceptValue", "size", "conceptValue"],
  emits: ["update:conceptValue"]
})
export default class TTEdit extends Vue {
  conceptValue!: string;
  property!: string;
  editValue: string = this.conceptValue;

  onValueChange(){
    this.$emit("update:NameValue", this.editValue, this.conceptValue)
  }
}
</script>

<style scoped>

</style>
