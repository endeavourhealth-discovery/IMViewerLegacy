<template>
  <Dialog header="Join on properties" :visible="joinDialog" :breakpoints="{ '960px': '75vw' }" :style="{ width: '75vw' }">
    <div>
      <p v-if="!selectedInputs.length">
        No input selected.
      </p>
      <div class="p-fluid p-formgrid p-grid join-instruction" v-else v-for="joinInstruction in joinInstructions" :key="joinInstruction">
        <Button id="remove-join" icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="removeJoin(joinInstruction)" />
        <div class="p-col-2">
          File A
          <Dropdown :options="getInputOptions()" optionLabel="name" optionValue="id" v-model="joinInstruction.dataA" placeholder="Choose join property" />
        </div>
        <div class="p-col-2">
          File B
          <Dropdown :options="getInputOptions()" optionLabel="name" optionValue="id" v-model="joinInstruction.dataB" placeholder="Choose join property" />
        </div>
        <div class="p-col-2">
          Field A
          <Dropdown :options="getJoinPropertyOptions(joinInstruction.dataA)" v-model="joinInstruction.propertyA" placeholder="Choose join property" />
        </div>
        <div class="p-col-2">
          Field B
          <Dropdown :options="getJoinPropertyOptions(joinInstruction.dataB)" v-model="joinInstruction.propertyB" placeholder="Choose join property" />
        </div>
        <div class="p-col">
          Join type
          <Dropdown :options="nestedOptions" v-model="joinInstruction.joinType" placeholder="Choose join property" />
        </div>
        <div v-if="joinInstruction.joinType === 'nested'" class="p-col">
          Nested name
          <InputText type="text" v-model="joinInstruction.nestedPropertyName" placeholder="Choose join property" />
        </div>
      </div>
      <div class="p-fluid p-formgrid p-grid">
        <div class="p-col">
          <Button label="Add join" class="p-button-text" @click="addJoin" />
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" class="p-button-text" icon="pi pi-times" @click="closeJoinDialog" />
      <Button label="Join" icon="pi pi-check" @click="joinInput" />
    </template>
  </Dialog>
</template>
<script lang="ts">
import { TransformInputUpload, JoinInstruction } from "../../../models/transform/TransformInputUpload";
import TransformService from "../../../services/TransformService";
import { defineComponent, PropType } from "vue";
import { isArrayHasLength, isObjectHasKeys } from "@/helpers/DataTypeCheckers";

export default defineComponent({
  name: "JoinInstructionsDialog",
  emits: ["updateInputFromJoinInstructions", "closeJoinDialog"],
  props: {
    selectedInputs: {
      type: Object as PropType<TransformInputUpload[]>,
      required: true
    },
    joinDialog: {
      type: Boolean,
      required: true
    }
  },
  computed: {},
  data() {
    return {
      joinInstructions: [{}] as JoinInstruction[],
      nestedOptions: ["flat", "nested"]
    };
  },
  methods: {
    removeJoin(removedJoin: JoinInstruction) {
      this.joinInstructions = this.joinInstructions.filter(
        join =>
          join.dataA !== removedJoin.dataA &&
          join.dataB !== removedJoin.dataB &&
          join.propertyA !== removedJoin.propertyA &&
          join.propertyB !== removedJoin.propertyB &&
          join.joinType !== removedJoin.joinType
      );
    },
    addJoin() {
      this.joinInstructions.push({} as JoinInstruction);
    },
    async joinInput() {
      const response = await TransformService.join(this.selectedInputs, this.joinInstructions);
      this.$emit("updateInputFromJoinInstructions", response[0]);
      this.$emit("closeJoinDialog", {});
    },

    closeJoinDialog() {
      this.$emit("closeJoinDialog", this.joinInstructions);
    },

    getInputOptions() {
      return this.selectedInputs.map(input => {
        return { name: input.inputFile.name, id: input.id };
      });
    },

    getJoinPropertyOptions(id: string) {
      const found = this.selectedInputs.filter(selectedInput => selectedInput.id === id);
      if (!isArrayHasLength(found) || !isObjectHasKeys(found[0]) || !isArrayHasLength(found[0].inputDisplayJson)) {
        return [];
      }
      return Object.keys(found[0].inputDisplayJson[0]);
    }
  }
});
</script>

<style scoped>
.join-instruction {
  margin: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #dee2e6;
}

#remove-join {
  position: relative;
  top: -20px;
  right: -99%;
}
</style>
