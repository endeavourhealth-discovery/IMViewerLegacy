<template>
  <div class="ecl-container">
    <Textarea v-model="ecl" class="eclInput" placeholder="Enter ecl..." :class="eclError ? 'p-invalid' : ''" />
    <Button class="button-submit" label="Submit" @click="submitEcl" />
  </div>
</template>

<script lang="ts">
import { isArrayHasLength, isObjectHasKeys } from "@/helpers/DataTypeCheckers";
import SetService from "@/services/SetService";
import { defineComponent } from "@vue/runtime-core";
import axios from "axios";

export default defineComponent({
  name: "EclInput",
  emits: { "concept-updated": (payload: any) => isObjectHasKeys(payload) },
  watch: {
    ecl() {
      this.eclError = false;
    }
  },
  data() {
    return {
      ecl: "",
      request: {} as { cancel: any; msg: string },
      eclAsNode: [] as any[],
      eclError: false
    };
  },
  methods: {
    async submitEcl() {
      if (isObjectHasKeys(this.request, ["cancel", "msg"])) {
        await this.request.cancel({ status: 499, message: "Process cancelled by user" });
      }
      const axiosSource = axios.CancelToken.source();
      this.request = { cancel: axiosSource.cancel, msg: "Loading..." };
      this.eclAsNode = await SetService.evaluateEcl(this.ecl, axiosSource.token);
      if (isArrayHasLength(this.eclAsNode)) {
        const asIriRefs = this.eclAsNode.map(item => {
          return { "@id": item.iri, name: item.name };
        });
        this.$emit("concept-updated", { "http://endhealth.info/im#definition": [{ "http://www.w3.org/ns/shacl#or": asIriRefs }] });
      } else {
        this.eclError = true;
      }
    }
  }
});
</script>

<style scoped>
.ecl-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  gap: 0.5rem;
}

.eclInput {
  width: 100%;
  flex-grow: 100;
}

.button-submit {
  width: fit-content;
}
</style>
