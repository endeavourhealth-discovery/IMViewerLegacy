<template>
  <Dialog
    header="Form"
    v-model:visible="display"
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
import { Options, Vue } from "vue-class-component";
import ConceptService from "@/services/ConceptService";
import Editor from "./Editor.vue";
import { ConceptDto } from "@/models/ConceptDto";

@Options({
  name: "EditDialog",
  components: {
    Editor
  },
  props: ["concept", "definitionText", "display"]
})
export default class EditorDialog extends Vue {
  private updatedText = "";
  private isValidSyntax = true;
  private conceptDto = {} as ConceptDto;

  updateValid(newIsValid: boolean) {
    this.isValidSyntax = newIsValid;
  }

  updateConceptDto(newConceptDto: ConceptDto) {
    this.conceptDto = newConceptDto;
  }

  updateText(newText: string) {
    this.updatedText = newText;
  }

  get tooltipMessage() {
    if (!this.isValidSyntax) {
      return "Syntax is invalid";
    }
    return "";
  }

  submit() {
    this.conceptDto.definitionText = this.updatedText;
    ConceptService.saveConcept(this.conceptDto)
      .then(() => {
        this.closeDialog();
      })
      .catch(err => {
        console.log(err);
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: "Concept save failed with server",
          // life: 3000
        });
      });
  }

  closeDialog() {
    this.$emit("closeDialog");
  }
}
</script>

<style scoped></style>
