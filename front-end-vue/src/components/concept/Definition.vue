<template>
  <div>
    <div class="p-d-flex p-flex-row p-jc-start summary-container">
      <div class="left-side" v-if="Object.keys(concept).length">
        <div class="p-d-flex p-flex-row p-jc-start p-ai-center">
          <p>
            <strong>Name:</strong>
            {{ concept.name }}
          </p>
        </div>
        <p class="break-text">
          <strong>Iri:</strong>
          {{ concept.iri }}
        </p>
        <p>
          <strong>Status: </strong>
          {{ concept.status }}
        </p>
        <p>
          <strong>Types: </strong>
          {{ conceptTypes }}
        </p>
      </div>
      <div class="right-side" v-if="concept.description">
        <strong>Description:</strong>
        <Description :description="descriptionHTML" />
      </div>
      <div v-if="'iri' in concept" class="copy-container">
        <Button
          icon="pi pi-copy"
          class="p-button-rounded p-button-text p-button-secondary"
          v-clipboard:copy="copyConceptToClipboard(concept)"
          v-clipboard:success="onCopy"
          v-clipboard:error="onCopyError"
          v-tooltip.right="
            'Copy concept to clipboard \n (right click to copy individual properties)'
          "
          @contextmenu="onCopyRightClick"
        />
        <ContextMenu ref="copyMenu" :model="copyMenuItems" />
      </div>
    </div>
    <Divider align="left">
      <div class="p-d-inline-flex p-ai-center">
        <strong>Definitional properties</strong>
      </div>
    </Divider>
    <div class="p-d-flex p-flex-row p-jc-start summary-container">
      <div class="left-side">
        <strong>is a: </strong>{{ concept.isa?.length }}
        <Listbox
          :options="concept.isa"
          listStyle="height: 12rem;"
          v-model="selected"
          @change="navigate(selected.iri)"
        >
          <template #option="slotProps">
            <div>
              {{ slotProps.option?.name || slotProps.option?.["@id"] }}
            </div>
          </template>
        </Listbox>
      </div>
      <div class="right-side">
        <strong>has sub types: </strong>{{ concept.subtypes?.length }}
        <Listbox
          :options="concept.subtypes"
          listStyle="height: 12rem;"
          v-model="selected"
          @change="navigate(selected.iri)"
        >
          <template #option="slotProps">
            <div>
              {{ slotProps.option.name || slotProps.option["@id"] }}
            </div>
          </template>
        </Listbox>
      </div>
    </div>
    <Divider align="left">
      <div class="p-d-inline-flex p-ai-center">
        <strong>Structure properties</strong>
      </div>
    </Divider>
    <Properties :conceptIri="concept.iri" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import Description from "./Description.vue";
import Properties from "./Properties.vue";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "Definition",
  components: { Description, Properties },
  props: ["concept"],
  computed: {
    conceptTypes(): string {
      return this.concept?.types
        ?.map(function(type: any) {
          return type.name;
        })
        .join(", ");
    },

    descriptionHTML(): string {
      const text = this.concept.description?.replaceAll(
        "<p>",
        "</p>\n<p class='description-p'>"
      );
      return "<p class='description-p'>" + text + "</p>";
    }
  },
  watch: {
    concept(newValue) {
      if (Object.keys(newValue).length) {
        this.setCopyMenuItems(newValue);
      }
    }
  },
  mounted() {
    this.setCopyMenuItems(this.concept);
  },
  data() {
    return {
      selected: {},
      copyMenuItems: [] as any
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
    },

    copyConceptToClipboard(concept: any): string {
      let isasString = "";
      let subTypesString = "";
      if (concept.isa.length > 0) {
        isasString = concept.isa.map((item: any) => item.name).join(", ");
      }
      if (concept.subtypes.length > 0) {
        subTypesString = concept.subtypes
          .map((item: any) => item.name)
          .join(", ");
      }
      let returnString =
        "Name: " +
        concept.name +
        ",\nIri: " +
        concept.iri +
        ",\nStatus: " +
        concept.status +
        ",\nType: " +
        concept.types[0].name +
        ",\nIs-a: " +
        "[" +
        isasString +
        "]" +
        ",\nSubtypes: " +
        "[" +
        subTypesString +
        "]";
      if (concept.description) {
        returnString = returnString + ",\nDescription: " + concept.description;
      }
      return returnString;
    },

    onCopy(): void {
      this.$toast.add(LoggerService.success("Value copied to clipboard"));
    },

    onCopyError(): void {
      this.$toast.add(LoggerService.error("Failed to copy value to clipboard"));
    },

    onCopyRightClick(event: any) {
      const x = this.$refs.copyMenu as any;
      x.show(event);
    },

    setCopyMenuItems(concept: any) {
      let isasString = "";
      let subTypesString = "";
      if ("isa" in concept && concept.isa.length > 0) {
        isasString = concept.isa.map((item: any) => item.name).join(", ");
      }
      if ("subtypes" in concept && concept.subtypes.length > 0) {
        subTypesString = concept.subtypes
          .map((item: any) => item.name)
          .join(", ");
      }
      this.copyMenuItems = [
        {
          label: "Copy",
          disabled: true
        },
        {
          separator: true
        },
        {
          label: "All",
          command: async () => {
            await navigator.clipboard
              .writeText(this.copyConceptToClipboard(concept))
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Concept copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error(
                    "Failed to copy concept to clipboard",
                    err
                  )
                );
              });
          }
        },
        {
          label: "Name",
          command: async () => {
            await navigator.clipboard
              .writeText(concept.name)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Name copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy name to clipboard", err)
                );
              });
          }
        },
        {
          label: "Iri",
          command: async () => {
            await navigator.clipboard
              .writeText(concept.iri)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Iri copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy iri to clipboard", err)
                );
              });
          }
        },
        {
          label: "Status",
          command: async () => {
            await navigator.clipboard
              .writeText(concept.status)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Status copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy status to clipboard", err)
                );
              });
          }
        },
        {
          label: "Type",
          command: async () => {
            await navigator.clipboard
              .writeText(concept.types[0].name)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Type copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy type to clipboard", err)
                );
              });
          }
        },
        {
          label: "Is a",
          command: async () => {
            await navigator.clipboard
              .writeText("[" + isasString + "]")
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Is-a's copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy is-a's to clipboard", err)
                );
              });
          }
        },
        {
          label: "Subtypes",
          command: async () => {
            await navigator.clipboard
              .writeText("[" + subTypesString + "]")
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Subtypes copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error(
                    "Failed to copy subtypes to clipboard",
                    err
                  )
                );
              });
          }
        }
      ];
      if (concept.description) {
        this.copyMenuItems.push({
          label: "Description",
          command: async () => {
            await navigator.clipboard
              .writeText(concept.description)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Description copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error(
                    "Failed to copy description to clipboard",
                    err
                  )
                );
              });
          }
        });
      }
    }
  }
});
</script>

<style scoped>
.summary-container {
  width: 100%;
  gap: 7px;
}

.left-side {
  width: 50%;
}

.right-side {
  width: 50%;
}

.custom .p-scrollpanel-wrapper {
  border-right: 9px solid #f4f4f4;
}

.custom .p-scrollpanel-bar {
  background-color: #1976d2 !important;
  opacity: 1;
  transition: background-color 0.3s;
}

.custom .p-scrollpanel-bar:hover {
  background-color: #135ba1 !important;
}

p {
  margin: 0;
}

#synonyms-button {
  margin-left: 0.5em;
}

.break-text {
  word-break: break-all;
}

.description {
  height: 100%;
  width: 100%;
}
.link {
  cursor: pointer;
}

.copy-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}
</style>
