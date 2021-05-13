<template>
  <Dialog
    :header="header"
    v-model:visible="showDialog"
    :style="{ width: '50vw' }"
    :maximizable="true"
    :modal="true"
    :closable="false"
  >
    <Editor
      @updateValid="updateValid"
      @updateText="updateText"
      @updateConceptDto="updateConceptDto"
      :concept="concept"
      :definitionText="definitionText"
    />
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="p-button-text"
        @click="closeDialog()"
      />

      <div style="all:unset;" v-tooltip="tooltipMessage">
        <Button
          :disabled="!isValidSyntax"
          label="Submit"
          icon="pi pi-check"
          @click="submit(event)"
        />
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ConceptService from "@/services/ConceptService";
import Editor from "./Editor.vue";
import { ConceptDto } from "@/models/ConceptDto";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "EditDialog",
  components: {
    Editor
  },
  props: ["concept", "definitionText", "display", "header"],
  watch: {
    display(newValue) {
      this.showDialog = newValue
    }
  },
  data() {
    return {
      updatedText: "",
      isValidSyntax: true,
      conceptDto: {} as ConceptDto,
      showDialog: this.display
    }
  },
  methods: {
    updateValid(newIsValid: boolean): void {
      this.isValidSyntax = newIsValid;
    },

    updateConceptDto(newConceptDto: ConceptDto): void {
      this.conceptDto = newConceptDto;
    },

    updateText(newText: string): void {
      this.updatedText = newText;
    },

    tooltipMessage(): string {
      if (!this.isValidSyntax) {
        return "Syntax is invalid";
      }
      return "";
    },

    submit(): void {
      this.conceptDto.definitionText = this.updatedText;
      ConceptService.saveConcept(this.conceptDto)
        .then(() => {
          this.closeDialog();
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error("Concept save request failed", err)
          );
        });
    },

    closeDialog(): void {
      this.$emit("closeDialog");
    }
  }
})
</script>

<style scoped></style>
