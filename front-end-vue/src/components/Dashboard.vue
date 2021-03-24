<template>
  <div class="p-grid">
    <div class="p-col-6">
      <Card>
        <template #header>
          <font-awesome-icon
            :icon="['fas', 'map']"
            size="6x"
            style="color:orange; padding:5px"
          />
        </template>
        <template #title> Maps </template>
        <template #subtitle> Data model maps </template>
        <template #content>
          Data model maps specify how data is transformed from a data model to a
          particular database.
        </template>
      </Card>
    </div>
    <div class="p-col-6">
      <Card>
        <template #header>
          <font-awesome-icon
            :icon="['fas', 'tasks']"
            size="6x"
            style="color:brown; padding:5px"
          />
        </template>
        <template #title> Workflow Manager </template>
        <template #subtitle> subtitle </template>
        <template #content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          lectus neque, blandit id posuere vel, ullamcorper ac velit.
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class Dashboard extends Vue {
  msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
